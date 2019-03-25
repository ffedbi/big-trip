import {getRandomNumber, clearSection} from './utils';
import {makeHtmlFilter} from './make-html-filter';
import {makeRandomPointData} from "./make-random-point-data";
import {DATA_FILTERS} from './data';
import Point from "./point";
import Trip from "./trip";

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
    let data = makeRandomPointData(i);
    let point = new Point(data);
    let trip = new Trip(data);

    point.onClick = () => {
      trip.render();
      section.replaceChild(trip.element, point.element);
      point.destroy();
    };

    trip.onSubmit = (newData) => {
      data.type = newData.type;
      data.city = newData.city;
      data.offers = newData.offers;
      data.price = newData.price;
      data.timeline = newData.timeline;

      point.update(data);
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

