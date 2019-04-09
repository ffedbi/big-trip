import ModelPoint from "./model-point";

const objectToArray = (object) => {
  return Object.keys(object).map((id) => object[id]);
};

export default class Provider {
  constructor({api, store, generateId}) {
    this._api = api;
    this._store = store;
    this._generateId = generateId;
    this._needSync = false;
  }

  getPoints() {
    if (Provider._isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          points.map((item) => this._store.setItem({key: item.id, item: item.toRAW()}));
          return points;
        });
    } else {
      const RAW_POINTS_MAP = this._store.getAll();
      const RAW_POINTS = objectToArray(RAW_POINTS_MAP);
      const POINTS = ModelPoint.parseItems(RAW_POINTS);
      return Promise.resolve(POINTS);
    }
  }

  getDestinations() {
    return this._api.getDestinations()
      .then((destinations) => destinations);
  }

  getOffers() {
    return this._api.getOffers()
      .then((offers) => offers);
  }

  createPoint({point}) {
    if (Provider._isOnline()) {
      return this._api.createPoint({point})
        .then(() => {
          this._store.setItem({key: point.id, item: point.toRAW()});
          return point;
        });
    } else {
      point.id = this._generateId();
      this._needSync = true;
      this._store.setItem({key: point.id, item: point});
      return Promise.resolve(ModelPoint.parseItem(point));
    }
  }

  updatePoint({id, data}) {
    if (Provider._isOnline()) {
      return this._api.updatePoint({id, data})
        .then((point) => {
          this._store.setItem({key: point.id, item: point.toRAW()});
          return point;
        });
    } else {
      const POINT = data;
      this._needSync = true;
      this._store.setItem({key: POINT.id, item: POINT});
      return Promise.resolve(ModelPoint.parseItem(POINT));
    }
  }

  deletePoint({id}) {
    if (Provider._isOnline()) {
      return this._api.deletePoint({id})
        .then(() => {
          this._store.removeItem({key: id});
        });
    } else {
      this._needSync = true;
      this._store.removeItem({key: id});
      return Promise.resolve(true);
    }
  }

  syncPoints() {
    return this._api.syncPoints({
      points: objectToArray(this._store.getAll()),
    });
  }

  static _isOnline() {
    return window.navigator.onLine;
  }
}
