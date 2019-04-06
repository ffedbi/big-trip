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

export const getId = () => Date.now() + Math.random();
