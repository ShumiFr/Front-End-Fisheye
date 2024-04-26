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

    // Je lie l'événement "sortByChanged" à la fonction handleSortBy.
    self.view.bind("sortByChanged", function (selectedOption) {
      self.handleSortBy(selectedOption);
    });
  }

  // Dans votre contrôleur
  Controller.prototype.init = function () {
    const self = this; // J'assigne la valeur de "this" à "self" pour pouvoir l'utiliser dans les fonctions de rappel.
    self.photographerId = self.getPhotographerIdFromUrl(); // J'obtiens l'ID du photographe à partir de l'URL.

    self.model.findMediaByPhotographerId(self.photographerId, function (mediaList) {
      self.mediaList = mediaList; // Je trouve les médias du photographe.
      console.log("mediaList", self.mediaList);
    });

    self.currentMediaIndex = 0; // Je définis l'index du média actuel sur 0.

    self.showHeader(); // J'affiche l'en-tête.
    self.getPhotographerName(); // J'obtiens le nom du photographe.
    self.showGalleryCards(); // J'affiche les cartes de la galerie.
    self.showNameContactModal(); // J'affiche le nom dans la modal de contact.
    self.bindMediaCardsClick(); // Je lie les événements de clic sur les cartes de la galerie.
    self.showLikesPrice(); // J'affiche les likes et le prix.
    self.view.showFilters(); // J'affiche les filtres.
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
    self.model.findMedia(function (mediaData) {
      // Je filtre les médias qui appartiennent au photographe avec l'ID correspondant.
      const photographerMedia = mediaData.filter(
        (media) => media.photographerId === self.photographerId
      );

      // Je génère une carte pour chaque média du photographe.
      const galleryCards = photographerMedia.map((media) => {
        // J'ajoute le nom du photographe à l'objet media.
        media.photographerName = photographerName;
        // Je crée une carte de la galerie avec l'ID du média comme attribut de données.
        return self.view.template.buildGalleryCard(media, media.id);
      });

      // J'affiche les cartes de la galerie.
      self.view.showGalleryCards(galleryCards);
    });
  };

  // J'affiche le média suivant
  Controller.prototype.showNextMedia = function () {
    // Vérifiez si le média actuel n'est pas le dernier
    if (this.currentMediaIndex < this.mediaList.length - 1) {
      // Augmentez l'index du média actuel
      this.currentMediaIndex++;
      // Affichez le média suivant
      this.view.updateModalWithMedia(this.mediaList[this.currentMediaIndex]);
    } else {
      console.log("Vous êtes déjà au dernier média.");
    }
  };

  // J'affiche le média précedent.
  Controller.prototype.showPreviousMedia = function () {
    // Vérifiez si le média actuel n'est pas le premier
    if (this.currentMediaIndex > 0) {
      // Diminuez l'index du média actuel
      this.currentMediaIndex--;
      // Affichez le média précédent
      this.view.updateModalWithMedia(this.mediaList[this.currentMediaIndex]);
    } else {
      console.log("Vous êtes déjà au premier média.");
    }
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
      // Récupérer le nom du photographe
      const photographerName = await this.getPhotographerName();

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

      // Trier les médias en fonction de l'option sélectionnée
      const sortedMedia = self.model.sortMedia(photographerMedia, selectedOption);

      console.log("Media data after sorting:", sortedMedia);

      // Reconstruire la galerie avec les médias triés
      self.view.rebuildGallery(sortedMedia);
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

        // J'affiche le média dans la modal.
        self.showMediaInModal(mediaId);

        self.view.bind("nextMedia", function () {
          self.showNextMedia();
        });

        self.view.bind("previousMedia", function () {
          self.showPreviousMedia();
        });
      }
    });
  };

  // J'affiche le média dans une modale.
  Controller.prototype.showMediaInModal = function (mediaId) {
    const self = this;
    self.model.findMediaById(mediaId, function (media) {
      self.view.updateModalWithMedia(media);
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
