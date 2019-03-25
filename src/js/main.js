import {clearSection} from './utils';
import {makeArrData} from "./make-random-point-data";
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

const pointData = makeArrData(STATE.startNumberPoints);
const FILTERS_SECTION = document.querySelector(`.trip-filter`);
const POINT_SECTION = document.querySelector(`.trip-day__items`);

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

// eslint-disable-next-line consistent-return
const filterPoint = (points, filterName) => {
  switch (filterName) {
    case `everything`:
      return points;
    case `Future`:
      return points.filter((item) => new Date() < Date.new(item.timeline));
    case `Past`:
      return points.filter((item) => new Date() > Date.new(item.timeline));
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

clearSection(FILTERS_SECTION);
clearSection(POINT_SECTION);
renderFilters(DATA_FILTERS, FILTERS_SECTION);
renderNumPoints(pointData, POINT_SECTION);

initStat();

