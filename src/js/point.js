import {createDOMElementFromHtml} from "./utils";

export class Point {
  constructor(data) {
    this._type = data.type;
    this._city = data.city;
    this._timeline = data.timeline;
    this._duration = data.duration;
    this._price = data.price;
    this._offers = data.offers;

    this._element = null;
    this._onElement = null;
    this._onClickPointElement = this._onClickPointElement.bind(this);
  }

  _makeHtmlButtonOffer() {
    let htmlBtnOffer = ``;
    for (let item of this._offers) {
      htmlBtnOffer += `<li><button class="trip-point__offer">${item[0]} + &euro;&nbsp;${item[1]}</button></li>`;
    }
    return htmlBtnOffer;
  }

  _onClickPointElement(e) {
    e.preventDefault();
    if (typeof this._onClickPointElement === `function`) {
      this._onElement();
    }
  }

  _bind() {
    if (this._element) {
      this._element.addEventListener(`click`, this._onClickPointElement);
    }
  }

  _unbind() {
    if (this._element) {
      this._element.removeEventListener(`click`, this._onClickPointElement);
    }
  }

  get template() {
    return `<article class="trip-point">
          <i class="trip-icon">${this._type.icon}</i>
          <h3 class="trip-point__title">${this._type.typeName} to ${this._city}</h3>
          <p class="trip-point__schedule">
            <span class="trip-point__timetable">${this._timeline[0]}&nbsp;&mdash; ${this._timeline[1]}</span>
            <span class="trip-point__duration">${this._duration}</span>
          </p>
          <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
          <ul class="trip-point__offers">
            ${this._makeHtmlButtonOffer()}
          </ul>
        </article>`.trim();
  }

  get element() {
    return this._element;
  }

  set onClick(fn) {
    this._onElement = fn;
  }

  render() {
    this._element = createDOMElementFromHtml(this.template);
    this._bind();
    return this._element;
  }

  destroy() {
    this._unbind();
    this._element = null;
  }
}

