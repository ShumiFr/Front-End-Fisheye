(function () {
  "use strict"; // IIFE pour éviter les collisions de variables et créer une portée locale.

  // Je définis ma fonction PhotographeDetails.
  function PhotographeDetails(name) {
    this.storage = new app.Store(name); // J'instancie un objet Store pour le stockage des données.
    this.model = new app.Model(this.storage); // J'instancie un objet Model avec le store.
    this.template = new app.Template(); // J'instancie un objet Template pour le rendu.
    this.view = new app.View(this.template); // J'instancie un objet View avec le template.
    this.controller = new app.Controller(this.model, this.view); // J'instancie un objet Controller avec le model et la view.
  }

  // Je crée une instance de PhotographeDetails avec le nom "photographes".
  const photographeDetails = new PhotographeDetails("photographes");

  // Fonction pour initialiser la vue.
  function setView() {
    photographeDetails.controller.init(); // J'initialise le contrôleur pour mettre à jour la vue.
  }

  $on(window, "load", setView); // J'appelle la fonction setView lors du chargement de la page.
  $on(window, "hashchange", setView); // J'appelle la fonction setView lors du changement de hash dans l'URL.
})();
