import {getRandomNumber, getRandomArrayItem, clearSection} from './utils';
import createFilter from './make-filter';
import createPoints from './make-point';
import {DATA_FILTERS, DATA_POINTS} from './data';

const STATE = {
  startNumberPoints: 7,
  minNumberPoints: 1,
  startDataIndex: 0
};

const FILTERS_SECTION = document.querySelector(`.trip-filter`);
const POINT_SECTION = document.querySelector(`.trip-day__items`);

const createFilters = (data, section) => {
  data.forEach((item) => section.insertAdjacentHTML(`beforeend`, createFilter(item.name, item.isChecked)));
};

const createNumPoints = (data, num, section) => {
  for (let i = 0; i < num; i++) {
    section.insertAdjacentHTML(`beforeend`, createPoints(data.icon, data.title, data.timeline, data.duration, data.price, data.offers));
  }
};

clearSection(FILTERS_SECTION);
clearSection(POINT_SECTION);
createFilters(DATA_FILTERS, FILTERS_SECTION);
createNumPoints(DATA_POINTS[STATE.startDataIndex], STATE.startNumberPoints, POINT_SECTION);

FILTERS_SECTION.addEventListener(`change`, (e) => {
  e.preventDefault();
  if (e.target.tagName.toLowerCase() === `input`) {
    clearSection(POINT_SECTION);
    createNumPoints(getRandomArrayItem(DATA_POINTS), getRandomNumber(STATE.minNumberPoints, STATE.startNumberPoints), POINT_SECTION);
  }
});
