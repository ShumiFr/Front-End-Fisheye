(function (window) {
  "use strict";

  // Définition du constructeur du modèle
  function Model(storage) {
    this.storage = storage; // Stockage des données
  }

  // Méthode pour truver tous les photographes
  Model.prototype.findPhotographers = function (query) {
    return this.storage.findPhotographers(query);
  };

  Model.prototype.getPhotographerPrice = function (photographerId, callback) {
    this.storage.findPhotographers(function (photographerData) {
      const photographer = photographerData.find(
        (photographer) => photographer.id === photographerId
      );
      const photographerPrice = photographer ? photographer.price : 0; // Gestion du cas où aucun photographe n'est trouvé
      callback(photographerPrice);
    });
  };

  // Méthode pour trouver tous les médias
  Model.prototype.findMedia = function (query) {
    return this.storage.findMedia(query);
  };

  // Méthode pour trouver les média via leur ID
  Model.prototype.findMediaById = function (mediaId, callback) {
    // Utiliser une logique appropriée pour trouver le média par son ID
    this.storage.findMedia(function (mediaData) {
      const media = mediaData.find((media) => String(media.id) === String(mediaId)); // Convertir les deux valeurs en chaînes de caractères pour comparer
      callback(media);
    });
  };

  // Méthode pour ajouter un like à une photo
  Model.prototype.addLike = function (photoId, callback) {
    const self = this;
    this.storage.findMediaById(photoId, function (item) {
      if (item) {
        self.storage.save(photoId, { ...item, likes: item.likes + 1 }, callback);
      } else {
        // Gérer le cas où l'élément n'est pas trouvé
        console.error("L'élément avec l'ID spécifié n'a pas été trouvé.");
      }
    });
  };

  Model.prototype.getTotalLikes = function (photographerId, callback) {
    this.storage.findMedia(function (mediaData) {
      // Filtrer les médias qui appartiennent au photographe avec l'ID correspondant
      const photographerMedia = mediaData.filter(
        (media) => media.photographerId === photographerId
      );
      // Calculer le total des likes
      const totalLikes = photographerMedia.reduce((total, media) => total + media.likes, 0);
      // Appeler le callback avec le total des likes calculé
      callback(totalLikes);
    });
  };

  // Définition de l'objet global "app" s'il n'existe pas déjà
  window.app = window.app || {};

  // Assignation du constructeur du modèle à l'objet global "app"
  window.app.Model = Model;
})(window);
