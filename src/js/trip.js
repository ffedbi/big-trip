import Component from "./component";
import flatpickr from "flatpickr";
import {POINTS_TYPE} from "./data";
import moment from "moment";

export default class Trip extends Component {
  constructor(data, offersList, destinations) {
    super();

    this._id = data.id;
    this._type = data.type;
    this._city = data.city;
    this._timeline = data.timeline;
    this._offers = data.offers;
    this._price = data.price;
    this._description = data.description;
    this._pictures = data.pictures;
    this._favorite = data.favorite;

    this._offersList = offersList;
    this._destinations = destinations || ``;

    this._onSubmit = null;
    this._onDelete = null;
    this._onEsc = null;
    this._animationTimeoutId = null;

    this._onSubmitBtnClick = this._onSubmitBtnClick.bind(this);
    this._onDeleteBtnClick = this._onDeleteBtnClick.bind(this);
    this._onKeydownEsc = this._onKeydownEsc.bind(this);
    this._onChangeType = this._onChangeType.bind(this);
    this._onChangeTimeStart = this._onChangeTimeStart.bind(this);
    this._onChangeTimeEnd = this._onChangeTimeEnd.bind(this);
    this._onChangePrice = this._onChangePrice.bind(this);
    this._onChangePointDestination = this._onChangePointDestination.bind(this);
  }

  _onChangePointDestination(e) {
    const value = e.target.value;

    for (let item of this._destinations) {
      if (item.name === value) {
        this._city = item.name;
        this._description = item.description;
        this._pictures = item.pictures;
      }
    }

    this._partialUpdate();
  }

  set onDelete(fn) {
    this._onDelete = fn;
  }

  set onKeydownEsc(fn) {
    this._onEsc = fn;
  }

  _onKeydownEsc(e) {
    if (typeof this._onEsc === `function` && e.keyCode === 27) {
      this._onEsc();
    }
  }

  _onChangePrice(e) {
    this._price = e.target.value;
  }

  _onChangeTimeStart() {
    const valueInput = this._element.querySelector(`input[name="date-start"]`).value;
    this._timeline[0] = new Date(moment(valueInput, `h:mm`)).getTime();
  }

  _onChangeTimeEnd() {
    const valueInput = this._element.querySelector(`input[name="date-end"]`).value;
    this._timeline[1] = new Date(moment(valueInput, `h:mm`)).getTime();
  }

  _makeHtmlButtonOffers() {
    let str = ``;
    for (let item of this._offers) {
      str += `<input class="point__offers-input visually-hidden" type="checkbox" id="${item.title}-${this._id}" name="offer" value="${item.title}-${item.price}" ${item.accepted ? `checked` : ``}>
            <label for="${item.title}-${this._id}" class="point__offers-label">
              <span class="point__offer-service">${item.title}</span> + €<span class="point__offer-price">${item.price}</span>
            </label>`.trim();
    }

    return str;
  }

  _makeHtmlDestinations() {
    let str = ``;
    for (let item of this._destinations) {
      str += `<option value="${item.name}"></option>`;
    }

    return `<datalist id="destination-select">${str}</datalist>`;
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
        target.offers.push({
          title: result[0],
          price: result[1],
          accepted: true,
        });
      },
      destination(value) {
        target.city = value;
      },
      price(value) {
        target.price = value;
      },
      [`travel-way`](value) {
        target.type = {
          icon: POINTS_TYPE[value],
          typeName: value,
        };
      },
      [`date-start`](value) {
        target.timeline[0] = new Date(moment(value, `h:mm`)).getTime();
      },
      [`date-end`](value) {
        target.timeline[1] = new Date(moment(value, `h:mm`)).getTime();
      },
      favorite(value) {
        if (value === `on`) {
          target.favorite = true;
        }
      },
      /* [`total-price`](value) {
      } */
    };
  }

  _processForm(formData) {
    const entry = {
      type: this._type,
      offers: [],
      timeline: [],
      price: null,
      duration: new Date(),
      city: ``,
      totalPrice: 0,
      favorite: false,
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
      this._onDelete({id: this._id});
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
      this._element.querySelector(`.point__destination-input`).addEventListener(`change`, this._onChangePointDestination);
      document.addEventListener(`keydown`, this._onKeydownEsc);

      flatpickr(this._element.querySelector(`.point__time input[name="date-start"]`), {
        enableTime: true,
        altInput: true,
        noCalendar: true,
        defaultDate: [this._timeline[0]],
        maxDate: this._timeline[1],
        altFormat: `h:i K`,
        dateFormat: `h:i K`,
        onClose: this._onChangeTimeStart,
      });

      flatpickr(this._element.querySelector(`.point__time input[name="date-end"]`), {
        enableTime: true,
        altInput: true,
        noCalendar: true,
        defaultDate: [this._timeline[1]],
        minDate: this._timeline[0],
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
      this._element.querySelector(`.point__destination-input`).removeEventListener(`change`, this._onChangePointDestination);
      document.removeEventListener(`keydown`, this._onKeydownEsc);
      flatpickr(this._element.querySelector(`.point__time input[name="date-start"]`)).destroy();
      flatpickr(this._element.querySelector(`.point__time input[name="date-end"]`)).destroy();
      clearTimeout(this._animationTimeoutId);
    }
  }

  _onChangeType(e) {
    if (e.target.tagName.toLowerCase() === `input`) {
      let value = e.target.value;
      this._type = {typeName: value, icon: POINTS_TYPE[value]};
      for (let item of this._offersList) {
        if (item.type === value) {
          this._offers = item.offers.map((offer) => {
            return {
              title: offer.name,
              price: offer.price,
            };
          });
        }
      }
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

  lockToSaving() {
    this._element.querySelector(`button[type="reset"]`).disabled = true;
    this._element.querySelector(`.point__button--save`).disabled = true;
    this._element.querySelector(`.point__button--save`).textContent = `Saving...`;
  }

  unlockToSave() {
    this._element.querySelector(`button[type="reset"]`).disabled = false;
    this._element.querySelector(`.point__button--save`).disabled = false;
    this._element.querySelector(`.point__button--save`).textContent = `Save`;
  }

  lockToDeleting() {
    this._element.querySelector(`button[type="reset"]`).disabled = true;
    this._element.querySelector(`button[type="reset"]`).textContent = `Deleting...`;
  }

  unlockToDelete() {
    this._element.querySelector(`button[type="reset"]`).disabled = false;
    this._element.querySelector(`button[type="reset"]`).textContent = `Delete`;
  }

  shake() {
    if (this._element) {
      const ANIMATION_TIMEOUT = 600;
      this._element.style.animation = `shake ${ANIMATION_TIMEOUT / 1000}s`;

      this._animationTimeoutId = setTimeout(() => {
        this._element.style.animation = ``;
      }, ANIMATION_TIMEOUT);
    }
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
              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-taxi-${this._id}" name="travel-way" value="taxi" ${this._type.typeName === `taxi` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-taxi-${this._id}">🚕 taxi</label>

              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-bus-${this._id}" name="travel-way" value="bus" ${this._type.typeName === `bus` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-bus-${this._id}">🚌 bus</label>

              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-train-${this._id}" name="travel-way" value="train" ${this._type.typeName === `train` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-train-${this._id}">🚂 train</label>

              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-flight-${this._id}" name="travel-way" value="flight" ${this._type.typeName === `flight` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-flight-${this._id}">✈️ flight</label>
            </div>

            <div class="travel-way__select-group">
              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-check-in-${this._id}" name="travel-way" value="check-in" ${this._type.typeName === `check-in` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-check-in-${this._id}">🏨 check-in</label>

              <input class="travel-way__select-input visually-hidden" type="radio" id="travel-way-sightseeing-${this._id}" name="travel-way" value="sightseeing" ${this._type.typeName === `sight-seeing` ? `checked` : ``}>
              <label class="travel-way__select-label" for="travel-way-sightseeing-${this._id}">🏛 sightseeing</label>
            </div>
          </div>
        </div>

        <div class="point__destination-wrap">
          <label class="point__destination-label" for="destination">${this._type.typeName} to</label>
          <input class="point__destination-input" list="destination-select" id="destination" placeholder="${this._city}" name="destination">
          ${this._makeHtmlDestinations()}
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
          <input type="checkbox" class="point__favorite-input visually-hidden" id="favorite-${this._id}" name="favorite" ${this._favorite ? `checked` : ``}>
          <label class="point__favorite" for="favorite-${this._id}">favorite</label>
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
            ${this._pictures.map((item) => `<img src="${item.src}" alt="${item.description}" class="point__destination-image">`).join(``).trim()}
          </div>
        </section>
        <input type="hidden" class="point__total-price" name="total-price" value="">
      </section>
    </form>
  </article>`.trim();
  }
}

