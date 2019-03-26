import {getRandomArrayItem, getRandomNumber} from './utils';
import {DATA_POINTS} from './data';
const TIME_SHIFT = 2 * 60 * 60 * 1000;

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
    icon: resArr[1],
  };
};

const getTimePoints = () => {
  const timeStart = Date.now();
  const timeEnd = timeStart + TIME_SHIFT;
  return [timeStart, timeEnd];
};

const getArrRandomPhoto = () => {
  let result = [];
  for (let i = 0; i < getRandomNumber(3, 5); i++) {
    result[i] = `http://picsum.photos/100/100?r=${Math.random()}`;
  }

  return result;
};

const makeRandomPointData = (idPoint) => ({
  id: idPoint,
  type: getRandomTypePoint(),
  city: getRandomArrayItem(DATA_POINTS.CITIES),
  description: getRandomDescription(DATA_POINTS.DESCRIPTION_TEXT),
  picture: getArrRandomPhoto(),
  offers: new Set([...getRandomNumberOffers(DATA_POINTS.OFFERS)]),
  timeline: getTimePoints(),
  price: getRandomNumber(10, 45),
});

export const makeRandomPointDataArray = (num) => {
  let result = [];
  for (let i = 0; i < num; i++) {
    result.push(makeRandomPointData(i));
  }

  return result;
};

