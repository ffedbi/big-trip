import moment from 'moment';

export const DATA_FILTERS = [
  {
    description: `Everything`,
    isChecked: true,
  },
  {
    description: `Future`,
  },
  {
    description: `Past`,
  },
];

export const DATA_SORTING_FILTERS = [
  {
    description: `Event`,
    isChecked: true
  },
  {
    description: `Time`
  },
  {
    description: `Price`
  },
  {
    description: `Offers`
  }
];

export const POINTS_TYPE = {
  'taxi': `🚕`,
  'bus': `🚌`,
  'train': `🚂`,
  'ship': `🛳️`,
  'transport': `🚊`,
  'drive': `🚗`,
  'flight': `✈️`,
  'check-in': `🏨`,
  'sightseeing': `🏛️`,
  'restaurant': `🍴`,
};

export const POINT_DEFAULT_DATA = {
  id: null,
  type: {typeName: `taxi`, icon: `🚕`},
  city: ``,
  destination: [],
  price: 0,
  timeline: [moment().valueOf(), moment().valueOf()],
  pictures: [],
  offers: [],
  description: ``,
  isFavorite: false,
};


