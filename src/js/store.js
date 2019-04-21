export default class Store {
  constructor({key, storage}) {
    this._storage = storage;
    this._storeKey = key;
  }

  setItem({key, item}) {
    const items = this.getAll();
    items[key] = item;

    try {
      return this._storage.setItem(this._storeKey, JSON.stringify(items));
    } catch (e) {
      return false;
    }
  }

  getItem({key}) {
    const items = this.getAll();

    return items[key];
  }

  removeItem({key}) {
    const items = this.getAll();
    delete items[key];

    try {
      return this._storage.setItem(this._storeKey, JSON.stringify(items));
    } catch (e) {
      return false;
    }
  }

  getAll() {
    const emptyItems = {};
    let items;

    try {
      items = this._storage.getItem(this._storeKey);
    } catch (e) {
      return false;
    }

    if (!items) {
      return emptyItems;
    }

    try {
      return JSON.parse(items);
    } catch (e) {
      window.console.log(`Error parse items. Error: ${e}. Items: ${items}`);
      return emptyItems;
    }
  }
}
