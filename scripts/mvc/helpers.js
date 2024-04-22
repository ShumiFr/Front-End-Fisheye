(function (window) {
  "use strict";

  window.qById = function (selector, scope) {
    return (scope || document).getElementById(selector);
  };

  window.qs = function (selector, scope) {
    return (scope || document).querySelector(selector);
  };

  window.qsa = function (selector, scope) {
    return (scope || document).querySelectorAll(selector);
  };

  window.$on = function (target, type, callback) {
    target.addEventListener(type, callback);
  };

  window.$delegate = function (target, selector, type, handler) {
    function dispatchEvent(event) {
      var targetElement = event.target; // Récupère l'élément cible de l'événement
      var potentialElements = window.qsa(selector, target); // Récupère les éléments correspondant au sélecteur
      var hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0; // Vérifie si l'élément cible correspond au sélecteur

      if (hasMatch) handler.call(targetElement, event); // Appelle le gestionnaire d'événements si l'élément cible correspond au sélecteur
    }

    window.$on(target, type, dispatchEvent); // Ajoute un écouteur d'événements à l'élément cible
  };

  NodeList.prototype.forEach = Array.prototype.forEach;
  Array.prototype.remove = function (element) {
    // TODO: To be implemented.
  };
})(window);
