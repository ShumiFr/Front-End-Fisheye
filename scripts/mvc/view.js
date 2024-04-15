(function (window) {
  "use strict";

  // Définition de la fonction constructeur View
  function View(template) {
    this.template = template;
  }

  // Méthode pour afficher l'en-tête
  View.prototype.showHeader = function (params) {
    this.$header = qs(".photographer-header"); // Sélection de l'élément du DOM correspondant à l'en-tête
    this._replaceWith(this.$header, this.template.buildHeader(params)); // Remplacement du contenu de l'en-tête par le contenu généré par le template
  };

  // Méthode pour afficher les cartes de la galerie
  View.prototype.showGalleryCards = function (galleryCards) {
    this.$gallery = qs(".photographer-gallery"); // Sélection de l'élément du DOM correspondant à la galerie
    this._replaceWith(this.$gallery, galleryCards.join("")); // Remplacement du contenu de la galerie par le contenu généré par le template

    // Ajout de l'attribut data-media-id à chaque carte de la galerie
    // Ajout de l'attribut data-media-id à chaque carte de la galerie
    const galleryCardElements = document.querySelectorAll(".photographer-gallery .card");
    galleryCardElements.forEach((card, index) => {
      const mediaId = card.getAttribute("data-media-id");
      card.setAttribute("data-media-id", mediaId); // Utilise l'ID récupéré depuis l'attribut data-media-id
    });
  };

  View.prototype.updateModalWithMedia = function (media) {
    const modal = document.querySelector("#media_modal");

    let mediaContent = ""; // Variable pour stocker le contenu de l'image ou de la vidéo

    if (media.type === "image") {
      mediaContent = `<img src="${media.url}" alt="${media.title}" />`;
    } else if (media.type === "video") {
      mediaContent = `
            <video controls>
                <source src="${media.url}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        `;
    }

    // Mettre à jour le contenu de la modale avec le template et les données du média
    modal.innerHTML = `
        <form method="dialog">
            <button class="picture_close">
                <img src="assets/icons/close_picture.svg" />
            </button>
        </form>
        <div class="picture_modal_button">
            <button id="left_arrow">
                <img src="assets/icons/arrow.svg" />
            </button>
            <div class="picture_modal_content">
                ${mediaContent} <!-- Insérer l'image ou la vidéo ici -->
                <h2 id="picture_modal_title">${media.title}</h2> <!-- Utiliser le titre du média -->
            </div>
            <button id="right_arrow">
                <img src="assets/icons/arrow.svg" />
            </button>
        </div>
    `;

    modal.showModal(); // Afficher la modale après avoir mis à jour son contenu
  };

  // Méthode pour afficher nom dans la modal de contact
  View.prototype.showNameContactModal = function (params) {
    this.$nameModal = qById("modal_header"); // Sélection de l'élément du DOM correspondant a la modal
    this._replaceWith(this.$nameModal, this.template.buildContactModal(params)); // Remplacement du contenu de la modal par le contenu généré par le template
  };

  // Méthode pour remplacer un élément avec du HTML
  View.prototype._replaceWith = function (element, html) {
    const parsedDocument = new DOMParser().parseFromString(html, "text/html"); // Création d'un document HTML à partir de la chaîne de caractères
    element.replaceChildren(...parsedDocument.body.childNodes); // Remplacement des enfants de l'élément par les enfants du document HTML
  };

  // Exposition de la classe View en tant que propriété de l'objet global "app"
  window.app = window.app || {};
  window.app.View = View;
})(window);
