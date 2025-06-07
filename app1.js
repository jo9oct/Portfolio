
const icon = document.querySelector(".icon");
const list = document.querySelector(".head-link");

icon.onclick = () => {
  icon.classList.toggle("fa-x");
  list.classList.toggle("reverse_head");
};

