(function (window) {
  "use strict";

  let Memory = {};
  let ID = 1;

  // Crée un objet Store pour stocker les données
  function Store(name) {
    // Stocke le nom de la base de données
    this._dbName = name;

    // Vérifie si la mémoire est vide et récupère les données si c'est le cas
    if (!Memory[name]) {
      fetch("../../data/photographers.json")
        .then((response) => response.json())
        .then((data) => {
          Memory[name] = {
            photographers: data.photographers,
            photos: data.media,
          };
          console.log("Données récupérées :", data); // Affiche les données récupérées
          console.log("Photographes : ", Memory[name].photographers); // Affiche les photographes
          console.log("Photos : ", Memory[name].photos); // Affiche les photos
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération du JSON :", error);
        });
    }
  }

  // Affiche le contenu de la mémoire dans la console
  Store.prototype.displayMemory = function () {
    console.log("Contenu actuel de la mémoire :", Memory[this._dbName]);
  };

  // Récupère les données de la mémoire et les passe à un callback sous forme de tableau
  Store.prototype.save = function (id, params, callback) {
    // Si un ID est fourni, met à jour l'élément correspondant dans la mémoire
    if (id) {
      const item = { ...Memory[this._dbName][id], ...params };
      Memory[this._dbName].photos[item.id] = item;
      callback(item);
      return;
    }

    // Si aucun ID n'est fourni, crée un nouvel élément dans la mémoire
    Memory[this._dbName].photos[ID++] = params;
    callback(params);
  };

  window.app = window.app || {};
  window.app.Store = Store;
})(window);
