import Component from "./component";

export default class Filter extends Component {
  constructor(data) {
    super();
    this._description = data.description;
    this._isChecked = data.isChecked;

    this._onFilter = null;
    this._onClickFilter = this._onClickFilter.bind(this);
  }

  get template() {
    const descriptionLowered = this._description.toLowerCase();
    return `<span>
              <input type="radio" id="filter-${descriptionLowered}" name="filter" value="${descriptionLowered}" ${this._isChecked ? ` checked` : ``}>
              <label class="trip-filter__item" for="filter-${descriptionLowered}">${this._description}</label>
            </span>`.trim();
  }

  get name() {
    return this._description.toLowerCase();
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  _bind() {
    if (this._element) {
      this._element.querySelector(`label`).addEventListener(`click`, this._onClickFilter);
    }
  }

  _unbind() {
    if (this._element) {
      this._element.querySelector(`label`).removeEventListener(`click`, this._onClickFilter);
    }
  }

  _onClickFilter() {
    if (typeof this._onFilter === `function`) {
      this._onFilter();
    }
  }
}
