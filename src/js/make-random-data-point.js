import {getRandomArrayItem, getRandomNumber} from "./utils";
import {DATA_POINTS} from "./data";
const TIME_SHIFT = 2 * 60 * 60 * 1000;
const TIME_OPTIONS = {hour: `numeric`, minute: `numeric`, hour12: false};

const getRandomNumberOffers = (offers) => {
  const arrayOffers = [];
  for (let item = 0; item < getRandomNumber(0, 2); item++) {
    arrayOffers.push(getRandomArrayItem(offers));
  }
  return arrayOffers;
};

const getRandomDescription = (text) => {
  let arrStr = text.split(`. `);
  let result = new Set();
  let size = getRandomNumber(0, 3);
  for (let item = 0; item <= size; item++) {
    result.add(getRandomArrayItem(arrStr));
  }
  return [...result].join(` `);
};

const getRandomTypePoint = () => {
  let resArr = getRandomArrayItem(Object.entries(DATA_POINTS.POINTS_TYPE));
  return {
    typeName: resArr[0],
    icon: resArr[1]
  };
};

const convertTime = (time, options, locale = `en-US`) => new Date(time).toLocaleString(locale, options);

const getTimePoints = () => {
  const timePoint = Date.now();
  const timeStart = convertTime(timePoint, TIME_OPTIONS);
  const timeEnd = convertTime(timePoint + TIME_SHIFT, TIME_OPTIONS);
  return [timeStart, timeEnd];
};

export const makeRandomDataPoint = () => ({
  type: getRandomTypePoint(),
  city: getRandomArrayItem(DATA_POINTS.CITIES),
  description: getRandomDescription(DATA_POINTS.DESCRIPTION_TEXT),
  picture: `http://picsum.photos/100/100?r=${Math.random()}`,
  offers: new Set([...getRandomNumberOffers(DATA_POINTS.OFFERS)]),
  timeline: getTimePoints(),
  duration: `2h 02m`,
  price: getRandomNumber(10, 45),
});
