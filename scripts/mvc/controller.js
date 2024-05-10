(function (window) {
  "use strict";

  // Je définis la fonction constructeur du contrôleur.
  function Controller(model, view) {
    const self = this; // J'assigne la valeur de "this" à "self" pour pouvoir l'utiliser dans les fonctions de rappel.
    self.model = model; // J'assigne le modèle au contrôleur.
    self.view = view; // J'assigne la vue au contrôleur.

    // Je lie l'événement "photoLiked" à la fonction toggleLike.
    self.view.bind("photoLiked", function (photoId) {
      self.toggleLike(photoId);
    });
  }

  // Dans votre contrôleur
  Controller.prototype.init = function () {
    const self = this; // J'assigne la valeur de "this" à "self" pour pouvoir l'utiliser dans les fonctions de rappel.
    self.photographerId = self.getPhotographerIdFromUrl(); // J'obtiens l'ID du photographe à partir de l'URL.

    self.model.findMediaByPhotographerId(self.photographerId, function (mediaList) {
      self.mediaList = mediaList; // Je trouve les médias du photographe.
      console.log(self.mediaList);
    });

    self.currentMediaIndex = 0; // Je définis l'index du média actuel sur 0.

    self.showHeader(); // J'affiche l'en-tête.
    self.getPhotographerName(); // J'obtiens le nom du photographe.
    self.showGalleryCards(); // J'affiche les cartes de la galerie.
    self.showNameContactModal(); // J'affiche le nom dans la modal de contact.
    self.bindMediaCardsClick(); // Je lie les événements de clic sur les cartes de la galerie.
    self.showLikesPrice(); // J'affiche les likes et le prix.
    self.view.showFilters(); // J'affiche les filtres.
    self.view.bind("openDropdown");

    // Je lie l'événement "sortByChanged" à la fonction handleSortBy.
    self.view.bind("sortMedia", function (selectedOption) {
      self.handleSortBy(selectedOption);
    });
  };

  // J'obtiens l'ID du photographe à partir de l'URL.
  Controller.prototype.getPhotographerIdFromUrl = function () {
    const urlParams = new URLSearchParams(window.location.search);
    return Number(urlParams.get("id"));
  };

  // J'obtiens le nom du photographe.
  Controller.prototype.getPhotographerName = function () {
    const self = this;
    return new Promise((resolve, reject) => {
      self.model.findPhotographers(function (data) {
        // Je trouve les données du photographe correspondant à l'ID.
        const photographerData = data.find(
          (photographer) => photographer.id === self.photographerId
        );
        resolve(photographerData.name);
      });
    });
  };

  // J'affiche l'en-tête.
  Controller.prototype.showHeader = function () {
    const self = this;
    self.model.findPhotographers(function (data) {
      // Je trouve les données du photographe correspondant à l'ID.
      const photographerData = data.find((photographer) => photographer.id === self.photographerId);

      // J'affiche l'en-tête en utilisant les données du photographe.
      self.view.showHeader(photographerData);
    });
  };

  // J'affiche les cartes de la galerie.
  Controller.prototype.showGalleryCards = async function () {
    const self = this;
    const photographerName = await this.getPhotographerName();
    const mediaData = await new Promise((resolve, reject) => {
      self.model.findMedia(function (data) {
        resolve(data);
      });
    });

    const galleryCards = [];
    for (let i = 0; i < mediaData.length; i++) {
      const media = mediaData[i];
      if (media.photographerId === self.photographerId) {
        media.photographerName = photographerName;
        const card = self.view.template.buildGalleryCard(media, media.id);
        galleryCards.push(card);
      }
    }

    self.view.showGalleryCards(galleryCards);
  };

  // J'affiche le média suivant
  Controller.prototype.showNextMedia = function () {
    const self = this;
    // Incrémentez currentIndex
    self.currentIndex++;
    // Si currentIndex est plus grand que la longueur de la liste des médias, réinitialisez-le à 0
    if (self.currentIndex >= self.mediaList.length) {
      self.currentIndex = 0;
    }

    console.log(self.mediaList, self.currentIndex);
    // Affichez le média à currentIndex
    const nextMediaId = self.mediaList[self.currentIndex].id;
    self.showMediaInModal(nextMediaId, self.currentIndex);
  };

  Controller.prototype.showPreviousMedia = function () {
    const self = this;
    // Décrémentez currentIndex
    self.currentIndex--;
    // Si currentIndex est négatif, réinitialisez-le à la longueur de la liste des médias - 1
    if (self.currentIndex < 0) {
      self.currentIndex = self.mediaList.length - 1;
    }
    // Affichez le média à currentIndex
    const previousMediaId = self.mediaList[self.currentIndex].id;
    self.showMediaInModal(previousMediaId, self.currentIndex);
  };

  // J'affiche les likes et le prix.
  Controller.prototype.showLikesPrice = function () {
    const self = this;
    // Je récupère d'abord le total des likes des médias du photographe actuellement sélectionné.
    self.model.getTotalLikes(self.photographerId, function (totalLikes) {
      // Ensuite, je récupère le prix du photographe actuellement sélectionné.
      self.model.getPhotographerPrice(self.photographerId, function (photographerPrice) {
        // J'affiche les likes et le prix en utilisant les données récupérées.
        self.view.showLikesPrice({ totalLikes, photographerPrice });
      });
    });
  };

  // Fonction pour gérer le changement de critère de tri.
  Controller.prototype.handleSortBy = async function (selectedOption) {
    const self = this;
    try {
      // Récupérer les médias du photographe
      const photographerMedia = await new Promise((resolve, reject) => {
        self.model.findMedia(function (mediaData) {
          const filteredMedia = mediaData.filter(
            (media) => media.photographerId === self.photographerId
          );
          resolve(filteredMedia);
        });
      });

      console.log("Media data before sorting:", photographerMedia);

      const sortedMedia = self.model.sortMedia(photographerMedia, selectedOption);

      console.log("Media data after sorting:", sortedMedia);
      self.mediaList = sortedMedia;

      self.view.rebuildGallery(self.mediaList);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  // Je lie les événements de clic sur les cartes de la galerie.
  Controller.prototype.bindMediaCardsClick = function () {
    const self = this;
    const galleryContainer = document.querySelector(".photographer-gallery");

    galleryContainer.addEventListener("click", function (event) {
      // Je récupère l'élément parent de l'image ou de la vidéo qui a été cliqué.
      const mediaElement = event.target.closest(".card img, .card video");

      // Je vérifie si l'élément cliqué est une image ou une vidéo.
      if (mediaElement) {
        // Je récupère l'ID du média à partir de l'élément parent de l'image ou de la vidéo.
        const card = mediaElement.closest(".card");
        const mediaId = card.dataset.mediaId;
        const mediaIndex = card.dataset.mediaIndex;

        // J'affiche le média dans la modal.
        self.showMediaInModal(mediaId, mediaIndex);

        self.view.bind("nextMedia", function () {
          self.showNextMedia();
        });

        self.view.bind("previousMedia", function () {
          self.showPreviousMedia();
        });
      }
    });

    // J'ajoute un écouteur d'événements keydown à galleryContainer
    galleryContainer.addEventListener("keydown", function (event) {
      // Je vérifie si la touche pressée est la touche Entrée
      if (event.key === "Enter" || event.keyCode === 13) {
        // Je récupère l'élément parent de l'image ou de la vidéo qui a été cliqué
        const mediaElement = event.target.closest(".card img, .card video");

        // Je vérifie si l'élément cliqué est une image ou une vidéo
        if (mediaElement) {
          // Je récupère l'ID du média à partir de l'élément parent de l'image ou de la vidéo
          const card = mediaElement.closest(".card");
          const mediaId = card.dataset.mediaId;
          const mediaIndex = card.dataset.mediaIndex;

          // J'affiche le média dans la modal
          self.showMediaInModal(mediaId, mediaIndex);

          self.view.bind("nextMedia", function () {
            self.showNextMedia();
          });

          self.view.bind("previousMedia", function () {
            self.showPreviousMedia();
          });
        }
      }
    });
  };

  // J'affiche le média dans une modale.
  Controller.prototype.showMediaInModal = function (mediaId, mediaIndex) {
    const self = this;
    self.model.findMediaById(mediaId, function (media) {
      self.currentIndex = mediaIndex;
      self.view.updateModalWithMedia(media, mediaIndex);
    });
  };

  // J'ajoute la méthode toggleLike au prototype de Controller.
  Controller.prototype.handleLikeButtonClicked = function (mediaId) {
    this.model.toggleLike(mediaId); // J'appelle la méthode toggleLike du modèle.
  };

  // J'affiche les likes et le prix de l'encadré.
  Controller.prototype.toggleLike = function (mediaId) {
    const self = this;
    self.model.toggleLike(mediaId, function (mediaId, likes, liked) {
      // J'affiche le nombre de likes et le bouton de like mis à jour.
      self.view.updateLike(mediaId, likes, liked);
      // J'appelle la méthode updateLikesPrice pour mettre à jour le total des likes.
      self.updateLikesPrice();
    });
  };

  // Je mets à jour le total des likes après avoir ajouté ou supprimé un like.
  Controller.prototype.updateLikesPrice = function () {
    const self = this;

    // Je récupère d'abord le total des likes des médias du photographe actuellement sélectionné.
    self.model.getTotalLikes(self.photographerId, function (totalLikes) {
      // Ensuite, je récupère le prix du photographe actuellement sélectionné.
      self.model.getPhotographerPrice(self.photographerId, function (photographerPrice) {
        // Je mets à jour les likes et le prix en utilisant les données récupérées.
        self.view.updateLikesPrice({ totalLikes, photographerPrice });
      });
    });
  };

  // J'affiche le nom dans la modal de contact.
  Controller.prototype.showNameContactModal = function () {
    const self = this;
    self.model.findPhotographers(function (data) {
      // Je trouve le photographe correspondant à l'ID du photographe.
      const photographerData = data.find((photographer) => photographer.id === self.photographerId);

      // J'affiche le modal du nom et des coordonnées en utilisant les données du photographe.
      self.view.showNameContactModal(photographerData);
    });
  };

  // Je crée un espace de noms pour l'application et j'y assigne le contrôleur.
  window.app = window.app || {};
  window.app.Controller = Controller;
})(window);
