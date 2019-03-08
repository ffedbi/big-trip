const makeHtmlButtonOffer = (offers) => {
  let htmlBtnOffer = ``;
  for (let item of offers) {
    htmlBtnOffer += `<li><button class="trip-point__offer">${item[0]} + &euro;&nbsp;${item[1]}</button></li>`;
  }
  return htmlBtnOffer;
};

export const makeHtmlPoint = (point) => {
  return `<article class="trip-point">
          <i class="trip-icon">${point.type.icon}</i>
          <h3 class="trip-point__title">${point.type.typeName} to ${point.city}</h3>
          <p class="trip-point__schedule">
            <span class="trip-point__timetable">${point.timeline[0]}&nbsp;&mdash; ${point.timeline[1]}</span>
            <span class="trip-point__duration">${point.duration}</span>
          </p>
          <p class="trip-point__price">&euro;&nbsp;${point.price}</p>
          <ul class="trip-point__offers">
            ${makeHtmlButtonOffer(point.offers)}
          </ul>
        </article>`;
};
