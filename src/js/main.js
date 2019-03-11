import {getRandomNumber, clearSection} from './utils';
import {makeHtmlFilter} from './make-html-filter';
import {makeRandomDataPoint} from "./make-random-data-point";
import {DATA_FILTERS} from './data';
import {Point} from "./point";
import {Trip} from "./trip";

const STATE = {
  startNumberPoints: 7,
  minNumberPoints: 1,
  startDataIndex: 0,
};

const FILTERS_SECTION = document.querySelector(`.trip-filter`);
const POINT_SECTION = document.querySelector(`.trip-day__items`);

const renderFilters = (data, section) => {
  data.forEach((item) => section.insertAdjacentHTML(`beforeend`, makeHtmlFilter(item)));
};

const renderNumPoints = (num, section) => {
  for (let i = 0; i < num; i++) {
    let dataTest = makeRandomDataPoint();
    let point = new Point(dataTest);
    let trip = new Trip(dataTest);

    point.onClick = () => {
      trip.render();
      section.replaceChild(trip.element, point.element);
      point.destroy();
    };

    trip.onSubmit = () => {
      point.render();
      section.replaceChild(point.element, trip.element);
      trip.destroy();
    };

    trip.onDelete = () => {
      point.render();
      section.replaceChild(point.element, trip.element);
      trip.destroy();
    };

    point.render();
    section.appendChild(point.element);
  }
};

clearSection(FILTERS_SECTION);
clearSection(POINT_SECTION);
renderFilters(DATA_FILTERS, FILTERS_SECTION);
renderNumPoints(STATE.startNumberPoints, POINT_SECTION);

FILTERS_SECTION.addEventListener(`change`, (e) => {
  e.preventDefault();
  if (e.target.tagName.toLowerCase() === `input`) {
    clearSection(POINT_SECTION);
    renderNumPoints(getRandomNumber(STATE.minNumberPoints, STATE.startNumberPoints), POINT_SECTION);
  }
});

