import {getRandomNumber, clearSection} from './utils';
import {makeFilter} from './make-filter';
import {makePoint} from './make-point';
import {makeRandomPoint} from "./make-random-point";
import {DATA_FILTERS} from './data';

const STATE = {
  startNumberPoints: 7,
  minNumberPoints: 1,
  startDataIndex: 0
};

const FILTERS_SECTION = document.querySelector(`.trip-filter`);
const POINT_SECTION = document.querySelector(`.trip-day__items`);

const createFilters = (data, section) => {
  data.forEach((item) => section.insertAdjacentHTML(`beforeend`, makeFilter(item)));
};

const createNumPoints = (callback, num, section) => {
  for (let i = 0; i < num; i++) {
    let randomPoint = callback();
    section.insertAdjacentHTML(`beforeend`, makePoint(randomPoint));
  }
};

clearSection(FILTERS_SECTION);
clearSection(POINT_SECTION);
createFilters(DATA_FILTERS, FILTERS_SECTION);
createNumPoints(makeRandomPoint, STATE.startNumberPoints, POINT_SECTION);

FILTERS_SECTION.addEventListener(`change`, (e) => {
  e.preventDefault();
  if (e.target.tagName.toLowerCase() === `input`) {
    clearSection(POINT_SECTION);
    createNumPoints(makeRandomPoint, getRandomNumber(STATE.minNumberPoints, STATE.startNumberPoints), POINT_SECTION);
  }
});
