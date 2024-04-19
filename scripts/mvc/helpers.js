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
      var targetElement = event.target;
      var potentialElements = window.qsa(selector, target);
      var hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;

      if (hasMatch) handler.call(targetElement, event);
    }

    window.$on(target, type, dispatchEvent);
  };

  NodeList.prototype.forEach = Array.prototype.forEach;
  Array.prototype.remove = function (element) {
    // TODO: To be implemented.
  };
})(window);
