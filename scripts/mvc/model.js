(function (window) {
  "use strict";

  // Définition du constructeur du modèle
  function Model(storage, view) {
    this.storage = storage; // Stockage des données
    this.view = view;
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
    const self = this; // Capturer la référence à this
    // Utiliser une logique appropriée pour trouver le média par son ID
    this.storage.findMedia(function (mediaData) {
      const media = mediaData.find((media) => String(media.id) === String(mediaId)); // Convertir les deux valeurs en chaînes de caractères pour comparer
      callback(media);
    });
  };

  // Méthode pour basculer le like d'un média
  Model.prototype.toggleLike = function (mediaId, callback) {
    const self = this;
    // Utilisez la méthode findMediaById pour obtenir le média par son ID
    this.findMediaById(mediaId, function (media) {
      if (media) {
        media.liked = !media.liked; // Inverse l'état de like

        // Mettre à jour le nombre de likes
        if (media.liked) {
          media.likes++; // Incrémenter le nombre de likes si le média est liké
        } else {
          media.likes--; // Décrémenter le nombre de likes si le média est unliké
        }

        // Mettre à jour le média dans le stockage
        self.storage.save(mediaId, media, function (updatedMedia) {
          callback(updatedMedia.id, updatedMedia.likes, updatedMedia.liked); // Appeler le rappel avec les nouvelles données du média
        });
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
