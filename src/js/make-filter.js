export const makeFilter = (data) => {
  const descriptionLowered = data.description.toLowerCase();
  return `<input type="radio" id="filter-${descriptionLowered}" name="filter" value="${descriptionLowered}" ${data.isChecked ? ` checked` : ``}>
          <label class="trip-filter__item" for="filter-${descriptionLowered}">${data.description}</label>`;
};
