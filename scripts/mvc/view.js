(function (window) {
  "use strict";

  // Définition de la fonction constructeur View
  function View(template) {
    this.template = template;
  }

  // Méthode pour afficher l'en-tête
  View.prototype.showHeader = function (params) {
    this.$header = qs(".photographer-header"); // Sélection de l'élément du DOM correspondant à l'en-tête
    this._replaceWith(this.$header, this.template.buildHeader(params)); // Remplacement du contenu de l'en-tête par le contenu généré par le template
  };

  // Méthode pour afficher le modal de nom et contact
  View.prototype.showNameContactModal = function (params) {
    this.$nameModal = qById("modal_header"); // Sélection de l'élément du DOM correspondant a la modal
    this._replaceWith(this.$nameModal, this.template.buildContactModal(params)); // Remplacement du contenu de la modal par le contenu généré par le template
  };

  // Méthode pour remplacer un élément avec du HTML
  View.prototype._replaceWith = function (element, html) {
    const parsedDocument = new DOMParser().parseFromString(html, "text/html"); // Création d'un document HTML à partir de la chaîne de caractères
    element.replaceChildren(...parsedDocument.body.childNodes); // Remplacement des enfants de l'élément par les enfants du document HTML
  };

  // Exposition de la classe View en tant que propriété de l'objet global "app"
  window.app = window.app || {};
  window.app.View = View;
})(window);
