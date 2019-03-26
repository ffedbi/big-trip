import {clearSection} from './utils';
import {makeRandomPointDataArray} from "./make-random-point-data-array";
import {DATA_FILTERS} from './data';
import Point from "./point";
import Trip from "./trip";
import {initStat} from "./statictic";
import Filter from "./filter";

const STATE = {
  startNumberPoints: 7,
  minNumberPoints: 1,
  startDataIndex: 0,
};

const pointData = makeRandomPointDataArray(STATE.startNumberPoints);
const FILTERS_SECTION = document.querySelector(`.trip-filter`);
const POINT_SECTION = document.querySelector(`.trip-day__items`);
const ACTIVE_BUTTON_CLASS = `view-switch__item--active`;
const MAIN = document.querySelector(`.main`);
const STATISTIC = document.querySelector(`.statistic`);

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

const renderNumPoints = (data, section) => {
  for (let item of data) {
    let point = new Point(item);
    let trip = new Trip(item);

    point.onClick = () => {
      trip.render();
      section.replaceChild(trip.element, point.element);
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
      section.replaceChild(point.element, trip.element);
      trip.destroy();
    };

    trip.onDelete = () => {
      deletePoint(trip, item);
      trip.element.remove();
      trip.destroy();
    };

    point.render();
    section.appendChild(point.element);
  }
};

// eslint-disable-next-line consistent-return
const filterPoint = (points, filterName) => {
  switch (filterName) {
    case `everything`:
      return points;
    case `future`:
      return points.filter((item) => new Date() < new Date(item.timeline[0]));
    case `past`:
      return points.filter((item) => new Date() > new Date(item.timeline[0]));
  }
};

clearSection(FILTERS_SECTION);
clearSection(POINT_SECTION);
renderFilters(DATA_FILTERS, FILTERS_SECTION);
renderNumPoints(pointData, POINT_SECTION);

document.querySelector(`.view-switch`).addEventListener(`click`, (e) => {
  e.preventDefault();
  let viewType = e.target.getAttribute(`href`);

  if (viewType === `#stats`) {
    e.target.classList.add(ACTIVE_BUTTON_CLASS);
    MAIN.classList.add(`visually-hidden`);
    STATISTIC.classList.remove(`visually-hidden`);
    initStat(pointData);
  }

  if (viewType === `#table`) {
    e.target.classList.add(ACTIVE_BUTTON_CLASS);
    MAIN.classList.remove(`visually-hidden`);
    STATISTIC.classList.add(`visually-hidden`);
  }
});

