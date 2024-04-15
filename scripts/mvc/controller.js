(function (window) {
  "use strict";

  // Fonction constructeur du contrôleur
  function Controller(model, view) {
    const self = this; // Assigner la valeur de "this" à "self" pour pouvoir l'utiliser dans les fonctions de rappel
    self.model = model; // Assigner le modèle au contrôleur
    self.view = view; // Assigner la vue au contrôleur
  }

  // Initialiser le contrôleur
  Controller.prototype.init = function () {
    this.photographerId = this.getPhotographerIdFromUrl(); // Obtenir l'ID du photographe à partir de l'URL
    this.showHeader(); // Afficher l'en-tête
    this.getPhotographerName(); // Obtenir le nom du photographe
    this.showGalleryCards(); // Afficher les cartes de la galerie
    this.showNameContactModal(); // Afficher le nom dans la modal de contact
    this.bindMediaCardsClick(); // Lier les événements de clic sur les cartes de la galerie
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
      const card = event.target.closest(".card");
      if (card) {
        console.log("Card clicked:", card);
        const mediaId = card.dataset.mediaId; // Supposons que chaque carte ait un attribut "data-media-id" qui contient l'ID du média correspondant
        self.showMediaInModal(mediaId);
      }
    });
  };

  // Afficher le média dans une modale
  Controller.prototype.showMediaInModal = function (mediaId) {
    const self = this;
    self.model.findMediaById(mediaId, function (media) {
      // Supposons que la méthode findMediaById récupère les informations sur le média correspondant à partir de l'ID
      // Ici, tu mettras à jour la modale avec l'image du média récupéré
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
