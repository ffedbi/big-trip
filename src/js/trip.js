import Component from "./component";
import flatpickr from "flatpickr";
import {DATA_POINTS} from "./data";
import moment from "moment";

export default class Trip extends Component {
  constructor(data) {
    super();

    this._id = data.id;
    this._type = data.type;
    this._city = data.city;
    this._timeline = data.timeline;
    this._offers = data.offers;
    this._price = data.price;
    this._description = data.description;
    this._picture = data.picture;

    this._onSubmit = null;
    this._onDelete = null;

    this._onSubmitBtnClick = this._onSubmitBtnClick.bind(this);
    this._onDeleteBtnClick = this._onDeleteBtnClick.bind(this);
    this._onChangeType = this._onChangeType.bind(this);
    this._onChangeTimeStart = this._onChangeTimeStart.bind(this);
    this._onChangeTimeEnd = this._onChangeTimeEnd.bind(this);
    this._onChangePrice = this._onChangePrice.bind(this);
  }

  set onDelete(fn) {
    this._onDelete = fn;
  }

  _onChangePrice(e) {
    this._price = e.target.value;
  }

  _onChangeTimeStart() {
    const valueInput = this._element.querySelector(`input[name="data-start"]`).value;
    this._timeline[0] = new Date(moment(valueInput, `h:mm`)).getTime();
  }

  _onChangeTimeEnd() {
    const valueInput = this._element.querySelector(`input[name="data-end"]`).value;
    this._timeline[1] = new Date(moment(valueInput, `h:mm`)).getTime();
  }

  _makeHtmlButtonOffers() {
    let str = ``;
    for (let item of this._offers) {
      str += `<input class="point__offers-input visually-hidden" type="checkbox" id="${item[0]}-${this._id}" name="offer" value="${item[0]}-${item[1]}" checked>
            <label for="${item[0]}-${this._id}" class="point__offers-label">
              <span class="point__offer-service">${item[0]}</span> + €<span class="point__offer-price">${item[1]}</span>
            </label>`.trim();
    }

    return str;
  }

  _onSubmitBtnClick(e) {
    e.preventDefault();
    const formData = new FormData(this._element.querySelector(`form`));
    const newData = this._processForm(formData);
    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }

    this.update(newData);
  }

  static createMapper(target) {
    return {
      offer(value) {
        const result = value.split(`-`);
        target.offers.add([result[0], result[1]]);
      },
      destination(value) {
        target.city = value;
      },
      price(value) {
        target.price = value;
      },
      [`travel-way`](value) {
        target.type = {
          icon: DATA_POINTS.POINTS_TYPE[value],
          typeName: value,
        };
      },
      [`time-start`](value) {
        target.timeline[0] = new Date(moment(value, `h:mm`)).getTime();
      },
      [`time-end`](value) {
        target.timeline[1] = new Date(moment(value, `h:mm`)).getTime();
      },
      /* [`total-price`](value) {
      } */
    };
  }

  _processForm(formData) {
    const entry = {
      type: this._type,
      offers: new Set(),
      timeline: [],
      price: null,
      duration: new Date(),
      city: ``,
      totalPrice: 0,
    };

    const pointMapper = Trip.createMapper(entry);
    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (pointMapper[property]) {
        pointMapper[property](value);
      }
    }
    return entry;
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  _onDeleteBtnClick() {
    if (typeof this._onDelete === `function`) {
      this._onDelete();
    }
  }

  set onDelete(fn) {
    this._onDelete = fn;
  }

  _bind() {
    if (this._element) {
      this._element.querySelector(`.point__button--save`).addEventListener(`click`, this._onSubmitBtnClick);
      this._element.querySelector(`button[type="reset"]`).addEventListener(`click`, this._onDeleteBtnClick);
      this._element.querySelector(`.travel-way__select`).addEventListener(`change`, this._onChangeType);
      this._element.querySelector(`input[name="price"]`).addEventListener(`change`, this._onChangePrice);

      flatpickr(this._element.querySelector(`.point__time input[name="date-start"]`), {
        enableTime: true,
        altInput: true,
        noCalendar: true,
        defaultDate: [this._timeline[0]],
        altFormat: `h:i K`,
        dateFormat: `h:i K`,
        onClose: this._onChangeTimeStart,
      });

      flatpickr(this._element.querySelector(`.point__time input[name="date-end"]`), {
        enableTime: true,
        altInput: true,
        noCalendar: true,
        defaultDate: [this._timeline[1]],
        altFormat: `h:i K`,
        dateFormat: `h:i K`,
        onClose: this._onChangeTimeEnd,
      });
    }
  }

  _unbind() {
    if (this._element) {
      this._element.querySelector(`.point__button--save`).removeEventListener(`click`, this._onSubmitBtnClick);
      this._element.querySelector(`button[type="reset"]`).removeEventListener(`click`, this._onDeleteBtnClick);
      this._element.querySelector(`.travel-way__select`).addEventListener(`change`, this._onChangeType);
      flatpickr(this._element.querySelector(`.point__time input[name="date-start"]`)).destroy();
      flatpickr(this._element.querySelector(`.point__time input[name="date-end"]`)).destroy();
    }
  }

  _onChangeType(e) {
    if (e.target.tagName.toLowerCase() === `input`) {
      let value = e.target.value;
      this._type = {typeName: value, icon: DATA_POINTS.POINTS_TYPE[value]};
      this._partialUpdate();
    }
  }

  _partialUpdate() {
    this._unbind();
    const oldElem = this._element;
    this._element.parentNode.replaceChild(this.render(), oldElem);
    oldElem.remove();
    this._bind();
  }

  update(data) {
    this._type = data.type;
    this._city = data.city;
    this._timeline = data.timeline;
    this._price = data.price;
    this._offers = data.offers;
  }

  get template() {
    return `<article class="point" id="${this._id}">
    <form action="" method="get">
      <header class="point__header">
        <label class="point__date">
          choose day
          <input class="point__input" type="text" placeholder="MAR 18" name="day">
        </label>

        <div class="travel-way">
          <label class="travel-way__label" for="travel-way__toggle-${this._id}">${this._type.icon}</label>
          <input type="checkbox" class="travel-way__toggle visually-hidden" id="travel-way__toggle-${this._id}">
          <div class="travel-way__select">
            <div class="travel-way__select-group">
              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi-${this._id}" name="travel-way" value="Taxi" ${this._type.typeName === `taxi` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-taxi-${this._id}">🚕 taxi</label>

              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus-${this._id}" name="travel-way" value="Bus" ${this._type.typeName === `bus` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-bus-${this._id}">🚌 bus</label>

              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train-${this._id}" name="travel-way" value="Train" ${this._type.typeName === `train` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-train-${this._id}">🚂 train</label>

              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight-${this._id}" name="travel-way" value="Flight" ${this._type.typeName === `flight` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-flight-${this._id}">✈️ flight</label>
            </div>

            <div class="travel-way__select-group">
              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in-${this._id}" name="travel-way" value="Check-in" ${this._type.typeName === `check-in` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-check-in-${this._id}">🏨 check-in</label>

              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-sightseeing-${this._id}" name="travel-way" value="Sight-seeing" ${this._type.typeName === `sight-seeing` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-sightseeing-${this._id}">🏛 sightseeing</label>
            </div>
          </div>
        </div>

        <div class="point__destination-wrap">
          <label class="point__destination-label" for="destination">${this._type.typeName} to</label>
          <input class="point__destination-input" list="destination-select" id="destination" value="${this._city}" name="destination">
          <datalist id="destination-select">
            <option value="airport"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
            <option value="hotel"></option>
          </datalist>
        </div>

        <label class="point__time">
          choose time
          <input class="point__input" type="text" value="${this._timeline[0]}" name="date-start" placeholder="${this._timeline[0]}">
          <input class="point__input" type="text" value="${this._timeline[1]}" name="date-end" placeholder="${this._timeline[1]}">
        </label>

        <label class="point__price">
          write price
          <span class="point__price-currency">€</span>
          <input class="point__input" type="text" value="${this._price}" name="price">
        </label>

        <div class="point__buttons">
          <button class="point__button point__button--save" type="submit">Save</button>
          <button class="point__button" type="reset">Delete</button>
        </div>

        <div class="paint__favorite-wrap">
          <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite" name="favorite">
          <label class="point__favorite" for="favorite">favorite</label>
        </div>
      </header>

      <section class="point__details">
        <section class="point__offers">
          <h3 class="point__details-title">offers</h3>
          <div class="point__offers-wrap">
            ${this._makeHtmlButtonOffers()}
          </div>
        </section>
        <section class="point__destination">
          <h3 class="point__details-title">Destination</h3>
          <p class="point__destination-text">${this._description}</p>
          <div class="point__destination-images">
            ${this._picture.map((item) => `<img src="${item}" alt="picture from place" class="point__destination-image">`).join(``).trim()}
          </div>
        </section>
        <input type="hidden" class="point__total-price" name="total-price" value="">
      </section>
    </form>
  </article>`.trim();
  }
}

