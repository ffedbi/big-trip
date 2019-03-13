export const clearSection = (section) => {
  section.innerHTML = ``;
};

export const getRandomNumber = (min, max) => Math.floor(Math.random() * (max + 1 - min) + min);

export const getRandomArrayItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

export const createDOMElementFromHtml = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};
