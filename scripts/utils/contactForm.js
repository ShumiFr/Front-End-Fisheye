function displayModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "block";

  // Rendre tous les éléments interactifs en dehors de la modale inaccessibles à la navigation par tabulation
  var interactiveElements = document.querySelectorAll(
    'button, [href], input, select, textarea, video, img, [tabindex]:not([tabindex="-1"])'
  );
  var modalElements = document.querySelectorAll(
    '#contact_modal button, #contact_modal img, #contact_modal [href], #contact_modal input, #contact_modal select, #contact_modal textarea, #contact_modal [tabindex]:not([tabindex="-1"])'
  );

  interactiveElements.forEach(function (element) {
    element.setAttribute("data-previous-tabindex", element.tabIndex);
    element.tabIndex = -1;
  });

  modalElements.forEach(function (element) {
    element.tabIndex = element.getAttribute("data-previous-tabindex") || 0;
  });
}

function closeModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "none";

  // Réinitialiser tabindex pour tous les éléments
  var allElements = document.querySelectorAll("[data-previous-tabindex]");
  allElements.forEach(function (element) {
    element.tabIndex = element.getAttribute("data-previous-tabindex");
    element.removeAttribute("data-previous-tabindex");
  });

  setTimeout(() => {
    document.querySelector(".contact_button").focus();
  }, 0);
}

function submitContact() {
  const form = document.querySelector(".contact_form");
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  if (firstName && lastName && email && message) {
    console.log(
      `Je confirme avoir reçu les informations suivantes : Nom : ${lastName}, Prénom : ${firstName}, Email : ${email}, Message : "${message}"`
    );

    closeModal();
    alert("Votre message a bien été envoyé !");
    form.reset();
  } else {
    alert("Veuillez remplir tous les champs du formulaire.");
  }
}

const closeModalButton = document.getElementById("close-modal");

closeModalButton.addEventListener("click", closeModal);
closeModalButton.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    closeModal();
  }
});
