export default class ModelDestinations {
  constructor(data) {
    this.name = data[`name`] || ``;
    this.description = data[`offers`] || ``;
    this.pictures = data[`pictures`] || [];
  }

  static parseItem(data) {
    return new ModelDestinations(data);
  }

  static parseItems(data) {
    return data.map(ModelDestinations.parseItem);
  }
}
