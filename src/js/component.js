import {createDOMElementFromHtml} from "./utils";

export default class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate Component, only concrete one.`);
    }

    this._element = null;
    this._ui = {};
  }

  get element() {
    return this._element;
  }

  get template() {
    throw new Error(`You have to define template.`);
  }

  render() {
    this.destroy();
    this._element = createDOMElementFromHtml(this.template);
    this._bind();

    return this._element;
  }

  destroy() {
    this._unbind();
    this._ui = {};
    this._element = null;
  }

  update() {}

  _bind() {}

  _unbind() {}


}
