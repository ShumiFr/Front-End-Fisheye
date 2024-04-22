(function (window) {
  "use strict";

  // Je déclare mes variables privées.
  let Memory = {}; // Mémoire pour stocker les données
  let ID = 1; // ID pour les nouveaux éléments

  // Je définis le constructeur de la classe Store.
  function Store(name) {
    this._dbName = name; // Je stocke le nom de la base de données.

    // Je vérifie si les données sont déjà en mémoire.
    if (!Memory[name]) {
      // Si les données ne sont pas en mémoire, je récupère les données depuis le fichier JSON.
      this._dataPromise = fetch("../../data/photographers.json")
        .then((response) => response.json())
        .then((data) => {
          // Je stocke les données en mémoire avec la propriété `liked` initialisée à `false` pour chaque média qui sert pour les likes.
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
      // Si les données sont déjà en mémoire, j'utilise la promesse résolue.
      this._dataPromise = Promise.resolve(Memory[name]);
    }
  }

  // Méthode pour compter le nombre d'éléments.
  Store.prototype.count = function (callback) {
    // Je compte le nombre de photographes.
    const photographeCount = Object.keys(Memory[this._dbName].photographers).length;
    // J'appelle la fonction de rappel avec le nombre de photographes.
    callback.call(photographeCount);
  };

  // Méthode pour récupérer tous les photographes.
  Store.prototype.findPhotographers = function (callback) {
    callback = callback || function () {}; // Fonction de rappel par défaut.

    // J'attends que les données soient chargées avant d'appeler la fonction de rappel.
    this._dataPromise.then(() => {
      const entities = Memory[this._dbName].photographers; // Je récupère les photographes depuis la mémoire.
      // J'appelle la fonction de rappel avec un tableau contenant tous les photographes.
      callback.call(
        this,
        Object.keys(entities).map((key) => entities[key])
      );
    });
  };

  // Méthode pour récupérer tous les médias.
  Store.prototype.findMedia = function (callback) {
    callback = callback || function () {}; // Fonction de rappel par défaut.

    // J'attends que les données soient chargées avant d'appeler la fonction de rappel.
    this._dataPromise.then(() => {
      const entities = Memory[this._dbName].media; // Je récupère les médias depuis la mémoire.

      // J'appelle la fonction de rappel avec un tableau contenant tous les médias.
      callback.call(
        this,
        Object.keys(entities).map((key) => entities[key])
      );
    });
  };

  // Méthode pour récupérer un média par son ID.
  Store.prototype.findMediaById = function (id, callback) {
    callback = callback || function () {}; // Fonction de rappel par défaut.

    // Je récupère le tableau de médias.
    const media = Memory[this._dbName].media;

    // Je recherche l'objet avec l'ID spécifié dans le tableau de médias.
    const foundMedia = media.find((mediaItem) => mediaItem.id === id);

    // J'appelle la fonction de rappel avec l'objet trouvé.
    callback.call(this, foundMedia);
  };

  // Méthode pour sauvegarder un élément.
  Store.prototype.save = function (id, params, callback) {
    if (id) {
      // Si l'ID est fourni, je mets à jour l'élément existant.
      const item = { ...Memory[this._dbName][id], ...params }; // Je fusionne les données existantes avec les nouvelles données.
      Memory[this._dbName].photographers[item.id] = item; // Je mets à jour les données en mémoire.
      // J'appelle la fonction de rappel avec l'élément mis à jour.
      callback(item);
      return;
    }

    // Si l'ID n'est pas fourni, j'ajoute un nouvel élément avec un nouvel ID.
    Memory[this._dbName].photographers[ID++] = params;
    // J'appelle la fonction de rappel avec le nouvel élément.
    callback(params);
  };

  // J'expose la classe Store en tant que propriété de l'objet global "app".
  window.app = window.app || {};
  window.app.Store = Store;
})(window);
