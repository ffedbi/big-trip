export const clearSection = (section) => {
  section.innerHTML = ``;
};
export const createDOMElementFromHtml = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const getId = () => Date.now() + Math.random();
