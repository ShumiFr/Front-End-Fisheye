(function (window) {
  "use strict";

  // Définition du constructeur du modèle
  function Model(storage) {
    this.storage = storage; // Stockage des données
  }

  // Méthode pour lire les données du modèle
  Model.prototype.findPhotographers = function (query) {
    return this.storage.findPhotographers(query);
  };

  // Dans votre modèle
  Model.prototype.findMedia = function (query) {
    return this.storage.findMedia(query);
  };

  // Définition de l'objet global "app" s'il n'existe pas déjà
  window.app = window.app || {};

  // Assignation du constructeur du modèle à l'objet global "app"
  window.app.Model = Model;
})(window);
