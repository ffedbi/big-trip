import {POINTS_TYPE} from "./data";

export default class ModelPoint {
  constructor(data) {
    this.id = data[`id`] || ``;
    this.type = {
      typeName: data[`type`] || `taxi`,
      icon: POINTS_TYPE[data[`type`]] || POINTS_TYPE[data[`taxi`]],
    };
    this.price = data[`base_price`];
    this.city = data[`destination`][`name`] || ``;
    this.timeline = [data[`date_from`], data[`date_to`]] || [];
    this.offers = data[`offers`] || [];
    this.description = data[`destination`][`description`] || ``;
    this.pictures = data[`destination`][`pictures`] || [];
    this.favorite = data[`is_favorite`] || false;
  }

  toRAW() {
    return {
      'id': this.id,
      'type': this.type.typeName,
      'base_price': this.price,
      'destination': {
        'name': this.city,
        'description': this.description,
        'pictures': this.pictures,
      },
      'date_from': this.timeline[0],
      'date_to': this.timeline[1],
      'offers': this.offers,
      'is_favorite': this.favorite
    };
  }

  static parsePoint(data) {
    return new ModelPoint(data);
  }

  static parsePoints(data) {
    return data.map(ModelPoint.parsePoint);
  }
}
