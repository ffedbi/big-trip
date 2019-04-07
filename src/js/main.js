import {clearSection, getId, POINT_DEFAULT_DATA} from './utils';
import {DATA_FILTERS, DATA_SORTING_FILTERS} from './data';
import {initStat} from "./statictic";
import Point from "./point";
import Trip from "./trip";
import Filter from "./filter";
import API from "./api";
import Provider from "./provider";
import Store from "./store";
import moment from 'moment';
import TravelDay from './travel-day';

const DAYS_BLOCK = document.querySelector(`.trip-points`);
const FILTERS_SECTION = document.querySelector(`.trip-filter`);
const SORTING_SECTION = document.querySelector(`.trip-sorting`);
const ACTIVE_BUTTON_CLASS = `view-switch__item--active`;
const MAIN = document.querySelector(`.main`);
const STATISTIC = document.querySelector(`.statistic`);
const BUTTON_TABLE = document.querySelector(`.view-switch__item[href="#table"]`);
const BUTTON_STATISTIC = document.querySelector(`.view-switch__item[href="#stats"]`);
const TOTAL_PRICE_EL = document.querySelector(`.trip__total-cost`);
const BUTTON_NEW_EVENT = document.querySelector(`.new-event`);

const POINT_STORE_KEY = `points-store-key`;
const api = new API();
const store = new Store({key: POINT_STORE_KEY, storage: localStorage});
const provider = new Provider({api, store, generateId: getId});
let eventsData = null;
let eventsDestination = null;
let eventsOffers = null;

const createArrayDates = (arrayPointsData) => {
  let arrayDates = [];
  for (let point of arrayPointsData) {
    const DAY = moment(point.timeline[0]).format(`D MMM YY`);
    if (arrayDates.indexOf(DAY) === -1) {
      arrayDates.push(DAY);
    }
  }
  return arrayDates;
};

const renderDays = (arrayPointsData) => {
  clearSection(DAYS_BLOCK);
  const arrayDates = createArrayDates(arrayPointsData);
  for (let date of arrayDates) {
    const DAY = new TravelDay(date);
    const ARRAY_FILTERED_EVENTS = arrayPointsData.filter((point) => moment(point.timeline[0]).format(`D MMM YY`) === date);
    const DAY_ELEMENT_FROM_HTML = DAY.render();
    DAYS_BLOCK.appendChild(DAY_ELEMENT_FROM_HTML);
    const DIST_EVENTS = DAY_ELEMENT_FROM_HTML.querySelector(`.trip-day__items`);
    renderPoints(ARRAY_FILTERED_EVENTS, DIST_EVENTS);
  }
};

BUTTON_NEW_EVENT.addEventListener(`click`, () => {
  let newPointEdit = new Trip(POINT_DEFAULT_DATA, eventsOffers, eventsDestination);
  newPointEdit.render();
  DAYS_BLOCK.insertBefore(newPointEdit.element, DAYS_BLOCK.firstChild);

  newPointEdit.onSubmit = (newData) => {
    window.console.log(newData);
    provider.createPoint({point: newData});
  };
});

const Messages = {
  loading: `Loading route...`,
  error: `Something went wrong while loading your route info. Check your connection or try again later`,
};

DAYS_BLOCK.textContent = Messages.loading;

document.addEventListener(`DOMContentLoaded`, () => {
  provider.getPoints()
    .then((points) => {
      eventsData = points;
      renderDays(eventsData);
      getTotalPrice(eventsData);
    })
    .catch(() => {
      DAYS_BLOCK.textContent = Messages.error;
    });

  provider.getDestinations()
    .then((data) => {
      eventsDestination = data;
    });

  provider.getOffers()
    .then((offersData) => {
      eventsOffers = offersData;
    });
});

const getTotalPrice = (arrEvents) => {
  let acc = 0;
  for (let item of arrEvents) {
    acc += +item[`price`];
  }

  TOTAL_PRICE_EL.textContent = `€ ${acc}`;
};

const renderFilters = (data, section, type) => {
  for (let item of data) {
    const FILTER = new Filter(item, type);

    FILTER.onFilter = () => {
      clearSection(DAYS_BLOCK);
      let newPointData = filterPoint(eventsData, FILTER.name);
      renderDays(newPointData);
    };

    FILTER.render();
    section.appendChild(FILTER.element);
  }
};

const deletePoint = (trip, id) => {
  eventsData.splice(id, 1);
  return trip;
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
    };

    trip.onDelete = ({id}) => {
      trip.lockToDeleting();
      provider.deletePoint({id})
        .then(() => provider.getPoints())
        .then(renderDays)
        .catch(() => {
          trip.shake();
          trip.element.style.border = `1px solid #ff0000`;
        })
        .then(() => {
          trip.unlockToDelete();
          trip.destroy();
        });

      deletePoint(eventsData, item);
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

const filterPoint = (points, filterName) => {
  let result;
  const NAME = filterName.toLowerCase();
  switch (NAME) {
    case `everything`:
    case `offers`:
      result = points;
      break;
    case `future`:
      result = points.filter((item) => new Date() < new Date(item.timeline[0]));
      break;
    case `past`:
      result = points.filter((item) => new Date() > new Date(item.timeline[0]));
      break;
    case `price`:
      result = points.sort((a, b) => b.price - a.price);
      break;
    case `time`:
      result = points.sort((a, b) => b.timeline[0] - a.timeline[0]);
      break;
    default:
      result = points;
  }
  return result;
};

const onBtnStatisticClick = (e) => {
  e.preventDefault();
  if (!e.target.classList.contains(ACTIVE_BUTTON_CLASS)) {
    BUTTON_TABLE.classList.remove(ACTIVE_BUTTON_CLASS);
    e.target.classList.add(ACTIVE_BUTTON_CLASS);
    MAIN.classList.add(`visually-hidden`);
    STATISTIC.classList.remove(`visually-hidden`);
    initStat(eventsData);
  }
};

const onBtnTableClick = (e) => {
  e.preventDefault();
  if (!e.target.classList.contains(ACTIVE_BUTTON_CLASS)) {
    BUTTON_STATISTIC.classList.remove(ACTIVE_BUTTON_CLASS);
    e.target.classList.add(ACTIVE_BUTTON_CLASS);
    MAIN.classList.add(`visually-hidden`);
    STATISTIC.classList.remove(`visually-hidden`);
    MAIN.classList.remove(`visually-hidden`);
    STATISTIC.classList.add(`visually-hidden`);
  }
};

window.addEventListener(`offline`, () => {
  document.title = `${document.title}[OFFLINE]`;
});

window.addEventListener(`online`, () => {
  document.title = document.title.split(`[OFFLINE]`)[0];
  provider.syncPoints();
});

renderFilters(DATA_FILTERS, FILTERS_SECTION);
renderFilters(DATA_SORTING_FILTERS, SORTING_SECTION, `sorting`);
BUTTON_STATISTIC.addEventListener(`click`, onBtnStatisticClick);
BUTTON_TABLE.addEventListener(`click`, onBtnTableClick);
