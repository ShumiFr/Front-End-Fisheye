function displayModal() {
  const modal = document.getElementById("contact_modal");
  modal.style.display = "block";

  // Rendre tous les éléments interactifs en dehors de la modale inaccessibles à la navigation par tabulation
  var interactiveElements = document.querySelectorAll(
    'button, [href], input, select, textarea, video, img, [tabindex]:not([tabindex="-1"])'
  );
  interactiveElements.forEach(function (element) {
    element.setAttribute("data-previous-tabindex", element.tabIndex);
    element.tabIndex = -1;
  });

  // Rendre tous les éléments interactifs dans la modale accessibles à la navigation par tabulation
  var modalElements = document.querySelectorAll(
    '#contact_modal button, #contact_modal img, #contact_modal [href], #contact_modal input, #contact_modal select, #contact_modal textarea, #contact_modal [tabindex]:not([tabindex="-1"])'
  );
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
}
