import Component from "./component";
import {createDOMElementFromHtml} from "./utils";

export default class Filter extends Component {
  constructor(data, type) {
    super();
    this._description = data.description;
    this._isChecked = data.isChecked;
    this._type = type;

    this._onFilter = null;
    this._onClickFilter = this._onClickFilter.bind(this);
  }

  get name() {
    return this._description.toLowerCase();
  }

  set onFilter(fn) {
    this._onFilter = fn;
  }

  _onClickFilter() {
    if (typeof this._onFilter === `function`) {
      this._onFilter();
    }
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

  render() {
    this.destroy();
    this._element = createDOMElementFromHtml(this.template);
    this._bind();
    return this._element;
  }

  get template() {
    const descriptionLowered = this._description.toLowerCase();
    let result;
    if (this._type !== undefined) {
      result = `<span>
                  <input type="radio" name="trip-sorting" id="sorting-${descriptionLowered}" value="${descriptionLowered}" ${this._isChecked ? `checked` : ``}>
                  <label class="trip-sorting__item trip-sorting__item--${descriptionLowered}" for="sorting-${descriptionLowered}">${this._description}</label>
                </span>`.trim();
      return result;
    }
    result = `<span>
                 <input type="radio" id="filter-${descriptionLowered}" name="filter" value="${descriptionLowered}" ${this._isChecked ? ` checked` : ``}>
                 <label class="trip-filter__item" for="filter-${descriptionLowered}">${this._description}</label>
              </span>`.trim();

    return result;
  }
}
