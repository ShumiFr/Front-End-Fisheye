(function (window) {
  "use strict";

  // Je définis le constructeur du modèle.
  function Model(storage, view) {
    this.storage = storage; // Je stocke les références au storage,
    this.view = view; // et à la vue.
  }

  // Méthode pour trouver tous les photographes.
  Model.prototype.findPhotographers = function (query) {
    return this.storage.findPhotographers(query);
  };

  // Méthode pour obtenir le prix d'un photographe.
  Model.prototype.getPhotographerPrice = function (photographerId, callback) {
    // Je trouve le photographe correspondant à l'ID.
    this.storage.findPhotographers(function (photographerData) {
      const photographer = photographerData.find(
        (photographer) => photographer.id === photographerId
      );
      // Je récupère le prix du photographe ou 0 s'il n'est pas trouvé.
      const photographerPrice = photographer ? photographer.price : 0;
      // J'appelle le callback avec le prix trouvé.
      callback(photographerPrice);
    });
  };

  // Méthode pour trouver tous les médias.
  Model.prototype.findMedia = function (query) {
    return this.storage.findMedia(query);
  };

  // Méthode pour trouver un média par son ID.
  Model.prototype.findMediaById = function (mediaId, callback) {
    // Je trouve le média correspondant à l'ID.
    this.storage.findMedia(function (mediaData) {
      const media = mediaData.find((media) => String(media.id) === String(mediaId));
      // J'appelle le callback avec le média trouvé.
      callback(media);
    });
  };

  // Méthode pour mettre a jour le like d'un média.
  Model.prototype.toggleLike = function (mediaId, callback) {
    self = this;
    // J'utilise la méthode findMediaById pour obtenir le média par son ID.
    this.findMediaById(mediaId, function (media) {
      if (media) {
        media.liked = !media.liked; // Je change l'état du like.
        // Je mets à jour le nombre de likes.
        if (media.liked) {
          media.likes++; // J'incrémente le nombre de likes si le média est liké.
        } else {
          media.likes--; // Je décrémente le nombre de likes si le média est unliké.
        }
        // Je mets à jour le média dans le stockage.
        self.storage.save(mediaId, media, function (updatedMedia) {
          // J'appelle le callback avec les nouvelles données du média.
          callback(updatedMedia.id, updatedMedia.likes, updatedMedia.liked);
        });
      }
    });
  };

  // Méthode pour obtenir le nombre total de likes pour un photographe.
  Model.prototype.getTotalLikes = function (photographerId, callback) {
    // Je trouve tous les médias.
    this.storage.findMedia(function (mediaData) {
      // Je filtre les médias appartenant au photographe correspondant à l'ID.
      const photographerMedia = mediaData.filter(
        (media) => media.photographerId === photographerId
      );
      // Je calcule le total des likes.
      const totalLikes = photographerMedia.reduce((total, media) => total + media.likes, 0);
      // J'appelle le callback avec le total des likes calculé.
      callback(totalLikes);
    });
  };

  window.app = window.app || {}; // Je définis l'objet global "app" s'il n'existe pas déjà.
  window.app.Model = Model; // J'assigne le constructeur du modèle à l'objet global "app".
})(window);
