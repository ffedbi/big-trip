import Component from "./component";
import moment from "moment";

const MAX_NUMBER_OFFERS = 3;

export default class Point extends Component {
  constructor(data) {
    super();
    this._type = data.type;
    this._city = data.city;
    this._timeline = data.timeline;
    this._duration = Point._getDurationEvent(this._timeline);
    this._price = data.price;
    this._offers = data.offers;

    this._onElement = null;
    this._onClickPointElement = this._onClickPointElement.bind(this);
  }

  get template() {
    return `<article class="trip-point">
          <i class="trip-icon">${this._type.icon}</i>
          <h3 class="trip-point__title">${this._type.typeName} to ${this._city}</h3>
          <p class="trip-point__schedule">
            <span class="trip-point__timetable">${moment(this._timeline[0]).format(`h:mm A`)}&nbsp;&mdash; ${moment(this._timeline[1]).format(`h:mm A`)}</span>
            <span class="trip-point__duration">${this._duration}</span>
          </p>
          <p class="trip-point__price">&euro;&nbsp;${this._price}</p>
          <ul class="trip-point__offers">
            ${this._makeHtmlButtonOffer()}
          </ul>
        </article>`.trim();
  }

  set onClick(fn) {
    this._onElement = fn;
  }

  update(data) {
    this._type = data.type;
    this._city = data.city;
    this._timeline = data.timeline;
    this._price = data.price;
    this._offers = data.offers;
    this._duration = Point._getDurationEvent(data.timeline);
  }

  _makeHtmlButtonOffer() {
    return this._offers.filter((offer) => offer.accepted).slice(0, MAX_NUMBER_OFFERS).map((offer) =>
      `<li><button class="trip-point__offer">${offer.title} + &euro;&nbsp;${offer.price}</button></li>`).join(``);
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

  static _getDurationEvent(arr) {
    // const duration = moment.duration(moment(arr[1]).diff(moment(arr[0])));
    // const days = duration.days();
    // return days > 0 ? `${days}D ${duration.hours()}H ${duration.minutes()}M` : `${duration.hours()}H ${duration.minutes()}M`;
    const timeStart = moment(arr[0]);
    const timeEnd = moment(arr[1]);
    const duration = moment(timeEnd.diff(timeStart));
    return `${duration.hour()}H ${duration.minutes()}M`;
  }
}

