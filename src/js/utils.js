export const clearSection = (section) => {
  section.innerHTML = ``;
};
export const createDOMElementFromHtml = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;
  return newElement.firstChild;
};

export const converNewPointData = (data) => {
  return {
    'type': data.type.typeName,
    'base_price': data.price,
    'destination': {
      'name': data.city,
      'description': data.description,
      'pictures': data.pictures,
    },
    'date_from': data.timeline[0],
    'date_to': data.timeline[1],
    'offers': data.offers,
    'is_favorite': data.favorite,
  };
};

export const deleteArrayElement = (array, id) => {
  array.splice(id, 1);
  return array;
};

export const getId = () => Date.now() + Math.random();
