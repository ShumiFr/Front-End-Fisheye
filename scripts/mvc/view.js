(function (window) {
  "use strict";

  function View(template) {
    this.template = template;
    this.$header = qs(".photographer-header");
  }

  View.prototype.showHeader = function (params) {
    this._replaceWith(this.$header, this.template.buildHeader(params));
  };

  View.prototype._replaceWith = function (element, html) {
    const parsedDocument = new DOMParser().parseFromString(html, "text/html");
    element.replaceChildren(...parsedDocument.body.childNodes);
  };

  window.app = window.app || {};
  window.app.View = View;
})(window);
