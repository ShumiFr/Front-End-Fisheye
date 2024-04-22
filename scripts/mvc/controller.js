(function (window) {
  "use strict";

  // Fonction constructeur du contrôleur
  function Controller(model, view) {
    const self = this; // Assigner la valeur de "this" à "self" pour pouvoir l'utiliser dans les fonctions de rappel
    self.model = model; // Assigner le modèle au contrôleur
    self.view = view; // Assigner la vue au contrôleur

    self.view.bind("photoLiked", function (photoId) {
      self.updateLike(photoId);
    });
  }

  // Initialiser le contrôleur
  Controller.prototype.init = function () {
    this.photographerId = this.getPhotographerIdFromUrl(); // Obtenir l'ID du photographe à partir de l'URL
    this.showHeader(); // Afficher l'en-tête
    this.getPhotographerName(); // Obtenir le nom du photographe
    this.showGalleryCards(); // Afficher les cartes de la galerie
    this.showNameContactModal(); // Afficher le nom dans la modal de contact
    this.bindMediaCardsClick(); // Lier les événements de clic sur les cartes de la galerie
    this.showLikesPrice(); // Afficher les likes et le prix
  };

  // Obtenir l'ID du photographe à partir de l'URL
  Controller.prototype.getPhotographerIdFromUrl = function () {
    const urlParams = new URLSearchParams(window.location.search);
    return Number(urlParams.get("id"));
  };

  // Obtenir le nom du photographe
  Controller.prototype.getPhotographerName = function () {
    const self = this;
    return new Promise((resolve, reject) => {
      self.model.findPhotographers(function (data) {
        // Trouver les données du photographe correspondant à l'ID
        const photographerData = data.find(
          (photographer) => photographer.id === self.photographerId
        );
        resolve(photographerData.name);
      });
    });
  };

  // Afficher l'en-tête
  Controller.prototype.showHeader = function () {
    const self = this;
    self.model.findPhotographers(function (data) {
      // Trouver les données du photographe correspondant à l'ID
      const photographerData = data.find((photographer) => photographer.id === self.photographerId);

      // Afficher l'en-tête en utilisant les données du photographe
      self.view.showHeader(photographerData);
    });
  };

  // Afficher les cartes de la galerie
  Controller.prototype.showGalleryCards = async function () {
    const self = this;
    const photographerName = await this.getPhotographerName();
    self.model.findMedia(function (mediaData) {
      // Filtrer les médias qui appartiennent au photographe avec l'ID correspondant
      const photographerMedia = mediaData.filter(
        (media) => media.photographerId === self.photographerId
      );

      // Générer une carte pour chaque média du photographe
      const galleryCards = photographerMedia.map((media) => {
        // Ajouter le nom du photographe à l'objet media
        media.photographerName = photographerName;
        // Créer une carte de la galerie avec l'ID du média comme attribut de données
        return self.view.template.buildGalleryCard(media, media.id);
      });

      // Afficher les cartes de la galerie
      self.view.showGalleryCards(galleryCards);
    });
  };

  // Lier les événements de clic sur les cartes de la galerie
  Controller.prototype.bindMediaCardsClick = function () {
    const self = this;
    const galleryContainer = document.querySelector(".photographer-gallery");

    galleryContainer.addEventListener("click", function (event) {
      // Récupérer l'élément parent de l'image ou de la vidéo qui a été cliqué
      const mediaElement = event.target.closest(".card img, .card video");

      // Vérifier si l'élément cliqué est une image ou une vidéo
      if (mediaElement) {
        // Récupérer l'ID du média à partir de l'élément parent de l'image ou de la vidéo
        const card = mediaElement.closest(".card");
        const mediaId = card.dataset.mediaId;

        // Afficher le média dans la modal
        self.showMediaInModal(mediaId);
      }
    });
  };

  // Afficher les likes et le prix
  Controller.prototype.showLikesPrice = function () {
    const self = this;
    // Appeler la méthode du modèle pour obtenir le total des likes
    self.model.getTotalLikes(function (totalLikes) {
      // Appeler la méthode du modèle pour obtenir le prix du photographe
      self.model.getPhotographerPrice(function (photographerPrice) {
        // Afficher les likes et le prix en utilisant les données récupérées
        self.view.showLikesPrice({ totalLikes, photographerPrice });
      });
    });
  };

  // Mettre à jour les likes
  Controller.prototype.updateLike = function (photoId) {
    const self = this;
    self.model.addLike(photoId, function ({ id, likes }) {
      self.view.render("updateLikes", { id, likes });
    });
  };

  // Mettre à jour les likes et le prix de l'encadré
  Controller.prototype.updateLikesPrice = function () {
    const self = this;

    // Appeler la méthode du modèle pour obtenir le total des likes
    this.model.getTotalLikes(function (totalLikes) {
      const photographerPrice = self.storage.getPhotographerPrice();

      const html = self.template.buildLikesPrice({ totalLikes, price: photographerPrice });

      self.view.updateLikesPrice(html);
    });
  };

  // Afficher le média dans une modale
  Controller.prototype.showMediaInModal = function (mediaId) {
    const self = this;
    self.model.findMediaById(mediaId, function (media) {
      self.view.updateModalWithMedia(media);
    });
  };

  // Afficher le nom dans la modal de contact
  Controller.prototype.showNameContactModal = function () {
    const self = this;
    self.model.findPhotographers(function (data) {
      // Trouver le photographe correspondant à l'ID du photographe
      const photographerData = data.find((photographer) => photographer.id === self.photographerId);

      // Afficher le modal du nom et des coordonnées en utilisant les données du photographe
      self.view.showNameContactModal(photographerData);
    });
  };

  // Créer un espace de noms pour l'application et y assigner le contrôleur
  window.app = window.app || {};
  window.app.Controller = Controller;
})(window);
