(function () {
  "use strict";

  // Crée un objet PhotographeDetails
  function PhotographeDetails(name) {
    this.storage = new app.Store(name); // Crée un nouvel objet Store et l'assigne à la propriété "storage"
    this.model = new app.Model(this.storage); // Crée un nouvel objet Model et l'assigne à la propriété "model"
    this.template = new app.Template(); // Crée un nouvel objet Template et l'assigne à la propriété "template"
    this.view = new app.View(this.template); // Crée un nouvel objet View et l'assigne à la propriété "view"
    this.controller = new app.Controller(this.model, this.view); // Crée un nouvel objet Controller et l'assigne à la propriété "controller"
  }

  // Crée un nouvel objet PhotographeDetails avec le nom "photographes"
  const photographeDetails = new PhotographeDetails("photographes");

  // Définit la vue
  function setView() {
    photographeDetails.controller.init();
  }

  // Affiche le contenu de la mémoire
  this.storage.displayMemory();

  // Ajoute des écouteurs d'événements pour les événements "load" et "hashchange"
  window.addEventListener("load", setView);
  window.addEventListener("hashchange", setView);
})();
