function photographerTemplate(data) {
  const { name, portrait } = data;

  const picture = `assets/photographers/${portrait}`;

  function getUserCardDOM() {
    const article = document.createElement("article");
    const div = document.createElement("div");
    const a = document.createElement("a");
    const img = document.createElement("img");
    const h2 = document.createElement("h2");

    a.setAttribute("href", "photographer.html");
    a.setAttribute("class", "photographer_card");
    div.setAttribute("class", "photographer_img__container");
    img.setAttribute("src", picture);

    h2.textContent = name;

    article.appendChild(a);
    article.appendChild(div);
    div.appendChild(img);
    a.appendChild(div);
    a.appendChild(h2);

    return article;
  }
  return { name, picture, getUserCardDOM };
}
