(function (window) {
  "use strict";

  // Crée un modèle pour gérer les données
  function Model(storage) {
    this.storage = storage;
  }

  // Récupère les données de la mémoire
  Model.prototype.read = function (query, callback) {
    const data = this.storage.findAll(query); // Récupère les données de la mémoire

    // Exécute le callback avec les données
    if (typeof callback === "function") {
      callback(data);
    }

    return data;
  };

  window.app = window.app || {};
  window.app.Model = Model;
})(window);
