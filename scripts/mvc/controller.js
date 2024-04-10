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

    // Afficher le modal du nom et des coordonnées
    this.showNameContactModal();
  };

  // Afficher l'en-tête
  Controller.prototype.showHeader = function () {
    const self = this;
    self.model.read(function (data) {
      // Trouver les données du photographe correspondant à l'ID
      const photographerData = data.find((photographer) => photographer.id === self.photographerId);

      // Afficher l'en-tête en utilisant les données du photographe
      self.view.showHeader(photographerData);
    });
  };

  // Afficher le modal du nom et des coordonnées
  Controller.prototype.showNameContactModal = function () {
    const self = this;
    self.model.read(function (data) {
      // Trouver les données du photographe correspondant à l'ID
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
