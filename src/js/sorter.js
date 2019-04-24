import Component from "./component";

export default class Sorter extends Component {
  constructor(data) {
    super();

    this._description = data.description;
    this._isChecked = data.isChecked;
    this._disabled = data.disabled;

    this._onSort = null;
    this._onClickSort = this._onClickSort.bind(this);
  }

  get template() {
    const descriptionLowered = this._description.toLowerCase();
    return `<span>
              <input type="radio" name="trip-sorting" id="sorting-${descriptionLowered}" value="${descriptionLowered}" ${this._isChecked ? `checked` : ``} ${this._checkDisabledSortEl()}>
              <label class="trip-sorting__item trip-sorting__item--${descriptionLowered}" for="sorting-${descriptionLowered}">${this._description}</label>
            </span>`.trim();
  }

  get name() {
    return this._description.toLowerCase();
  }

  set onSort(fn) {
    this._onSort = fn;
  }

  _checkDisabledSortEl() {
    return this._disabled ? `disabled` : ``;
  }

  _bind() {
    if (this._element) {
      this._element.querySelector(`input`).addEventListener(`click`, this._onClickSort);
    }
  }

  _unbind() {
    if (this._element) {
      this._element.querySelector(`input`).removeEventListener(`click`, this._onClickSort);
    }
  }

  _onClickSort() {
    if (typeof this._onSort === `function`) {
      this._onSort();
    }
  }
}
