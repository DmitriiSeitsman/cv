// 🌐 scripts.js — переключатель языка и мобильное меню

// === Переключатель языка ===
const langData = {
  ru: {
    title: "Дмитрий Сейцман — iOS Разработчик",
    footer: "© 2025 Дмитрий Сейцман — создано на Swift и кофе ☕",
  },
  en: {
    title: "Dmitrii Seitsman — iOS Developer",
    footer: "© 2025 Dmitrii Seitsman — Crafted with Swift energy and good coffee ☕",
  },
};

// Получаем кнопки
const btnRu = document.getElementById("btn-ru");
const btnEn = document.getElementById("btn-en");

// Читаем язык из localStorage или ставим русский по умолчанию
let currentLang = localStorage.getItem("lang") || "ru";
setLanguage(currentLang);

// Обработчики кликов
btnRu?.addEventListener("click", () => setLanguage("ru"));
btnEn?.addEventListener("click", () => setLanguage("en"));

function setLanguage(lang) {
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;
  document.title = langData[lang].title;

  // Меняем активность кнопок
  if (btnRu && btnEn) {
    btnRu.classList.toggle("active", lang === "ru");
    btnEn.classList.toggle("active", lang === "en");
  }

  // Меняем текст футера, если он есть
  const footer = document.querySelector("footer");
  if (footer) footer.textContent = langData[lang].footer;
}

// === Мобильное меню ===
(function () {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (!toggle || !nav) return;

  const closeMenu = () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Закрываем меню при клике на ссылку
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeMenu();
  });

  // Автоматически закрываем меню при переходе на десктоп
  const mq = window.matchMedia("(min-width: 769px)");
  mq.addEventListener?.("change", (e) => {
    if (e.matches) closeMenu();
  });
})();