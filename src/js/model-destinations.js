export default class ModelDestinations {
  constructor(data) {
    this.name = data[`name`] || ``;
    this.description = data[`offers`] || ``;
    this.pictures = data[`pictures`] || [];
  }

  static parseDestination(data) {
    return new ModelDestinations(data);
  }

  static parseDestinations(data) {
    return data.map(ModelDestinations.parseDestination);
  }
}
