// Récupérer l'ID du photographe à partir de l'URL
const urlParams = new URLSearchParams(window.location.search);
const photographerId = urlParams.get("id");

// Fonction pour obtenir les données du photographe
async function getPhotographerData(id) {
  const response = await fetch("../data/photographers.json");
  const data = await response.json();
  return data.photographers.find(
    (photographer) => photographer.id === id
  );
}

// Fonction pour afficher les données du photographe
function displayPhotographerData(photographer) {}

// Obtenir et afficher les données du photographe
getPhotographerData(photographerId).then((photographer) =>
  displayPhotographerData(photographer)
);
