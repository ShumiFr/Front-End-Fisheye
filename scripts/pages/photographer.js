// Récupérer l'ID du photographe à partir de l'URL
const urlParams = new URLSearchParams(window.location.search);
const photographerId = urlParams.get("id");

// Fonction pour obtenir les données du photographe
async function getPhotographerData(id) {
  const response = await fetch("../data/photographers.json");
  const data = await response.json();
  return data.photographers.find((photographer) => photographer.id == id);
}

// Fonction pour afficher les données du photographe
function displayPhotographerData(photographer) {
  const main = document.getElementById("main");

  const photographerHeader = document.createElement("div");
  const description = document.createElement("div");
  const name = document.createElement("h1");
  const city = document.createElement("p");
  const tagline = document.createElement("p");
  const contactButton = document.createElement("button");
  const imgDiv = document.createElement("div");
  const img = document.createElement("img");

  photographerHeader.setAttribute("class", "photograph-header");
  description.setAttribute("class", "photographer-header__description");
  name.setAttribute("class", "name");
  city.setAttribute("class", "city");
  tagline.setAttribute("class", "tagline");
  contactButton.setAttribute("class", "contact_button");
  contactButton.setAttribute("onclick", "displayModal()");
  imgDiv.setAttribute("class", "photographer-header__img");
  img.setAttribute("src", `/assets/photographers/${photographer.portrait}`);
  img.setAttribute("alt", photographer.name);

  name.textContent = photographer.name;
  city.textContent = photographer.city;
  tagline.textContent = photographer.tagline;
  contactButton.textContent = "Contactez-moi";

  description.appendChild(name);
  description.appendChild(city);
  description.appendChild(tagline);

  imgDiv.appendChild(img);

  photographerHeader.appendChild(description);
  photographerHeader.appendChild(contactButton);
  photographerHeader.appendChild(imgDiv);

  main.appendChild(photographerHeader);
}

// Obtenir et afficher les données du photographe
getPhotographerData(photographerId).then((photographer) => displayPhotographerData(photographer));
