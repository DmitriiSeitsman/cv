
// 🌐 scripts.js — общий переключатель языка для всего сайта

const langData = {
  ru: {
    title: "Дмитрий Сейцман — iOS Разработчик",
    footer: "© 2025 Дмитрий Сейцман — создано на Swift и кофе ☕",
  },
  en: {
    title: "Dmitrii Seitsman — iOS Developer",
    footer: "© 2025 Dmitrii Seitsman — Crafted with Swift energy and good coffee ☕",
  }
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
