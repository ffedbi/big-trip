import Component from "./component";
import flatpickr from "flatpickr";
import {POINTS_TYPE} from "./data";
import moment from "moment";

const ANIMATION_TIMEOUT = 600;
const MILLISECONDS_PER_SECOND = 1000;
const MIN_PRICE = 0;
const KEY_CODE_ESC = 27;

export default class Trip extends Component {
  constructor(data, allPossibleOffers, destinations) {
    super();

    this._id = data.id;
    this._type = data.type;
    this._city = data.city;
    this._timeline = data.timeline;
    this._offers = data.offers;
    this._price = +data.price;
    this._description = data.description;
    this._pictures = data.pictures;
    this._favorite = data.favorite;

    this._allPossibleOffers = allPossibleOffers;
    this._destinations = destinations || [];

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
    this._onChangeFavoriteState = this._onChangeFavoriteState.bind(this);
    this._onChangeOffers = this._onChangeOffers.bind(this);
  }

  get template() {
    return `<article class="point">
    <form action="" method="get">
      <header class="point__header">
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
          <input class="point__destination-input" list="destination-select" id="destination" value="${this._city}" name="destination">
          ${this._makeHtmlDestinations()}
        </div>

        <label class="point__time">
          choose time
          <input class="point__input" type="text" value="" name="date-start" placeholder="">
          <input class="point__input" type="text" value="" name="date-end" placeholder="">
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
            ${this._makeHtmlPictures()}
          </div>
        </section>
        <input type="hidden" class="point__total-price" name="total-price" value="">
      </section>
    </form>
  </article>`.trim();
  }

  set onKeydownEsc(fn) {
    this._onEsc = fn;
  }

  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  set onDelete(fn) {
    this._onDelete = fn;
  }

  update(data) {
    this._type = data.type;
    this._city = data.city;
    this._timeline = data.timeline;
    this._price = data.price;
    this._offers = data.offers;
    this._favorite = data.favorite;
  }

  lockToSaving() {
    this._ui.btnReset.lock = true;
    this._ui.btnSave.lock = true;
    this._ui.btnSave.textContent = `Saving...`;
  }

  unlockToSave() {
    this._ui.btnReset.lock = false;
    this._ui.btnSave.lock = false;
    this._ui.btnSave.textContent = `Save`;
  }

  lockToDeleting() {
    this._ui.btnReset.lock = true;
    this._ui.btnReset.textContent = `Deleting...`;
  }

  unlockToDelete() {
    this._ui.btnReset.lock = false;
    this._ui.btnReset.textContent = `Delete`;
  }

  shake() {
    if (this._element) {
      this._element.style.animation = `shake ${ANIMATION_TIMEOUT / MILLISECONDS_PER_SECOND}s`;

      this._animationTimeoutId = setTimeout(() => {
        this._element.style.animation = ``;
      }, ANIMATION_TIMEOUT);
    }
  }

  _makeHtmlButtonOffers() {
    return this._offers.map((offer) => `
    <input class="point__offers-input visually-hidden" type="checkbox" id="${offer.title}--${this._id}" name="offer" value="${offer.title}--${offer.price}" ${offer.accepted ? `checked` : ``}>
    <label for="${offer.title}--${this._id}" class="point__offers-label">
              <span class="point__offer-service">${offer.title}</span> + €<span class="point__offer-price">${offer.price}</span>
    </label>`.trim()).join(``);
  }

  _makeHtmlDestinations() {
    const options = this._destinations.map((destinations) => `<option value="${destinations.name}"></option>`).join(``);
    return `<datalist id="destination-select">${options}</datalist>`;
  }

  _makeHtmlPictures() {
    return this._pictures.map((picture) =>
      `<img src="${picture.src}" alt="picture from place" class="point__destination-image">`).join(``);
  }

  _processForm(formData) {
    const entry = {
      type: this._type,
      offers: this._offers,
      timeline: this._timeline,
      price: null,
      city: ``,
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

  _getUiElements() {
    this._ui.form = this._element.querySelector(`form`);
    this._ui.btnSave = this._element.querySelector(`.point__button--save`);
    this._ui.btnReset = this._element.querySelector(`button[type="reset"]`);
    this._ui.travelWaySelect = this._element.querySelector(`.travel-way__select`);
    this._ui.inputPrice = this._element.querySelector(`input[name="price"]`);
    this._ui.inputDestinations = this._element.querySelector(`.point__destination-input`);
    this._ui.inputTimeStart = this._element.querySelector(`.point__time input[name="date-start"]`);
    this._ui.inputTimeEnd = this._element.querySelector(`.point__time input[name="date-end"]`);
    this._ui.offersBlock = this._element.querySelector(`.point__offers-wrap`);
    this._ui.pointFavorite = this._element.querySelector(`.point__favorite`);
  }

  _bind() {
    if (this._element) {
      this._getUiElements();
      this._ui.btnSave.addEventListener(`click`, this._onSubmitBtnClick);
      this._ui.btnReset.addEventListener(`click`, this._onDeleteBtnClick);
      this._ui.travelWaySelect.addEventListener(`change`, this._onChangeType);
      this._ui.inputPrice.addEventListener(`change`, this._onChangePrice);
      this._ui.inputDestinations.addEventListener(`change`, this._onChangePointDestination);
      this._ui.offersBlock.addEventListener(`click`, this._onChangeOffers);
      this._ui.pointFavorite.addEventListener(`click`, this._onChangeFavoriteState);
      document.addEventListener(`keydown`, this._onKeydownEsc);

      flatpickr(this._ui.inputTimeStart, {
        enableTime: true,
        altInput: true,
        altFormat: `H:i`,
        dateFormat: `Z`,
        minuteIncrement: 1,
        defaultDate: moment(this._timeline[0]).format(),
        maxDate: this._timeline[1],
        onChange: this._onChangeTimeStart,
      });
      flatpickr(this._ui.inputTimeEnd, {
        enableTime: true,
        altInput: true,
        altFormat: `H:i`,
        dateFormat: `Z`,
        minuteIncrement: 1,
        defaultDate: moment(this._timeline[1]).format(),
        minDate: this._timeline[0],
        onChange: this._onChangeTimeEnd,
      });
    }
  }

  _unbind() {
    if (this._element) {
      this._ui.btnSave.removeEventListener(`click`, this._onSubmitBtnClick);
      this._ui.btnReset.removeEventListener(`click`, this._onDeleteBtnClick);
      this._ui.travelWaySelect.removeEventListener(`change`, this._onChangeType);
      this._ui.inputPrice.removeEventListener(`change`, this._onChangePrice);
      this._ui.inputDestinations.removeEventListener(`change`, this._onChangePointDestination);
      this._ui.offersBlock.removeEventListener(`click`, this._onChangeOffers);
      this._ui.pointFavorite.removeEventListener(`click`, this._onChangeFavoriteState);
      document.removeEventListener(`keydown`, this._onKeydownEsc);

      flatpickr(this._ui.inputTimeStart).destroy();
      flatpickr(this._ui.inputTimeEnd).destroy();
      clearTimeout(this._animationTimeoutId);
    }
  }

  _partialUpdate() {
    this._unbind();
    const oldElement = this._element;
    this._element.parentNode.replaceChild(this.render(), oldElement);
    oldElement.remove();
    this._bind();
  }

  _onChangeType(e) {
    if (e.target.tagName.toLowerCase() === `input`) {
      let value = e.target.value;
      this._price = MIN_PRICE;
      this._type = {typeName: value, icon: POINTS_TYPE[value]};
      for (let item of this._allPossibleOffers) {
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

  _onKeydownEsc(e) {
    if (typeof this._onEsc === `function` && e.keyCode === KEY_CODE_ESC) {
      this._onEsc();
    }
  }

  _onChangePrice(e) {
    const value = +e.target.value;

    if (value < MIN_PRICE || !Number.isInteger(value)) {
      this._ui.btnSave.lock = true;
      this.shake();
      return;
    }
    this._price = value;
    this._partialUpdate();
  }

  _onChangeTimeStart() {
    const inputValue = this._ui.inputTimeStart.value;
    this._timeline[0] = new Date(moment(inputValue)).getTime();
    this._partialUpdate();
  }

  _onChangeTimeEnd() {
    const inputValue = this._ui.inputTimeEnd.value;
    this._timeline[1] = new Date(moment(inputValue)).getTime();
    this._partialUpdate();
  }

  _onSubmitBtnClick(e) {
    e.preventDefault();
    const formData = new FormData(this._ui.form);
    const newData = this._processForm(formData);
    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }

    this.update(newData);
  }

  _onDeleteBtnClick() {
    if (typeof this._onDelete === `function`) {
      this._onDelete({id: this._id});
    }
  }

  _onChangeFavoriteState() {
    this._favorite = !this._favorite;
  }

  _onChangeOffers(e) {
    if (e.target.tagName.toLowerCase() === `input`) {
      const offerTitle = e.target.value.split(`--`)[0];
      const offerPrice = +e.target.value.split(`--`)[1];

      if (e.target.checked) {
        for (let offer of this._offers) {
          if (offerPrice === offer.price && offerTitle === offer.title) {
            offer.accepted = true;
            break;
          }
        }
        this._partialUpdate();
      } else {
        for (let offer of this._offers) {
          if (offerPrice === offer.price && offerTitle === offer.title) {
            offer.accepted = false;
            break;
          }
        }
        this._partialUpdate();
      }
    }
  }

  static createMapper(target) {
    return {
      destination(value) {
        target.city = value;
      },
      price(value) {
        target.price = +value;
      },
      [`travel-way`](value) {
        target.type = {
          icon: POINTS_TYPE[value],
          typeName: value,
        };
      },
    };
  }
}
