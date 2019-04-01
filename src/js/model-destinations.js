export default class ModelDestinations {
  constructor(data) {
    this.name = data[`name`] || ``;
    this.description = data[`offers`] || ``;
    this.pictures = data[`pictures`] || [];
  }

  static parseOffer(data) {
    return new ModelDestinations(data);
  }

  static parseOffers(data) {
    return data.map(ModelDestinations.parsePoint);
  }
}
