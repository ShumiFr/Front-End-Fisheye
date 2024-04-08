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
  const header = document.getElementById("modal_header");

  const photographerHeader = document.createElement("div");
  const description = document.createElement("div");
  const name = document.createElement("h1");
  const city = document.createElement("p");
  const tagline = document.createElement("p");
  const contactButton = document.createElement("button");
  const imgDiv = document.createElement("div");
  const img = document.createElement("img");
  const photographerName = document.createElement("h2");

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
  photographerName.setAttribute("class", "photographer-name");
  photographerName.setAttribute("alt", photographer.name);

  name.textContent = photographer.name;
  city.textContent = photographer.city;
  tagline.textContent = photographer.tagline;
  contactButton.textContent = "Contactez-moi";
  photographerName.textContent = photographer.name;

  description.appendChild(name);
  description.appendChild(city);
  description.appendChild(tagline);

  imgDiv.appendChild(img);

  photographerHeader.appendChild(description);
  photographerHeader.appendChild(contactButton);
  photographerHeader.appendChild(imgDiv);

  header.appendChild(photographerName);

  main.appendChild(photographerHeader);
}

function displayGalleryAndSort({ photographer, media }) {
  const main = document.getElementById("main");

  const sortDiv = document.createElement("div");
  const photoSort = document.createElement("div");
  const sortTitle = document.createElement("p");
  const customSelect = document.createElement("div");
  const select = document.createElement("select");
  const option1 = document.createElement("option");
  const option2 = document.createElement("option");
  const option3 = document.createElement("option");
  const galleryDiv = document.createElement("div");

  photoSort.setAttribute("class", "photo-sort");
  sortTitle.setAttribute("class", "photo-sort__title");
  customSelect.setAttribute("class", "custom-select");
  option1.setAttribute("value", "0");
  option2.setAttribute("value", "1");
  option3.setAttribute("value", "2");
  galleryDiv.setAttribute("class", "gallery");

  sortTitle.textContent = "Trier par";
  option1.textContent = "Popularité";
  option2.textContent = "Date";
  option3.textContent = "Titre";

  select.appendChild(option1);
  select.appendChild(option2);
  select.appendChild(option3);
  customSelect.appendChild(select);
  photoSort.appendChild(sortTitle);
  photoSort.appendChild(customSelect);
  sortDiv.appendChild(photoSort);

  // --------------- Boucle media --------------- //

  for (const medium of media) {
    const card = document.createElement("div");
    card.setAttribute("class", "card");

    let mediaElement;

    if (medium.image) {
      mediaElement = document.createElement("img");
      mediaElement.setAttribute("src", `/assets/images/${photographer.name}/${medium.image}`);
    } else if (medium.video) {
      const videoContainer = document.createElement("div");

      videoContainer.setAttribute("class", "video-container");

      mediaElement = document.createElement("video");
      mediaElement.setAttribute("src", `/assets/images/${photographer.name}/${medium.video}`);

      videoContainer.appendChild(mediaElement);

      mediaElement.addEventListener("mouseover", function () {
        this.play();
      });
      mediaElement.addEventListener("mouseout", function () {
        this.pause();
      });

      card.appendChild(videoContainer);
    }

    mediaElement.setAttribute("alt", medium.title);

    // --------------- Modal --------------- //

    const dialog = document.getElementById("picture_modal");
    const dialogImg = document.getElementById("picture_modal_img");
    const dialogVideo = document.getElementById("picture_modal_video");
    const dialogTitle = document.getElementById("picture_modal_title");
    const closeButton = document.querySelector(".picture_close");
    const leftArrow = document.getElementById("left_arrow");
    const rightArrow = document.getElementById("right_arrow");

    let currentImageIndex = 0;

    mediaElement.addEventListener("click", function () {
      dialogImg.setAttribute("src", this.src);
      dialog.style.display = "flex";

      dialogTitle.textContent = medium.title;
      dialog.open = true;
    });

    closeButton.addEventListener("click", function () {
      dialog.style.display = "none";
    });

    leftArrow.addEventListener("click", function () {
      currentImageIndex = (currentImageIndex - 1 + media.length) % media.length;
      const currentMedia = media[currentImageIndex];
      if (currentMedia.image) {
        dialogImg.src = `/assets/images/${photographer.name}/${currentMedia.image}`;
        dialogImg.style.display = "block";
        dialogVideo.style.display = "none";
      } else if (currentMedia.video) {
        dialogVideo.src = `/assets/images/${photographer.name}/${currentMedia.video}`;
        dialogVideo.style.display = "block";
        dialogImg.style.display = "none";
      }
      dialogTitle.textContent = currentMedia.title;
    });

    rightArrow.addEventListener("click", function () {
      currentImageIndex = (currentImageIndex + 1) % media.length;
      const currentMedia = media[currentImageIndex];
      if (currentMedia.image) {
        dialogImg.src = `/assets/images/${photographer.name}/${currentMedia.image}`;
        dialogImg.style.display = "block";
        dialogVideo.style.display = "none";
      } else if (currentMedia.video) {
        dialogVideo.src = `/assets/images/${photographer.name}/${currentMedia.video}`;
        dialogVideo.style.display = "block";
        dialogImg.style.display = "none";
      }
      dialogTitle.textContent = currentMedia.title;
    });

    // --------------- Likes --------------- //

    const title = document.createElement("h3");
    const likes = document.createElement("p");

    title.textContent = medium.title;
    likes.innerHTML = `${medium.likes} <i class='fa-solid fa-heart'></i>`;

    card.appendChild(mediaElement);
    card.appendChild(title);
    card.appendChild(likes);
    galleryDiv.appendChild(card);
  }

  // ------------ Likes and Prices --------------- //

  const likePriceDiv = document.createElement("div");
  const totalLikes = document.createElement("p");
  const price = document.createElement("p");

  likePriceDiv.setAttribute("class", "like-price");

  totalLikes.innerHTML = "297 081 <i class='fa-solid fa-heart'></i>";

  price.textContent = "300€ / jour";

  likePriceDiv.appendChild(totalLikes);
  likePriceDiv.appendChild(price);

  main.appendChild(sortDiv);
  main.appendChild(galleryDiv);
  main.appendChild(likePriceDiv);
}

// Charger les données du photographe et afficher la page
getPhotographerData(photographerId).then((data) => {
  displayHeader(data.photographer);
  displayGalleryAndSort(data);
});
