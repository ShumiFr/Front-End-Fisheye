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

    // Définition du template pour les cartes de la galerie
    this.galleryCardTemplate = ({ title, likes, image, video, photographerName }) => {
      let mediaElement = "";
      if (image) {
        mediaElement = `<img src="/assets/images/${photographerName}/${image}" alt="${title}" />`;
      } else if (video) {
        mediaElement = `
      <div class="video-container">
        <video src="/assets/images/${photographerName}/${video}" alt="${title}"></video>
      </div>
    `;
      } else {
        // Afficher un message d'erreur ou une image par défaut si ni image ni vidéo n'est défini
        mediaElement = `<p>Media not available</p>`;
      }

      return `
    <div class="card">
      ${mediaElement}
      <h3>${title}</h3>
      <p>${likes} <i class='fa-solid fa-heart'></i></p>
    </div>
  `;
    };

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

  // Ajout de la méthode buildGalleryCard au prototype de Template
  Template.prototype.buildGalleryCard = function (data) {
    return this.galleryCardTemplate(data); // Génération du contenu de la carte de la galerie en utilisant le template
  };

  // Ajout de la méthode buildContactModal au prototype de Template
  Template.prototype.buildContactModal = function (data) {
    return this.contactModalTemplate(data); // Génération du contenu de la modal en utilisant le template
  };

  // Définition de l'objet Template dans l'espace global de la fenêtre
  window.app = window.app || {};
  window.app.Template = Template;
})(window);
