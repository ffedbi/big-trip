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
DAYS_SECTION.textContent = Messages.loading;
const POINT_STORE_KEY = `points-store-key`;
const api = new API();
const store = new Store({key: POINT_STORE_KEY, storage: localStorage});
const provider = new Provider({api, store, generateId: getId});

let points = null;
let eventsDestination = null;
let eventsOffers = null;

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
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    let point = new Point(item);
    let trip = new Trip(item, eventsOffers, eventsDestination);

    point.onClick = () => {
      trip.render();
      dist.replaceChild(trip.element, point.element);
      point.destroy();
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
            dist.replaceChild(point.element, trip.element);
          }
        })
        .catch(() => {
          trip.shake();
          trip.element.style.border = `1px solid #ff0000`;
        })
        .then(() => {
          trip.unlockToSave();
          trip.destroy();
        });

      getTotalPrice(points);
    };

    trip.onDelete = ({id}) => {
      trip.lockToDeleting();
      provider.deletePoint({id})
        .then(() => provider.getPoints())
        .then(renderDays)
        .then(() => {
          trip.unlockToDelete();
          trip.destroy();
        })
        .catch(() => {
          trip.shake();
          trip.element.style.border = `1px solid #ff0000`;
        })
        .then(() => {
          trip.unlockToDelete();
          trip.destroy();
        });

      deleteArrayItem(points, item);
      getTotalPrice(points);
    };

    trip.onKeydownEsc = () => {
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
        renderDays(points);
      })
      .catch(() => {
        newPointEdit.shake();
        newPointEdit.element.style.border = `1px solid #ff0000`;
      })
      .then(() => {
        newPointEdit.element.style.border = ``;
        BUTTON_NEW_EVENT.disabled = false;
      });
  };

  newPointEdit.onDelete = () => {
    newPointEdit.lockToDeleting();
    newPointEdit.destroy();
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
  }

  TOTAL_PRICE_SECTION.textContent = `€ ${finalAmount}`;
};

const renderFilters = (data, section, type) => {
  for (let item of data) {
    const filter = new Filter(item, type);

    filter.onFilter = () => {
      clearSection(DAYS_SECTION);
      let newPointData = filterPoint(points, filter.name);
      renderDays(newPointData);
    };

    filter.render();
    section.appendChild(filter.element);
  }
};

const filterPoint = (events, filterName) => {
  let result;
  const name = filterName.toLowerCase();
  switch (name) {
    case `everything`:
    case `offers`:
      result = events;
      break;
    case `future`:
      result = events.filter((item) => new Date() < new Date(item.timeline[0]));
      break;
    case `past`:
      result = events.filter((item) => new Date() > new Date(item.timeline[0]));
      break;
    case `price`:
      result = events.sort((a, b) => b.price - a.price);
      break;
    case `time`:
      result = events.sort((a, b) => b.timeline[0] - a.timeline[0]);
      break;
    default:
      result = events;
  }
  return result;
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
      getTotalPrice(points);
      renderDays(points);
    })
    .catch(() => {
      DAYS_SECTION.textContent = Messages.error;
    });
});

renderFilters(DATA_FILTERS, FILTERS_SECTION);
renderFilters(DATA_SORTING_FILTERS, SORTING_SECTION, `sorting`);
BUTTON_STATISTIC.addEventListener(`click`, onBtnStatisticClick);
BUTTON_TABLE.addEventListener(`click`, onBtnTableClick);
