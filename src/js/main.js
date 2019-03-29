import {clearSection} from './utils';
import {makeRandomPointDataArray} from "./make-random-point-data-array";
import {DATA_FILTERS} from './data';
import {initStat} from "./statictic";
import Point from "./point";
import Trip from "./trip";
import Filter from "./filter";

const START_NUM_POINTS = 7;
const FILTERS_SECTION = document.querySelector(`.trip-filter`);
const POINT_SECTION = document.querySelector(`.trip-day__items`);
const ACTIVE_BUTTON_CLASS = `view-switch__item--active`;
const MAIN = document.querySelector(`.main`);
const STATISTIC = document.querySelector(`.statistic`);
const BUTTON_TABLE = document.querySelector(`.view-switch__item[href="#table"]`);
const BUTTON_STATISTIC = document.querySelector(`.view-switch__item[href="#stats"]`);
let pointData = makeRandomPointDataArray(START_NUM_POINTS);

const AUTHORIZATION = `Basic eo0w590ik29889a=${Math.random()}`;
const END_POINT = ` https://es8-demo-srv.appspot.com/big-trip/`;

const renderFilters = (data, section) => {
  for (let item of data) {
    const filter = new Filter(item);

    filter.onFilter = () => {
      clearSection(POINT_SECTION);
      let newPointData = filterPoint(pointData, filter.name);
      renderNumPoints(newPointData, POINT_SECTION);
    };

    filter.render();
    section.appendChild(filter.element);
  }
};

const deletePoint = (trip, id) => {
  pointData.splice(id, 1);
  return trip;
};

const renderNumPoints = (data) => {
  clearSection(POINT_SECTION)
  for (let item of data) {
    let point = new Point(item);
    let trip = new Trip(item);

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

      point.update(item);
      point.render();
      POINT_SECTION.replaceChild(point.element, trip.element);
      trip.destroy();
    };

    trip.onDelete = () => {
      deletePoint(trip, item);
      trip.element.remove();
      trip.destroy();
    };

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
    initStat(pointData);
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
renderFilters(DATA_FILTERS, FILTERS_SECTION);
renderNumPoints(pointData, POINT_SECTION);
BUTTON_STATISTIC.addEventListener(`click`, onBtnStatisticClick);
BUTTON_TABLE.addEventListener(`click`, onBtnTableClick);
