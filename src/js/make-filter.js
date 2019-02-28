export default (description, isChecked = false) => {
  const descriptionLowered = description.toLowerCase();
  return `<input type="radio" id="filter-${descriptionLowered}" name="filter" value="${descriptionLowered}" ${isChecked ? ` checked` : ``}>
          <label class="trip-filter__item" for="filter-${descriptionLowered}">${description}</label>`;
};
