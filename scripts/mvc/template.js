(function (window) {
  "use strict";

  // Je définis la fonction constructeur Template.
  function Template() {
    // Je définis le template pour l'en-tête.
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

    // Je définis le template pour les cartes de la galerie.
    this.galleryCardTemplate = ({ id, title, likes, image, video, photographerName, liked }) => {
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
        mediaElement = `<p>Media not available</p>`;
      }

      return `
          <div class="card" data-media-id="${id}">
            ${mediaElement}
            <h3>${title}</h3>
            <div class="photo-like-${id}">
              <a class="card__btn" href="#" data-like-id="${id}">${likes} ${
        liked ? '<i class="fa-solid fa-heart"></i>' : '<i class="far fa-heart"></i>'
      }</a>
            </div>
          </div>
        `;
    };

    // Je définis le template pour la modal de contact.
    this.contactModalTemplate = ({ name }) => `
        <h2>Contactez-moi</h2>
        <h2>${name}</h2>
    `;
  }

  // J'ajoute la méthodes buildHeader au prototype de Template.
  Template.prototype.buildHeader = function (data) {
    return this.headerTemplate(data); // Je génère le contenu de l'en-tête en utilisant le template.
  };

  // J'ajoute la méthode buildGalleryCard au prototype de Template.
  Template.prototype.buildGalleryCard = function (data) {
    return this.galleryCardTemplate(data); // Je génère le contenu de la carte de la galerie en utilisant le template.
  };

  Template.prototype.buildFilters = function () {
    return `
      <label for="filterSelect">Filtrer par :</label>
      <select class="filterSelect" id="filterSelect">
        <option value="likes">Popularité</option>
        <option value="date">Date</option>
        <option value="title">Titre</option>
      </select>
    `;
  };

  // J'ajoute la méthode buildLikesPrice au prototype de Template.
  Template.prototype.buildLikesPrice = function (data) {
    return `
      <p class="likes">${data.totalLikes} <i class='fa-solid fa-heart'></i></p>
      <p class="price">${data.photographerPrice}€ / jour</p>
    `;
  };

  // J'ajoute la méthode buildLikeButton au prototype de Template.
  Template.prototype.buildLikeButton = function ({ id, likes }) {
    return `
      <a class="card__btn" href="#" data-like-id="${id}">${likes}<i class='fa-solid fa-heart'></i></a>
    `;
  };

  // J'ajoute la méthode buildContactModal au prototype de Template.
  Template.prototype.buildContactModal = function (data) {
    return this.contactModalTemplate(data); // Je génère le contenu de la modal en utilisant le template.
  };

  // J'expose la classe Template en tant que propriété de l'objet global "app".
  window.app = window.app || {};
  window.app.Template = Template;
})(window);
