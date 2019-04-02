import {clearSection} from './utils';
import {DATA_FILTERS} from './data';
import {initStat} from "./statictic";
import Point from "./point";
import Trip from "./trip";
import Filter from "./filter";
import API from "./api";

const FILTERS_SECTION = document.querySelector(`.trip-filter`);
const POINT_SECTION = document.querySelector(`.trip-day__items`);
const ACTIVE_BUTTON_CLASS = `view-switch__item--active`;
const MAIN = document.querySelector(`.main`);
const STATISTIC = document.querySelector(`.statistic`);
const BUTTON_TABLE = document.querySelector(`.view-switch__item[href="#table"]`);
const BUTTON_STATISTIC = document.querySelector(`.view-switch__item[href="#stats"]`);
const TOTAL_PRICE_EL = document.querySelector(`.trip__total-cost`);
// const BUTTON_NEW_EVENT = document.querySelector(`.new-event`);

const AUTHORIZATION = `Basic eo0w590ik29889a=${Math.random()}`;
const END_POINT = ` https://es8-demo-srv.appspot.com/big-trip/`;
const api = new API({endPoint: END_POINT, authorization: AUTHORIZATION});
let arrPoints = null;
let dest = [];
let offers = null;

const msg = {
  loading: `Loading route...`,
  error: `Something went wrong while loading your route info. Check your connection or try again later`,
};

document.addEventListener(`DOMContentLoaded`, () => {
  api.getDestinations()
    .then((data) => {
      dest = data;
    });

  api.getOffers()
    .then((offersData) => {
      offers = offersData;
    });

  api.getPoints()
    .then((points) => {
      POINT_SECTION.textContent = msg.loading;
      arrPoints = points;
      renderNumPoints(arrPoints);
    })
    .catch(() => {
      POINT_SECTION.textContent = msg.error;
    });
});

const getTotalPrice = (arrEvents) => {
  let acc = 0;
  for (let item of arrEvents) {
    acc += +item[`price`];
  }

  TOTAL_PRICE_EL.textContent = `€ ${acc}`;
};

const renderFilters = (data, section) => {
  for (let item of data) {
    const filter = new Filter(item);

    filter.onFilter = () => {
      clearSection(POINT_SECTION);
      let newPointData = filterPoint(arrPoints, filter.name);
      renderNumPoints(newPointData, POINT_SECTION);
    };

    filter.render();
    section.appendChild(filter.element);
  }
};

const deletePoint = (trip, id) => {
  arrPoints.splice(id, 1);
  return trip;
};

const renderNumPoints = (data) => {
  clearSection(POINT_SECTION);
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    let point = new Point(item);
    let trip = new Trip(item, offers, dest);

    point.onClick = () => {
      trip.render();
      POINT_SECTION.replaceChild(trip.element, point.element);
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
      api.updatePoint({id: item.id, data: item.toRAW()})
        .then((response) => {
          if (response) {
            point.update(response);
            point.render();
            POINT_SECTION.replaceChild(point.element, trip.element);
          }
        })
        .catch(() => {
          trip.shake();
          trip.element.style.border = `1px solid #ff0000`;
        })
        .then(() => {
          trip.unlockToSave();
          trip.destroy();
          getTotalPrice(data);
        });
    };

    trip.onDelete = ({id}) => {
      trip.lockToDeleting();
      api.deleteTask({id})
        .then(() => api.getPoints())
        .then(renderNumPoints)
        .catch(() => {
          trip.shake();
          trip.element.style.border = `1px solid #ff0000`;
        })
        .then(() => {
          trip.unlockToDelete();
          trip.destroy();
        });

      deletePoint(arrPoints, item);
    };

    trip.onKeydownEsc = () => {
      point.render();
      POINT_SECTION.replaceChild(point.element, trip.element);
      trip.destroy();
    };

    getTotalPrice(data);
    point.render();
    POINT_SECTION.appendChild(point.element);
  }
};

const filterPoint = (points, filterName) => {
  let result;
  const name = filterName.toLowerCase();
  switch (name) {
    case `everything`:
      result = points;
      break;
    case `future`:
      result = points.filter((item) => new Date() < new Date(item.timeline[0]));
      break;
    case `past`:
      result = points.filter((item) => new Date() > new Date(item.timeline[0]));
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
    initStat(arrPoints);
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

clearSection(FILTERS_SECTION);
clearSection(POINT_SECTION);
renderFilters(DATA_FILTERS, FILTERS_SECTION);
BUTTON_STATISTIC.addEventListener(`click`, onBtnStatisticClick);
BUTTON_TABLE.addEventListener(`click`, onBtnTableClick);
