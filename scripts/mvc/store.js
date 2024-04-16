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
          // Stocke les données en mémoire pour une utilisation ultérieure
          Memory[name] = {
            photographers: data.photographers,
            media: data.media,
          };
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

      // Ajoute un message de débogage pour afficher les données des médias
      console.log("Médias récupérés depuis le store :", entities);

      // Appelle la fonction de rappel avec un tableau contenant tous les médias
      callback.call(
        this,
        Object.keys(entities).map((key) => entities[key])
      );
    });
  };

  // Méthode pour récupérer un élément par son ID
  Store.prototype.findById = function (id, callback) {
    callback = callback || function () {}; // Fonction de rappel par défaut
    callback.call(this, Memory[this._dbName].photographers[id]); // Appelle la fonction de rappel avec le photographe correspondant à l'ID
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
