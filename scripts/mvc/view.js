(function (window) {
  "use strict";

  // Je définis la fonction constructeur View.
  function View(template, view) {
    this.template = template;
    this.view = view;

    this.$cardsList = qs(".photographer-gallery"); // Je sélectionne l'élément du DOM correspondant à la liste des cartes.
    this.$modal = document.getElementById("media_modal"); // Je sélectionne l'élément du DOM correspondant à la modale.
    this.$filters = qs(".filters"); // Je sélectionne l'élément du DOM correspondant aux filtres.
  }

  // Méthode pour lier un événement à un gestionnaire d'événements.
  View.prototype.bind = function (event, handler) {
    const self = this;
    if (event === "photoLiked") {
      $delegate(self.$cardsList, ".card__btn", "click", function (event) {
        event.preventDefault();
        console.log("Like button clicked");

        const id = parseInt(event.target.getAttribute("data-like-id"));
        handler(id);
      });

      $delegate(self.$modal, ".card__btn", "keydow", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();

          const id = parseInt(event.target.getAttribute("data-like-id"));
          handler(id);
        }
      });
    }

    if (event === "nextMedia") {
      $delegate(self.$modal, "#right_arrow img", "click", function (event) {
        event.preventDefault();
        console.log("Next media button clicked");

        handler();
      });

      $delegate(self.$modal, "#right_arrow img", "keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();

          handler();
        }
      });
    }

    if (event === "previousMedia") {
      $delegate(self.$modal, "#left_arrow img", "click", function (event) {
        event.preventDefault();
        console.log("Next media button clicked");

        handler();
      });

      $delegate(self.$modal, "#left_arrow img", "keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();

          handler();
        }
      });
    }

    if (event === "openDropdown") {
      $delegate(self.$filters, "button", "click", function (event) {
        event.preventDefault();
        const dropdown = qs(".filters-dropdown");
        const icon = qs(".filters-container i");

        dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";

        if (dropdown.style.display === "block") {
          icon.classList.remove("fa-chevron-up");
          icon.classList.add("fa-chevron-down");
        } else {
          icon.classList.remove("fa-chevron-down");
          icon.classList.add("fa-chevron-up");
        }
      });
    }

    if (event === "sortMedia") {
      this.$filtersDropdown = qs(".filters-dropdown");
      $delegate(self.$filtersDropdown, "span", "click", function (event) {
        event.preventDefault();

        const selectedOption = event.target.getAttribute("value");
        handler(selectedOption);

        const selectedOptionText = event.target.innerText;
        const button = self.$filters.querySelector("button");
        button.textContent = selectedOptionText;
      });

      $delegate(self.$filtersDropdown, "span", "keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault();

          const selectedOption = event.target.getAttribute("value");
          handler(selectedOption);

          const selectedOptionText = event.target.innerText;
          const button = self.$filters.querySelector("button");
          button.textContent = selectedOptionText;
        }
      });
    }
  };

  // Méthode pour render.
  View.prototype.render = function (viewCmd, params) {
    const self = this;
    const viewCmdList = {
      updateLikes: function () {
        self._replaceWith(qs(`.photo-like-${params.id}`), self.template.buildLikeButton(params));
      },
    };

    viewCmdList[viewCmd].call();
  };

  // Méthode pour afficher l'en-tête.
  View.prototype.showHeader = function (params) {
    this.$header = qs(".photographer-header"); // Je sélectionne l'élément du DOM correspondant à l'en-tête.
    this._replaceWith(this.$header, this.template.buildHeader(params)); // Je remplace le contenu de l'en-tête par le contenu généré par le template.
  };

  // Méthode pour afficher les cartes de la galerie.
  View.prototype.showGalleryCards = function (galleryCards) {
    this.$gallery = qs(".photographer-gallery"); // Je sélectionne l'élément du DOM correspondant à la galerie.
    this._replaceWith(this.$gallery, galleryCards.join("")); // Je remplace le contenu de la galerie par le contenu généré par le template.

    // J'ajoute l'attribut data-media-id à chaque carte de la galerie.
    const galleryCardElements = document.querySelectorAll(".photographer-gallery .card");
    galleryCardElements.forEach((card, index) => {
      const mediaId = card.getAttribute("data-media-id");
      card.setAttribute("data-media-index", index); // J'ajoute l'attribut data-media-index.
      card.setAttribute("data-media-id", mediaId); // J'utilise l'ID récupéré depuis l'attribut data-media-id.
    });
  };

  // Méthode pour afficher les likes et le prix.
  View.prototype.showLikesPrice = function (params) {
    this.$likesPrice = qs(".likes-price");
    this._replaceWith(this.$likesPrice, this.template.buildLikesPrice(params));
  };

  // Méthode pour afficher les filtres.
  View.prototype.showFilters = function () {
    this.$filters = qs(".filters");
    this._replaceWith(this.$filters, this.template.buildFilters());
  };

  // Méthode pour reconstruire la galerie avec les médias triés.
  View.prototype.rebuildGallery = function (mediaData) {
    const galleryCards = mediaData.map((media) => this.template.buildGalleryCard(media));
    this._replaceWith(this.$gallery, galleryCards.join(""));

    const galleryCardElements = document.querySelectorAll(".photographer-gallery .card");
    galleryCardElements.forEach((card, index) => {
      const mediaId = card.getAttribute("data-media-id");
      card.setAttribute("data-media-index", index); // J'ajoute l'attribut data-media-index.
      card.setAttribute("data-media-id", mediaId); // J'utilise l'ID récupéré depuis l'attribut data-media-id.
    });
  };

  View.prototype.updateModalWithMedia = function (media) {
    const modal = document.getElementById("media_modal");

    let mediaContent = ""; // Variable pour stocker le contenu de l'image ou de la vidéo.

    if (media.image) {
      mediaContent = `<img id="media_modal_img" src="/assets/images/${media.photographerName}/${media.image}" alt="${media.title}" />`;
    } else if (media.video) {
      mediaContent = `
            <video id="media_modal_video" controls>
                <source src="/assets/images/${media.photographerName}/${media.video}" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        `;
    }

    // Je mets à jour le contenu de la modale avec le template et les données du média.
    modal.innerHTML = `
        <form method="dialog">
            <div  class="media_close">
                <img alt="Button pour fermer la modale" src="assets/icons/close_picture.svg" />
            </div>
        </form>
        <div class="media_modal_button">
            <div id="left_arrow">
                <img alt="Naviguer vers l'image précédente" src="assets/icons/arrow.svg" />
            </div>
            <div class="media_modal_content">
                ${mediaContent} <!-- J'insère l'image ou la vidéo ici. -->
                <h2 id="media_modal_title">${media.title}</h2> <!-- J'utilise le titre du média. -->
            </div>
            <div id="right_arrow">
                <img alt="Naviguer vers l'image suivante" src="assets/icons/arrow.svg" />
            </div>
        </div>
    `;

    // Je mets à jour le style de la modale pour qu'elle soit affichée en flex.
    modal.style.display = "flex";

    // Lorsque la modal est ouverte, je mets tabindex à -1 pour tous les éléments focusables en dehors de la modal.
    const focusableElementsOutsideModal =
      'button, a, img, video, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    document.querySelectorAll(focusableElementsOutsideModal).forEach((element) => {
      // Assurez-vous que l'élément n'est pas dans la modale
      if (!modal.contains(element)) {
        element.setAttribute("tabindex", "-1");
      } else {
        element.setAttribute("tabindex", "0");
      }
    });

    // J'ajoute un écouteur d'événements au bouton de fermeture.
    const closeButton = modal.querySelector(".media_close");
    closeButton.addEventListener("click", () => {
      modal.style.display = "none";

      // Lorsque la modal est fermée, je reinitialise tabindex à 0 pour tous les éléments focusables en dehors de la modal
      document.querySelectorAll(focusableElementsOutsideModal).forEach((element) => {
        element.setAttribute("tabindex", "0");
      });
    });
  };

  // Méthode pour mettre à jour le bouton de like.
  View.prototype.updateLike = function (mediaId, likes, liked) {
    const likeButton = qs(`[data-like-id="${mediaId}"]`, this.$cardsList);
    if (likeButton) {
      likeButton.innerHTML = `${likes} ${
        liked ? '<i class="fa-solid fa-heart"></i>' : '<i class="far fa-heart"></i>'
      }`;
    }
  };

  // Méthode pour mettre à jour les likes et le prix.
  View.prototype.updateLikesPrice = function (data) {
    const likesPriceHtml = this.template.buildLikesPrice(data);
    const likesPriceElement = document.querySelector(".likes-price");
    if (likesPriceElement) {
      likesPriceElement.innerHTML = likesPriceHtml;
    }
  };

  // Méthode pour afficher le nom dans la modal de contact.
  View.prototype.showNameContactModal = function (params) {
    this.$nameModal = qById("modal_header"); // Sélection de l'élément du DOM correspondant a la modal.
    this._replaceWith(this.$nameModal, this.template.buildContactModal(params)); // Remplacement du contenu de la modal par le contenu généré par le template.
  };

  // Méthode pour remplacer un élément avec du HTML.
  View.prototype._replaceWith = function (element, html) {
    const parsedDocument = new DOMParser().parseFromString(html, "text/html"); // Création d'un document HTML à partir de la chaîne de caractères.
    element.replaceChildren(...parsedDocument.body.childNodes); // Remplacement des enfants de l'élément par les enfants du document HTML.
  };

  // Exposition de la classe View en tant que propriété de l'objet global "app".
  window.app = window.app || {};
  window.app.View = View;
})(window);
