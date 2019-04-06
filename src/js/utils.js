export const clearSection = (section) => {
  section.innerHTML = ``;
};

export const getRandomNumber = (min, max) => Math.floor(Math.random() * (max + 1 - min) + min);

export const getRandomArrayItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const createDOMElementFromHtml = (template) => {
  const NEW_ELEMENT = document.createElement(`div`);
  NEW_ELEMENT.innerHTML = template;
  return NEW_ELEMENT.firstChild;
};

export const POINT_DEFAULT_DATA = {
  id: null,
  type: {typeName: `taxi`, icon: `🚕`},
  city: ``,
  destination: [],
  price: 0,
  timeline: [new Date(), new Date()],
  pictures: [],
  offers: [],
  description: ``,
  isFavorite: false,
};

export const getId = () => Date.now() + Math.random();
