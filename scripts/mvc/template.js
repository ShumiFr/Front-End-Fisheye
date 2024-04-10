(function (window) {
  "use strict";

  // Définition de la fonction constructeur Template
  function Template() {
    // Définition du template pour l'en-tête
    this.headerTemplate = ({ name, city, tagline, portrait }) => `
        <div class="photographer-header__description">
            <h1 class="name">${name}</h1>
            <p class="city">${city}</p>
            <p class="tagline">${tagline}</p>
        </div>
        <button class="contact_button" onclick="displayModal()">Contactez-moi</button>
        <div class="photographer-header__img">
            <img src="/assets/photographers/${portrait}" alt="${name}" />
        </div>
    `;

    // Définition du template pour la modal de contact
    this.contactModalTemplate = ({ name }) => `
        <h2>Contactez-moi</h2>
        <h2>${name}</h2>
    `;
  }

  // Ajout des méthodes buildHeader et buildContactModal au prototype de Template
  Template.prototype.buildHeader = function (data) {
    return this.headerTemplate(data); // Génération du contenu de l'en-tête en utilisant le template
  };

  Template.prototype.buildContactModal = function (data) {
    return this.contactModalTemplate(data); // Génération du contenu de la modal en utilisant le template
  };

  // Définition de l'objet Template dans l'espace global de la fenêtre
  window.app = window.app || {};
  window.app.Template = Template;
})(window);
