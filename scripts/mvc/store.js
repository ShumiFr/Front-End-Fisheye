(function (window) {
  "use strict";

  let Memory = {};
  let ID = 1;

  function Store(name) {
    this._dbName = name;

    if (!Memory[name]) {
      this._dataPromise = fetch("../../data/photographers.json")
        .then((response) => response.json())
        .then((data) => {
          Memory[name] = {
            photographers: data.photographers,
            media: data.media,
          };
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      this._dataPromise = Promise.resolve(Memory[name]);
    }
  }

  Store.prototype.count = function (callback) {
    const photographeCount = Object.keys(Memory[this._dbName].photographers).length;
    callback.call(photographeCount);
  };

  Store.prototype.findAll = function (callback) {
    callback = callback || function () {};

    this._dataPromise.then(() => {
      const entities = Memory[this._dbName].photographers;
      callback.call(
        this,
        Object.keys(entities).map((key) => entities[key])
      );
    });
  };

  Store.prototype.findById = function (id, callback) {
    callback = callback || function () {};
    callback.call(this, Memory[this._dbName].photographers[id]);
  };

  Store.prototype.save = function (id, params, callback) {
    if (id) {
      const item = { ...Memory[this._dbName][id], ...params };
      Memory[this._dbName].photographers[item.id] = item;
      callback(item);
      return;
    }

    Memory[this._dbName].photographers[ID++] = params;
    callback(params);
  };

  window.app = window.app || {};
  window.app.Store = Store;
})(window);
