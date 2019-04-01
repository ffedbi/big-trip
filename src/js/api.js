import ModelPoint from "./model-point";

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
  constructor({endPoint, authorization}) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({url: `points`})
      .then(toJSON)
      .then(ModelPoint.parsePoints);
  }

  createPoint({task}) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(task),
      headers: new Headers({'Content-Type': `application/json`}),
    })
      .then(toJSON)
      .then(ModelPoint.parsePoint);
  }

  updatePoint({id, data}) {
    window.console.log(data);
    return this._load({
      url: `points/${id}`,
      method: Method.PUT,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': `application/json`}),
    })
      .then(toJSON)
      .then(ModelPoint.parsePoint);
  }

  deleteTask({id}) {
    return this._load({url: `points/${id}`, method: Method.DELETE});
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
