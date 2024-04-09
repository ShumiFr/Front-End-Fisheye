(function () {
  "use strict";

  // Crée une application pour afficher les photographes
  function PhotographeDetails(name) {
    this.storage = new app.Store(name); // Crée un stockage
    this.model = new app.Model(this.storage); // Crée un modèle
    this.template = new app.Template(); // Crée un template
    this.view = new app.View(this.template); // Crée une vue
    this.controller = new app.Controller(this.model, this.view); // Crée un contrôleur
  }

  // Crée une instance de l'application
  const photographeDetails = new PhotographeDetails("photographes");

  // Initialise l'application
  function setView() {
    photographeDetails.controller.init();
    photographeDetails.storage.displayMemory();
  }

  photographeDetails.storage.then(() => {
    window.addEventListener("load", setView);
    window.addEventListener("hashchange", setView);
  });
})();
