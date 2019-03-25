import Component from "./component";
import {createDOMElementFromHtml} from "./utils";

export default class Filter extends Component {
  constructor(data) {
    super();
    this._description = data.description;
    this._isChecked = data.isChecked;

    this._onFilter = null;
    this._onClickFilter = this._onClickFilter.bind(this);
  }

  get name() {
    return this._description.toUpperCase();
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
      this._element.querySelector(`input`).addEventListener(`click`, this._onClickFilter);
    }
  }

  _unbind() {
    if (this._element) {
      this._element.querySelector(`input`).removeEventListener(`click`, this._onClickFilter);
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
    return `<div><input type="radio" id="filter-${descriptionLowered}" name="filter" value="${descriptionLowered}" ${this._isChecked ? ` checked` : ``}>
      <label class="trip-filter__item" for="filter-${descriptionLowered}">${this._description}</label></div>`;
  }
}
