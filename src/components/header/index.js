import "./styles.scss";

const closeButton = document.querySelector(".header__close-button");
const hamburgerButton = document.querySelector(".header-hamburger-button");
const header = document.querySelector(".header");

hamburgerButton.addEventListener("click", () =>
  header.classList.remove("header--collapsed")
);
closeButton.addEventListener("click", () =>
  header.classList.add("header--collapsed")
);
