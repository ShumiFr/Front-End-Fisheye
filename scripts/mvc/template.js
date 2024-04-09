(function (window) {
  "use strict";

  // Crée un template pour afficher les données
  function Template() {
    this.cardListTemplate = ({ title, desc }) => `
        <div class="card">
          <h3 class="card__title">${title}</h3>
          <p class="card__desc">${desc}</p>
        </div>
        `;
  }

  // Crée une liste de cartes à partir des données
  Template.prototype.buildCardList = function (data) {
    return data.reduce((v, item) => {
      let template = this.cardListTemplate(item);
      return v + template;
    }, "");
  };

  window.app = window.app || {};
  window.app.Template = Template;
})(window);
