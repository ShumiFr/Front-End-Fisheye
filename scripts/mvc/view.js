(function (window) {
  "use strict";

  // Crée une vue pour afficher les données
  function View(template) {
    this.template = template; // Corrigez "this.templage" en "this.template"

    this.$cardsList = document.querySelector(".cards");
  }

  // Affiche les données dans la vue
  View.prototype.render = function (viewCmd, params) {
    const self = this;
    const viewCmdList = {
      showAllPhotos: function () {
        // Boucle sur les données et les affiche
        params.forEach((photo) => {
          const photoHtml = self.template.buildCardList(photo);
          self._replaceWith(self.$cardsList, photoHtml);
        });
      },
    };

    // Exécute la commande de la vue
    viewCmdList[viewCmd].call();
  };

  // Remplace le contenu d'un élément HTML par un autre
  View.prototype._replaceWith = function (element, html) {
    const parsedDocument = new DOMParser().parseFromString(html, "text/html");
    element.replaceChildren(...parsedDocument.body.childNodes);
  };

  window.app = window.app || {};
  window.app.View = View;
})(window);
