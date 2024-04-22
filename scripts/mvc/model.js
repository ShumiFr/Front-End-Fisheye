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

  Model.prototype.getPhotographerPrice = function (callback) {
    this.storage.findPhotographers(function (photographerData) {
      const photographerPrice = photographerData[0].price;
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

  Model.prototype.getTotalLikes = function (callback) {
    // Appeler la méthode pour récupérer tous les médias
    this.storage.findMedia(function (mediaData) {
      // Calculer le total des likes
      const totalLikes = mediaData.reduce((total, media) => total + media.likes, 0);

      callback(totalLikes);
    });
  };

  // Définition de l'objet global "app" s'il n'existe pas déjà
  window.app = window.app || {};

  // Assignation du constructeur du modèle à l'objet global "app"
  window.app.Model = Model;
})(window);
