import {createDOMElementFromHtml} from "./utils";

export class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate Component, only concrete one.`);
    }

    this._element = null;
  }

  get element() {
    return this._element;
  }

  get template() {
    throw new Error(`You have to define template.`);
  }

  _bind() {}

  _unbind() {}

  render() {
    this.destroy();
    this._element = createDOMElementFromHtml(this.template);
    this._bind();

    return this._element;
  }

  destroy() {
    this._unbind();
    this._element = null;
  }

  update() {}
}
