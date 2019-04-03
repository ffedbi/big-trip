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
      const rawPointsMap = this._store.getAll();
      const rawPoints = objectToArray(rawPointsMap);
      const points = ModelPoint.parsePoint(rawPoints);
      return Promise.resolve(points);
    }
  }

  getDestinations() {
    return this._api.getDestinations();
  }

  getOffers() {
    return this._api.getOffers();
  }

  createPoint({point}) {
    if (Provider._isOnline()) {
      return this._api.createTask({point})
        .then(() => {
          this._store.setItem({key: point.id, item: point.toRAW()});
          return point;
        });
    } else {
      point.id = this._generateId();
      this._needSync = true;
      this._store.setItem({key: point.id, item: point});
      return Promise.resolve(ModelPoint.parsePoint(point));
    }
  }

  updatePoint({id, data}) {
    if (Provider._isOnline()) {
      return this._api.updateTask({id, data})
        .then((point) => {
          this._store.setItem({key: point.id, item: point.toRAW()});
          return point;
        });
    } else {
      const point = data;
      this._needSync = true;
      this._store.setItem({key: point.id, item: point});
      return Promise.resolve(ModelPoint.parsePoint(point));
    }
  }

  deletePoint({id}) {
    if (Provider._isOnline()) {
      return this._api.deleteTask({id})
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
      tasks: objectToArray(this._store.getAll())
    }).then(() => {
      this._needSync = false;
    });
  }

  static _isOnline() {
    return window.navigator.onLine;
  }
}
