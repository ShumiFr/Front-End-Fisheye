(function (window) {
  "use strict";

  function View(template) {
    this.template = template;
  }

  View.prototype.showHeader = function (params) {
    this.$header = qs(".photographer-header");
    this._replaceWith(this.$header, this.template.buildHeader(params));
  };

  View.prototype.showNameContactModal = function (params) {
    this.$nameModal = qById("modal_header");
    this._replaceWith(this.$nameModal, this.template.buildContactModal(params));
  };

  View.prototype._replaceWith = function (element, html) {
    const parsedDocument = new DOMParser().parseFromString(html, "text/html");
    element.replaceChildren(...parsedDocument.body.childNodes);
  };

  window.app = window.app || {};
  window.app.View = View;
})(window);
