function photographerTemplate(data) {
  const { name, portrait, city, country, tagline, price, id } = data;

  const picture = `assets/photographers/${portrait}`;

  function getUserCardDOM() {
    const article = document.createElement("article");
    const div = document.createElement("div");
    const div2 = document.createElement("div");
    const a = document.createElement("a");
    const img = document.createElement("img");
    const h2 = document.createElement("h2");
    const h3 = document.createElement("h3");
    const p = document.createElement("p");
    const p2 = document.createElement("p");

    a.setAttribute("role", "lien");
    a.setAttribute(
      "aria-label",
      `Lien vers la page du photographe ${name}`
    );
    a.setAttribute("href", `photographer.html?id=${id}`);
    a.setAttribute("class", "photographer_card");
    div.setAttribute("class", "photographer_img__container");
    div2.setAttribute("class", "photographer_text__container");
    img.setAttribute("src", picture);
    img.setAttribute("alt", `Portrait de ${name}`);

    h2.textContent = name;
    h3.textContent = `${city}, ${country}`;
    p.textContent = tagline;
    p2.textContent = `${price}€/jour`;

    article.appendChild(a);
    article.appendChild(div);
    article.appendChild(div2);

    div.appendChild(img);
    div2.appendChild(h2);
    div2.appendChild(h3);
    div2.appendChild(p);
    div2.appendChild(p2);

    a.appendChild(div);
    a.appendChild(div2);

    a.setAttribute("aria-label", name);

    return article;
  }

  function getPhotographerPageDOM() {
    return section;
  }

  return {
    name,
    picture,
    city,
    country,
    tagline,
    price,
    id,
    getUserCardDOM,
    getPhotographerPageDOM,
  };
}
