export default class ModelOffers {
  constructor(data) {
    this.type = data[`type`] || ``;
    this.offers = data[`offers`] || [];
  }

  static parseItem(data) {
    return new ModelOffers(data);
  }

  static parseItems(data) {
    return data.map(ModelOffers.parseItem);
  }
}
