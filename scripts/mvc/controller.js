(function (window) {
  "use strict";

  // Crée un contrôleur pour gérer les données
  function Controller(model, view) {
    this.model = model;
    this.view = view;
  }

  // Initialise le contrôleur
  Controller.prototype.init = function () {
    this.showAllPhotos();
  };

  // Affiche toutes les photos
  Controller.prototype.showAllPhotos = function () {
    this.model.read((data) => {
      this.view.render("showAllPhotos", data);
    });
  };

  window.app = window.app || {};
  window.app.Controller = Controller;
})(window);
