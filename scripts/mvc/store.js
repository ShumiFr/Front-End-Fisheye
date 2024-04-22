(function (window) {
  "use strict";

  // Déclaration des variables privées
  let Memory = {}; // Mémoire pour stocker les données
  let ID = 1; // ID pour les nouveaux éléments

  // Constructeur de la classe Store
  function Store(name) {
    this._dbName = name; // Nom de la base de données

    // Vérifie si les données sont déjà en mémoire
    if (!Memory[name]) {
      // Si les données ne sont pas en mémoire, les récupère depuis le fichier JSON
      this._dataPromise = fetch("../../data/photographers.json")
        .then((response) => response.json())
        .then((data) => {
          // Stockons les données en mémoire avec la propriété `liked` initialisée à `false` pour chaque média
          Memory[name] = {
            photographers: data.photographers,
            media: data.media.map((mediaItem) => ({ ...mediaItem, liked: false })),
          };
          console.log("Data loaded from JSON file:", Memory[name]);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      // Si les données sont déjà en mémoire, utilise la promesse résolue
      this._dataPromise = Promise.resolve(Memory[name]);
    }
  }

  // Méthode pour compter le nombre d'éléments
  Store.prototype.count = function (callback) {
    const photographeCount = Object.keys(Memory[this._dbName].photographers).length; // Compte le nombre de photographes
    callback.call(photographeCount); // Appelle la fonction de rappel avec le nombre de photographes
  };

  // Méthode pour récupérer tous les éléments
  Store.prototype.findPhotographers = function (callback) {
    callback = callback || function () {}; // Fonction de rappel par défaut

    // Attend que les données soient chargées avant d'appeler la fonction de rappel
    this._dataPromise.then(() => {
      const entities = Memory[this._dbName].photographers; // Récupère les photographes depuis la mémoire
      // Appelle la fonction de rappel avec un tableau contenant tous les photographes
      callback.call(
        this,
        Object.keys(entities).map((key) => entities[key])
      );
    });
  };

  // Méthode pour récupérer tous les médias
  Store.prototype.findMedia = function (callback) {
    callback = callback || function () {}; // Fonction de rappel par défaut

    // Attend que les données soient chargées avant d'appeler la fonction de rappel
    this._dataPromise.then(() => {
      const entities = Memory[this._dbName].media; // Récupère les médias depuis la mémoire

      // Appelle la fonction de rappel avec un tableau contenant tous les médias
      callback.call(
        this,
        Object.keys(entities).map((key) => entities[key])
      );
    });
  };

  Store.prototype.findMediaById = function (id, callback) {
    callback = callback || function () {}; // Fonction de rappel par défaut

    // Récupère le tableau de médias
    const media = Memory[this._dbName].media;
    console.log("media", media);

    // Recherche l'objet avec l'ID spécifié dans le tableau de médias
    const foundMedia = media.find((mediaItem) => mediaItem.id === id);
    console.log("foundMedia", foundMedia);

    // Appelle la fonction de rappel avec l'objet trouvé
    callback.call(this, foundMedia);
  };

  // Méthode pour sauvegarder un élément
  Store.prototype.save = function (id, params, callback) {
    if (id) {
      // Si l'ID est fourni, met à jour l'élément existant
      const item = { ...Memory[this._dbName][id], ...params }; // Fusionne les données existantes avec les nouvelles données
      Memory[this._dbName].photographers[item.id] = item; // Met à jour les données en mémoire
      callback(item); // Appelle la fonction de rappel avec l'élément mis à jour
      return;
    }

    // Si l'ID n'est pas fourni, ajoute un nouvel élément avec un nouvel ID
    Memory[this._dbName].photographers[ID++] = params;
    callback(params); // Appelle la fonction de rappel avec le nouvel élément
  };

  // Expose la classe Store en tant que propriété de l'objet global "app"
  window.app = window.app || {};
  window.app.Store = Store;
})(window);
