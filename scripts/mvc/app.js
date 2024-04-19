(function () {
  // Le code se trouve à l'intérieur d'une IIFE pour éviter les collisions de variables et pour créer une portée locale.
  "use strict";

  // Définition de la fonction PhotographeDetails
  function PhotographeDetails(name) {
    this.storage = new app.Store(name); // Instance de la classe Store pour le stockage des données
    this.model = new app.Model(this.storage); // Instance de la classe Model avec le store
    this.template = new app.Template(); // Instance de la classe Template pour le rendu
    this.view = new app.View(this.template); // Instance de la classe View avec le template
    this.controller = new app.Controller(this.model, this.view); // Instance de la classe Controller avec le model et la view
  }

  // Création d'une instance de PhotographeDetails avec le nom "photographes"
  const photographeDetails = new PhotographeDetails("photographes");

  // Fonction pour initialiser la vue
  function setView() {
    photographeDetails.controller.init(); // Initialisation du contrôleur pour mettre à jour la vue
  }

  // Appel de la fonction setView lors du chargement de la page
  $on(window, "load", setView);
  // Appel de la fonction setView lors du changement de hash dans l'URL
  $on(window, "hashchange", setView);
})();
