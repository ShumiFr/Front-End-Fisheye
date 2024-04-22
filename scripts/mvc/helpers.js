(function (window) {
  "use strict";

  // Définition des fonctions helpers

  // Fonction pour sélectionner un élément par son ID
  window.qById = function (selector, scope) {
    return (scope || document).getElementById(selector);
  };

  // Fonction pour sélectionner le premier élément correspondant au sélecteur CSS
  window.qs = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  // Fonction pour sélectionner tous les éléments correspondant au sélecteur CSS
  window.qsa = function (selector, scope) {
    return (scope || document).querySelectorAll(selector);
  };

  // Fonction pour ajouter un écouteur d'événements à un élément
  window.$on = function (target, type, callback) {
    target.addEventListener(type, callback);
  };

  // Fonction pour déléguer un événement à un sélecteur CSS spécifique sur un élément parent
  window.$delegate = function (target, selector, type, handler) {
    function dispatchEvent(event) {
      var targetElement = event.target; // Récupère l'élément cible de l'événement
      var potentialElements = window.qsa(selector, target); // Récupère les éléments correspondant au sélecteur
      var hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0; // Vérifie si l'élément cible correspond au sélecteur

      if (hasMatch) handler.call(targetElement, event); // Appelle le gestionnaire d'événements si l'élément cible correspond au sélecteur
    }

    window.$on(target, type, dispatchEvent); // Ajoute un écouteur d'événements à l'élément cible
  };

  // Méthode forEach pour les NodeList
  NodeList.prototype.forEach = Array.prototype.forEach;

  // Méthode pour supprimer un élément d'un tableau
  Array.prototype.remove = function (element) {
    // À implémenter
  };
})(window);
