// Récupérer l'ID du photographe à partir de l'URL
const urlParams = new URLSearchParams(window.location.search);
const photographerId = urlParams.get("id");

// Fonction pour obtenir les données du photographe
async function getPhotographerData(id) {
  const response = await fetch("../data/photographers.json");
  const data = await response.json();
  const photographer = data.photographers.find((photographer) => photographer.id == id);
  const media = data.media.filter((medium) => medium.photographerId == id);
  return { photographer, media };
}

// Fonction pour afficher les données du photographe
function displayHeader(photographer) {
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

function displayGalleryAndSort({ photographer, media }) {
  const main = document.getElementById("main");
  const modal = document.getElementById("modal");

  // Créer le div pour le tri
  const sortDiv = document.createElement("div");
  const photoSort = document.createElement("div");
  photoSort.setAttribute("class", "photo-sort");

  const sortTitle = document.createElement("p");
  sortTitle.setAttribute("class", "photo-sort__title");
  sortTitle.textContent = "Trier par";

  const customSelect = document.createElement("div");
  customSelect.setAttribute("class", "custom-select");

  const select = document.createElement("select");
  const option1 = document.createElement("option");
  option1.setAttribute("value", "0");
  option1.textContent = "Popularité";
  const option2 = document.createElement("option");
  option2.setAttribute("value", "1");
  option2.textContent = "Date";
  const option3 = document.createElement("option");
  option3.setAttribute("value", "2");
  option3.textContent = "Titre";

  select.appendChild(option1);
  select.appendChild(option2);
  select.appendChild(option3);
  customSelect.appendChild(select);
  photoSort.appendChild(sortTitle);
  photoSort.appendChild(customSelect);
  sortDiv.appendChild(photoSort);

  // Créer le div pour la galerie
  const galleryDiv = document.createElement("div");
  galleryDiv.setAttribute("class", "gallery");

  for (const medium of media) {
    const card = document.createElement("div");
    card.setAttribute("class", "card");

    let mediaElement;
    if (medium.image) {
      mediaElement = document.createElement("img");
      mediaElement.setAttribute("src", `/assets/images/${photographer.name}/${medium.image}`);
    } else if (medium.video) {
      mediaElement = document.createElement("video");
      mediaElement.setAttribute("src", `/assets/images/${photographer.name}/${medium.video}`);
      mediaElement.addEventListener("mouseover", function () {
        this.play();
      });
      mediaElement.addEventListener("mouseout", function () {
        this.pause();
      });
    }
    mediaElement.setAttribute("alt", medium.title);

    const title = document.createElement("h3");
    title.textContent = medium.title;

    const likes = document.createElement("p");
    likes.innerHTML = `${medium.likes} <i class='fa-solid fa-heart'></i>`;

    card.appendChild(mediaElement);
    card.appendChild(title);
    card.appendChild(likes);
    galleryDiv.appendChild(card);
  }

  // Créer le div pour les likes et le prix
  const likePriceDiv = document.createElement("div");
  likePriceDiv.setAttribute("class", "like-price");

  const totalLikes = document.createElement("p");
  totalLikes.innerHTML = "297 081 <i class='fa-solid fa-heart'></i>";

  const price = document.createElement("p");
  price.textContent = "300€ / jour";

  likePriceDiv.appendChild(totalLikes);
  likePriceDiv.appendChild(price);

  // Ajouter tous les divs à la page
  main.appendChild(sortDiv);
  main.appendChild(galleryDiv);
  main.appendChild(likePriceDiv);
}

function createModal() {}

getPhotographerData(photographerId).then((data) => {
  displayHeader(data.photographer);
  displayGalleryAndSort(data);
});
