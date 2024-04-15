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

  Model.prototype.findMediaById = function (mediaId, callback) {
    // Utiliser une logique appropriée pour trouver le média par son ID
    this.storage.findMedia(function (mediaData) {
      const media = mediaData.find((media) => String(media.id) === String(mediaId)); // Convertir les deux valeurs en chaînes de caractères pour comparer
      console.log("Media found by ID:", media);
      callback(media);
    });
  };

  // Définition de l'objet global "app" s'il n'existe pas déjà
  window.app = window.app || {};

  // Assignation du constructeur du modèle à l'objet global "app"
  window.app.Model = Model;
})(window);
