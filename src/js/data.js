export const DATA_POINTS = [
  {
    icon: `🚕`,
    title: `Taxi to Airport`,
    timeline: [`10:00`, `11:00`],
    duration: `1h 30m`,
    price: `&euro;&nbsp;20`,
    offers: [`Order UBER +&euro;&nbsp;20`, `Upgrade to business +&euro;&nbsp;20`],
  },
  {
    icon: `✈️`,
    title: `Flight to Geneva`,
    timeline: [`10:00`, `11:00`],
    duration: `1h 30m`,
    price: `&euro;&nbsp;20`,
    offers: [`Upgrade to business +&euro;&nbsp;20`, `Select meal +&euro;&nbsp;20`],
  },
  {
    icon: `🚕`,
    title: `Drive to Chamonix`,
    timeline: [`10:00`, `11:00`],
    duration: `1h 30m`,
    price: `&euro;&nbsp;20`,
    offers: [`Rent a car +&euro;&nbsp;200`, ``],
  },
  {
    icon: `🏨`,
    title: `Check into a hotel`,
    timeline: [`10:00`, `11:00`],
    duration: `1h 30m`,
    price: `&euro;&nbsp;20`,
    offers: [`Add breakfast +&euro;&nbsp;20`, ``],
  },
];

export const DATA_FILTERS = [
  {
    name: `Everything`,
    isChecked: true,
  },
  {
    name: `Future`,
  },
  {
    name: `Past`,
  },
];

const DATA_NEW_POINTS = {
  POINTS_TYPE: {
    'Taxi': `🚕`,
    'Bus': `🚌`,
    'Train': `🚂`,
    'Ship': `🛳️`,
    'Transport': `🚊`,
    'Drive': `🚗`,
    'Flight': `✈️`,
    'Check-in': `🏨`,
    'Sightseeing': `🏛️`,
    'Restaurant': `🍴`,
  },
  CITIES: [`Amsterdam`, `Geneva`, `Chamonix`, `Geneva`, `Amsterdam`],
  PICTURE_URL: `http://picsum.photos/300/150?r=${Math.random()}`,
  OFFERS: [`Add luggage`, `Switch to comfort class`, `Add meal`, `Choose seats`],
  DESCRIPTION_TEXT: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`

};

import {getRandomArrayItem, getRandomNumber} from './utils';

const getRandomNumberOffers = (offers) => {
  const arreyOffers = new Set();
  for (let item = 0; item < getRandomNumber(0, 2); item++) {
    arreyOffers.add(getRandomArrayItem(offers));
  }

  return arreyOffers;
};

export const makeRandomPoint = () => ({
  icon: getRandomArrayItem(Object.entries(DATA_NEW_POINTS.POINTS_TYPE))[1],
  city: getRandomArrayItem(DATA_NEW_POINTS.CITIES),
  PICTURE_URL: `http://picsum.photos/300/150?r=${Math.random()}`,
  offers: [...getRandomNumberOffers(DATA_NEW_POINTS.OFFERS)],
  timeline: [`10:10`, `20:20`]
});

