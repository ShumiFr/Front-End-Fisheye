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

  window.$on = function (target, type, callback, useCapture) {
    target.addEventListener(type, callback, !!useCapture);
  };

  window.$delegate = function (target, selector, type, handler) {
    function dispatchEvent(event) {
      var targetElement = event.target;
      var potentialElements = window.qsa(selector, target);
      var hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;

      if (hasMatch) handler.call(targetElement, event);
    }

    // https://developer.mozilla.org/en-US/docs/Web/Events/blur
    var useCapture = type === "blur" || type === "focus";

    window.$on(target, type, dispatchEvent, useCapture);
  };

  NodeList.prototype.forEach = Array.prototype.forEach;
  Array.prototype.remove = function (element) {
    // TODO: To be implemented.
  };
})(window);
