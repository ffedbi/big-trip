// eslint-disable-next-line no-return-assign
export const clearSection = (section) => section.innerHTML = ``;

export const getRandomNumber = (min, max) => Math.floor(Math.random() * (max + 1 - min) + min);
