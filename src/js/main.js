import {clearSection, convertNewEventData, getId, deleteArrayItem} from './utils';
import {DATA_FILTERS, DATA_SORTING_FILTERS, POINT_DEFAULT_DATA} from './data';
import {initStat} from "./statictic";
import Point from "./point";
import Trip from "./trip";
import Filter from "./filter";
import API from "./api";
import Provider from "./provider";
import Store from "./store";
import moment from 'moment';
import TravelDay from './travel-day';

const DAYS_SECTION = document.querySelector(`.trip-points`);
const FILTERS_SECTION = document.querySelector(`.trip-filter`);
const SORTING_SECTION = document.querySelector(`.trip-sorting`);
const ACTIVE_BUTTON_CLASS = `view-switch__item--active`;
const SECTION_MAIN = document.querySelector(`.main`);
const SECTION_STATISTIC = document.querySelector(`.statistic`);
const BUTTON_TABLE = document.querySelector(`.view-switch__item[href="#table"]`);
const BUTTON_STATISTIC = document.querySelector(`.view-switch__item[href="#stats"]`);
const TOTAL_PRICE_SECTION = document.querySelector(`.trip__total-cost`);
const BUTTON_NEW_EVENT = document.querySelector(`.new-event`);
const Messages = {
  loading: `Loading route...`,
  error: `Something went wrong while loading your route info. Check your connection or try again later`,
};
const ERROR_STYLE = `1px solid #ff0000`;
DAYS_SECTION.textContent = Messages.loading;

const POINT_STORE_KEY = `points-store-key`;
const api = new API();
const store = new Store({key: POINT_STORE_KEY, storage: localStorage});
const provider = new Provider({api, store, generateId: getId});

let points = null;
let eventsDestination = null;
let eventsOffers = null;

let stateEvents = null;

// ---------------------
let deliting = false;
let priceFlag = true;
let timeFlag = true;
let filteredEvents = null;
// let currentSorting = `everyting`; // future, past
// ---------------------

const getSortedEventByDay = (events) => {
  let result = {};
  for (let point of events) {
    const day = moment(point.timeline[0]).format(`D MMM YY`);
    if (!result[day]) {
      result[day] = [];
    }
    result[day].push(point);
  }

  return result;
};
const renderDays = (events) => {
  clearSection(DAYS_SECTION);
  const pointSortedDay = getSortedEventByDay(events);
  Object.entries(pointSortedDay).forEach((item) => {
    const [day, eventList] = item;
    const dayData = new TravelDay(day).render();
    DAYS_SECTION.appendChild(dayData);
    const distEvents = dayData.querySelector(`.trip-day__items`);
    renderPoints(eventList, distEvents);
  });
};
const renderPoints = (data, dist) => {
  clearSection(dist);
  for (let item of data) {
    let point = new Point(item);
    let trip = new Trip(item, eventsOffers, eventsDestination);

    point.onClick = () => {
      trip.render();
      dist.replaceChild(trip.element, point.element);
      point.destroy();
    };

    point.onClickOffer = (newData) => {
      if (points[newData.id] === newData.id) {
        points[newData.id].offers = newData.offers;
      }
      getTotalPrice(points);
    };

    trip.onSubmit = (newData) => {
      item.type = newData.type;
      item.city = newData.city;
      item.offers = newData.offers;
      item.price = newData.price;
      item.timeline = newData.timeline;
      item.favorite = newData.favorite;

      trip.lockToSaving();
      provider.updatePoint({id: item.id, data: item.toRAW()})
        .then((response) => {
          if (response) {
            point.update(response);
            point.render();
            filteredEvents = getEvents(points);
            renderDays(points);
          }
        })
        .catch(() => {
          trip.shake();
          trip.element.style.border = ERROR_STYLE;
        })
        .then(() => {
          trip.unlockToSave();
          trip.destroy();
        });

      getTotalPrice(points);
    };

    trip.onDelete = ({id}) => {
      deliting = true;
      trip.lockToDeleting();
      provider.deletePoint({id})
        .then(() => provider.getPoints())
        .then(renderDays)
        .then(() => {
          trip.unlockToDelete();
        })
        .catch(() => {
          trip.shake();
          trip.element.style.border = ERROR_STYLE;
        })
        .then(() => {
          trip.unlockToDelete();
          trip.destroy();
          deliting = false;
        });

      deleteArrayItem(points, item);
      filteredEvents = getEvents(points);
      getTotalPrice(points);
    };

    trip.onKeydownEsc = () => {
      if (deliting) {
        return;
      }
      point.render();
      dist.replaceChild(point.element, trip.element);
      trip.destroy();
    };

    point.render();
    dist.appendChild(point.element);
  }
};

BUTTON_NEW_EVENT.addEventListener(`click`, () => {
  BUTTON_NEW_EVENT.disabled = true;
  let newPointEdit = new Trip(POINT_DEFAULT_DATA, eventsOffers, eventsDestination);
  DAYS_SECTION.insertBefore(newPointEdit.render(), DAYS_SECTION.firstChild);

  newPointEdit.onSubmit = (newData) => {
    newPointEdit.lockToSaving();
    provider.createPoint({point: convertNewEventData(newData)})
      .then((newPoint) => {
        newPointEdit.unlockToSave();
        points.push(newPoint);
        getTotalPrice(points);
        filteredEvents = getEvents(points);
        renderDays(filteredEvents[stateEvents]);
      })
      .catch(() => {
        newPointEdit.shake();
        newPointEdit.element.style.border = ERROR_STYLE;
      })
      .then(() => {
        newPointEdit.element.style.border = ``;
        BUTTON_NEW_EVENT.disabled = false;
      });
  };

  newPointEdit.onDelete = () => {
    newPointEdit.lockToDeleting();
    newPointEdit.destroy();
    filteredEvents = getEvents(points);
    renderDays(points);
    BUTTON_NEW_EVENT.disabled = false;
  };

  newPointEdit.onKeydownEsc = () => {
    newPointEdit.lockToDeleting();
    newPointEdit.destroy();
    renderDays(points);
    BUTTON_NEW_EVENT.disabled = false;
  };
});

const getTotalPrice = (arrEvents) => {
  let finalAmount = 0;
  for (let item of arrEvents) {
    finalAmount += +item[`price`];
    finalAmount += +item.offers.filter((it) => it.accepted).reduce((acc, offer) => acc + offer.price, false);
  }
  TOTAL_PRICE_SECTION.textContent = `€ ${finalAmount}`;
};

const renderFilters = (data, section, type) => {
  for (let item of data) {
    const filter = new Filter(item, type);

    filter.onFilter = () => {
      let currentData = filteredEvents[filter.name];
      if (filter.name !== `time` && filter.name !== `price`) {

        renderDays(currentData);
      }

      if (filter.name === `time` || filter.name === `price`) {
        let action = sortingName[filter.name];
        renderPoints(action(filteredEvents[filter[`past`]]), DAYS_SECTION);
      }
    };

    filter.render();
    section.appendChild(filter.element);
  }
};

const eventsName = [`everything`, `future`, `past`]; // !!!
const sortingName = {
  event(arr) {
    return arr;
  },
  price(arr) {
    priceFlag = !priceFlag;
    let sortP = {
      'asc': (a, b) => b.price - a.price,
      'desc': (a, b) => a.price - b.price,
    };
    return arr.sort(sortP[priceFlag ? `asc` : `desc`]);
  },
  time(arr) {
    timeFlag = !timeFlag;
    let sortT = {
      'asc': (a, b) => b.timeline[0] - a.timeline[0],
      'desc': (a, b) => a.timeline[0] - b.timeline[0],
    };
    return arr.sort(sortT[timeFlag ? `asc` : `desc`]);
  },
};

const getEvents = (arr) => {
  let res = {};
  let arrRes = arr.slice();
  for (let name of eventsName) {
    res[name] = filterPoint(arrRes, name);
  }
  return res;
};

const filterPoint = (arr, filterName) => {
  let result = arr.slice();
  const name = filterName.toLowerCase();
  switch (name) {
    case `everything`:
      return result;
    case `future`:
      return result.filter((item) => new Date() < new Date(item.timeline[0]));
    case `past`:
      return result.filter((item) => new Date() > new Date(item.timeline[0]));
    default:
      return result;
  }
};

const onBtnStatisticClick = (e) => {
  e.preventDefault();
  if (!e.target.classList.contains(ACTIVE_BUTTON_CLASS)) {
    BUTTON_TABLE.classList.remove(ACTIVE_BUTTON_CLASS);
    e.target.classList.add(ACTIVE_BUTTON_CLASS);
    SECTION_MAIN.classList.add(`visually-hidden`);
    SORTING_SECTION.classList.add(`visually-hidden`);
    FILTERS_SECTION.classList.add(`visually-hidden`);
    SECTION_STATISTIC.classList.remove(`visually-hidden`);
    BUTTON_NEW_EVENT.disabled = true;
    initStat(points);
  }
};
const onBtnTableClick = (e) => {
  e.preventDefault();
  if (!e.target.classList.contains(ACTIVE_BUTTON_CLASS)) {
    BUTTON_STATISTIC.classList.remove(ACTIVE_BUTTON_CLASS);
    e.target.classList.add(ACTIVE_BUTTON_CLASS);
    SECTION_MAIN.classList.add(`visually-hidden`);
    SECTION_STATISTIC.classList.remove(`visually-hidden`);
    FILTERS_SECTION.classList.remove(`visually-hidden`);
    SORTING_SECTION.classList.remove(`visually-hidden`);
    SECTION_MAIN.classList.remove(`visually-hidden`);
    SECTION_STATISTIC.classList.add(`visually-hidden`);
    BUTTON_NEW_EVENT.disabled = false;
  }
};
window.addEventListener(`offline`, () => {
  document.title = `${document.title}[OFFLINE]`;
});
window.addEventListener(`online`, () => {
  document.title = document.title.split(`[OFFLINE]`)[0];
  provider.syncPoints();
});

document.addEventListener(`DOMContentLoaded`, () => {
  Promise.all([provider.getPoints(), provider.getDestinations(), provider.getOffers()])
    .then(([responseEvents, responseDestinations, responseOffers]) => {
      points = responseEvents;
      eventsDestination = responseDestinations;
      eventsOffers = responseOffers;
      filteredEvents = getEvents(points);
      getTotalPrice(points);
      renderDays(points);
    })
    .catch(() => {
      DAYS_SECTION.textContent = Messages.error;
    });
});

renderFilters(DATA_FILTERS, FILTERS_SECTION);
renderFilters(DATA_SORTING_FILTERS, SORTING_SECTION, `sort`);
BUTTON_STATISTIC.addEventListener(`click`, onBtnStatisticClick);
BUTTON_TABLE.addEventListener(`click`, onBtnTableClick);
