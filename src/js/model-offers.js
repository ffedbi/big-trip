export default class ModelOffers {
  constructor(data) {
    this.name = data[`name`] || ``;
    this.price = data[`price`] || ``;
  }

  static parsePoint(data) {
    return new ModelOffers(data);
  }

  static parsePoints(data) {
    return data.map(ModelOffers.parsePoint());
  }
}
