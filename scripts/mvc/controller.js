(function (window) {
  "use strict";

  function Controller(model, view) {
    const self = this;
    self.model = model;
    self.view = view;
  }

  Controller.prototype.init = function () {
    this.photographerId = this.getPhotographerIdFromUrl();
    this.showHeader();
    this.showNameContactModal();
  };

  Controller.prototype.showHeader = function () {
    const self = this;
    self.model.read(function (data) {
      const photographerData = data.find((photographer) => photographer.id === self.photographerId);
      self.view.showHeader(photographerData);
    });
  };

  Controller.prototype.showNameContactModal = function () {
    const self = this;
    self.model.read(function (data) {
      const photographerData = data.find((photographer) => photographer.id === self.photographerId);
      self.view.showNameContactModal(photographerData);
    });
  };

  Controller.prototype.getPhotographerIdFromUrl = function () {
    const urlParams = new URLSearchParams(window.location.search);
    return Number(urlParams.get("id"));
  };

  window.app = window.app || {};
  window.app.Controller = Controller;
})(window);
