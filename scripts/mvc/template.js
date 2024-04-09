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
  }

  Template.prototype.buildHeader = function (data) {
    return this.headerTemplate(data);
  };

  window.app = window.app || {};
  window.app.Template = Template;
})(window);
