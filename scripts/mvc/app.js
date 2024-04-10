(function () {
  "use strict";

  // Définition de la fonction PhotographeDetails
  function PhotographeDetails(name) {
    this.storage = new app.Store(name); // Création d'une instance de la classe Store
    this.model = new app.Model(this.storage); // Création d'une instance de la classe Model en utilisant le store
    this.template = new app.Template(); // Création d'une instance de la classe Template
    this.view = new app.View(this.template); // Création d'une instance de la classe View en utilisant le template
    this.controller = new app.Controller(this.model, this.view); // Création d'une instance de la classe Controller en utilisant le model et la view
  }

  // Création d'une instance de PhotographeDetails avec le nom "photographes"
  const photographeDetails = new PhotographeDetails("photographes");

  // Fonction pour initialiser la vue
  function setView() {
    photographeDetails.controller.init(); // Initialisation du contrôleur
  }

  // Appel de la fonction setView lors du chargement de la page
  $on(window, "load", setView);
  // Appel de la fonction setView lors du changement de hash dans l'URL
  $on(window, "hashchange", setView);
})();
