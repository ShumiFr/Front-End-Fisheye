(function (window) {
  "use strict";

  function Template() {
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

    this.contactModalTemplate = ({ name }) => `
        <h2>Contactez-moi</h2>
        <h2>${name}</h2>
    `;
  }

  Template.prototype.buildHeader = function (data) {
    return this.headerTemplate(data);
  };

  Template.prototype.buildContactModal = function (data) {
    return this.contactModalTemplate(data);
  };

  window.app = window.app || {};
  window.app.Template = Template;
})(window);
