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
    // Obtenir l'ID du photographe à partir de l'URL
    this.photographerId = this.getPhotographerIdFromUrl();

    // Afficher l'en-tête
    this.showHeader();

    // Obtenir le nom du photographe
    this.getPhotographerName();

    // Afficher les cartes de la galerie
    this.showGalleryCards();

    // Afficher le modal du nom et des coordonnées
    this.showNameContactModal();
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
        return self.view.template.buildGalleryCard(media);
      });

      // Afficher les cartes de la galerie
      self.view.showGalleryCards(galleryCards);
    });
  };

  // Afficher le modal du nom et des coordonnées
  Controller.prototype.showNameContactModal = function () {
    const self = this;
    self.model.findPhotographers(function (data) {
      // Trouver le photographe correspondant à l'ID du photographe
      const photographerData = data.find((photographer) => photographer.id === self.photographerId);

      // Afficher le modal du nom et des coordonnées en utilisant les données du photographe
      self.view.showNameContactModal(photographerData);
    });
  };
  // Obtenir l'ID du photographe à partir de l'URL
  Controller.prototype.getPhotographerIdFromUrl = function () {
    const urlParams = new URLSearchParams(window.location.search);
    return Number(urlParams.get("id"));
  };

  // Créer un espace de noms pour l'application et y assigner le contrôleur
  window.app = window.app || {};
  window.app.Controller = Controller;
})(window);
