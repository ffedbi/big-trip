const createButtonOffer = (arr) => {
  let str = ``;
  for (let item of arr) {
    str += `<li><button class="trip-point__offer">${item}</button></li>`;
  }

  return str;
};

export default (icon, title, timeline, duration, price, offers) => {
  return `<article class="trip-point">
          <i class="trip-icon">${icon}</i>
          <h3 class="trip-point__title">${title}</h3>
          <p class="trip-point__schedule">
            <span class="trip-point__timetable">${timeline[0]}&nbsp;&mdash; ${timeline[1]}</span>
            <span class="trip-point__duration">${duration}</span>
          </p>
          <p class="trip-point__price">${price}</p>
          <ul class="trip-point__offers">
            ${createButtonOffer(offers)}
          </ul>
        </article>`;
};
