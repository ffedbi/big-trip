import ModelPoint from "./model-point";
import ModelOffers from "./model-offers";
import ModelDestinations from "./model-destinations";

const AUTHORIZATION = `Basic eo0w590ik29889a=${Math.random()}`;
const END_POINT = ` https://es8-demo-srv.appspot.com/big-trip/`;
const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`,
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

const toJSON = (response) => {
  return response.json();
};

export default class API {
  constructor() {
    this._endPoint = END_POINT;
    this._authorization = AUTHORIZATION;
  }

  getPoints() {
    return this._load({url: `points`})
      .then(toJSON)
      .then(ModelPoint.parseItems);
  }

  getDestinations() {
    return this._load({url: `destinations`})
      .then(toJSON)
      .then(ModelDestinations.parseItems);
  }

  getOffers() {
    return this._load({url: `offers`})
      .then(toJSON)
      .then(ModelOffers.parseItems);
  }

  createPoint({point}) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(point),
      headers: new Headers({'Content-Type': `application/json`}),
    })
      .then(toJSON)
      .then(ModelPoint.parseItem);
  }

  updatePoint({id, data}) {
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`}),
    })
      .then(toJSON)
      .then(ModelPoint.parseItem);
  }

  deletePoint({id}) {
    return this._load({url: `points/${id}`, method: Method.DELETE});
  }

  syncPoints({points}) {
    return this._load({
      url: `points/sync`,
      method: Method.POST,
      body: JSON.stringify(points),
      headers: new Headers({'Content-Type': `application/json`}),
    })
      .then(toJSON);
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        window.console.error(`fetch error: ${err}`);
        throw err;
      });
  }
}
