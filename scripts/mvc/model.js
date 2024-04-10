(function (window) {
  "use strict";

  // Définition du constructeur du modèle
  function Model(storage) {
    this.storage = storage; // Stockage des données
  }

  // Méthode pour lire les données du modèle
  Model.prototype.read = function (query) {
    return this.storage.findAll(query); // Récupération de toutes les données
  };

  // Définition de l'objet global "app" s'il n'existe pas déjà
  window.app = window.app || {};

  // Assignation du constructeur du modèle à l'objet global "app"
  window.app.Model = Model;
})(window);
