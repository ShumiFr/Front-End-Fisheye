(function (window) {
  "use strict";

  // Je définis la fonction constructeur du contrôleur.
  function Controller(model, view) {
    const self = this; // J'assigne la valeur de "this" à "self" pour pouvoir l'utiliser dans les fonctions de rappel.
    self.model = model; // J'assigne le modèle au contrôleur.
    self.view = view; // J'assigne la vue au contrôleur.

    // Je lie l'événement "photoLiked" à la fonction toggleLike.
    self.view.bind("photoLiked", function (photoId) {
      self.toggleLike(photoId);
    });
  }

  // J'initialise le contrôleur.
  Controller.prototype.init = function () {
    this.photographerId = this.getPhotographerIdFromUrl(); // J'obtiens l'ID du photographe à partir de l'URL.
    this.showHeader(); // J'affiche l'en-tête.
    this.getPhotographerName(); // J'obtiens le nom du photographe.
    this.showGalleryCards(); // J'affiche les cartes de la galerie.
    this.showNameContactModal(); // J'affiche le nom dans la modal de contact.
    this.bindMediaCardsClick(); // Je lie les événements de clic sur les cartes de la galerie.
    this.showLikesPrice(); // J'affiche les likes et le prix.
  };

  // J'obtiens l'ID du photographe à partir de l'URL.
  Controller.prototype.getPhotographerIdFromUrl = function () {
    const urlParams = new URLSearchParams(window.location.search);
    return Number(urlParams.get("id"));
  };

  // J'obtiens le nom du photographe.
  Controller.prototype.getPhotographerName = function () {
    const self = this;
    return new Promise((resolve, reject) => {
      self.model.findPhotographers(function (data) {
        // Je trouve les données du photographe correspondant à l'ID.
        const photographerData = data.find(
          (photographer) => photographer.id === self.photographerId
        );
        resolve(photographerData.name);
      });
    });
  };

  // J'affiche l'en-tête.
  Controller.prototype.showHeader = function () {
    const self = this;
    self.model.findPhotographers(function (data) {
      // Je trouve les données du photographe correspondant à l'ID.
      const photographerData = data.find((photographer) => photographer.id === self.photographerId);

      // J'affiche l'en-tête en utilisant les données du photographe.
      self.view.showHeader(photographerData);
    });
  };

  // J'affiche les cartes de la galerie.
  Controller.prototype.showGalleryCards = async function () {
    const self = this;
    const photographerName = await this.getPhotographerName();
    self.model.findMedia(function (mediaData) {
      // Je filtre les médias qui appartiennent au photographe avec l'ID correspondant.
      const photographerMedia = mediaData.filter(
        (media) => media.photographerId === self.photographerId
      );

      // Je génère une carte pour chaque média du photographe.
      const galleryCards = photographerMedia.map((media) => {
        // J'ajoute le nom du photographe à l'objet media.
        media.photographerName = photographerName;
        // Je crée une carte de la galerie avec l'ID du média comme attribut de données.
        return self.view.template.buildGalleryCard(media, media.id);
      });

      // J'affiche les cartes de la galerie.
      self.view.showGalleryCards(galleryCards);
    });
  };

  // Je lie les événements de clic sur les cartes de la galerie.
  Controller.prototype.bindMediaCardsClick = function () {
    const self = this;
    const galleryContainer = document.querySelector(".photographer-gallery");

    galleryContainer.addEventListener("click", function (event) {
      // Je récupère l'élément parent de l'image ou de la vidéo qui a été cliqué.
      const mediaElement = event.target.closest(".card img, .card video");

      // Je vérifie si l'élément cliqué est une image ou une vidéo.
      if (mediaElement) {
        // Je récupère l'ID du média à partir de l'élément parent de l'image ou de la vidéo.
        const card = mediaElement.closest(".card");
        const mediaId = card.dataset.mediaId;

        // J'affiche le média dans la modal.
        self.showMediaInModal(mediaId);
      }
    });
  };

  // J'affiche les likes et le prix.
  Controller.prototype.showLikesPrice = function () {
    const self = this;
    // Je récupère d'abord le total des likes des médias du photographe actuellement sélectionné.
    self.model.getTotalLikes(self.photographerId, function (totalLikes) {
      // Ensuite, je récupère le prix du photographe actuellement sélectionné.
      self.model.getPhotographerPrice(self.photographerId, function (photographerPrice) {
        // J'affiche les likes et le prix en utilisant les données récupérées.
        self.view.showLikesPrice({ totalLikes, photographerPrice });
      });
    });
  };

  Controller.prototype.handleLikeButtonClicked = function (mediaId) {
    this.model.toggleLike(mediaId); // J'appelle la méthode toggleLike du modèle.
  };

  Controller.prototype.toggleLike = function (mediaId) {
    const self = this;
    self.model.toggleLike(mediaId, function (mediaId, likes, liked) {
      // J'appelle la fonction de rappel pour mettre à jour la vue.
      self.view.updateLike(mediaId, likes, liked);
    });
  };

  // Mettre à jour les likes et le prix de l'encadré.
  Controller.prototype.updateLikesPrice = function () {
    const self = this;

    // J'appelle la méthode du modèle pour obtenir le total des likes.
    this.model.getTotalLikes(function (totalLikes) {
      const photographerPrice = self.storage.getPhotographerPrice();

      const html = self.template.buildLikesPrice({ totalLikes, price: photographerPrice });

      self.view.updateLikesPrice(html);
    });
  };

  // J'affiche le média dans une modale.
  Controller.prototype.showMediaInModal = function (mediaId) {
    const self = this;
    self.model.findMediaById(mediaId, function (media) {
      self.view.updateModalWithMedia(media);
    });
  };

  // J'affiche le nom dans la modal de contact.
  Controller.prototype.showNameContactModal = function () {
    const self = this;
    self.model.findPhotographers(function (data) {
      // Je trouve le photographe correspondant à l'ID du photographe.
      const photographerData = data.find((photographer) => photographer.id === self.photographerId);

      // J'affiche le modal du nom et des coordonnées en utilisant les données du photographe.
      self.view.showNameContactModal(photographerData);
    });
  };

  // Je crée un espace de noms pour l'application et j'y assigne le contrôleur.
  window.app = window.app || {};
  window.app.Controller = Controller;
})(window);
