// 🌐 scripts.js — общий header, переключатель языка и мобильное меню

// ======= Переводы базовых элементов =======
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

let currentLang = localStorage.getItem("lang") || "ru";

// ======= Вспомогательные функции =======
function setActiveNav() {
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach((a) => {
    const href = a.getAttribute("href");
    a.classList.toggle("active", href === here);
  });
}

// === Переключение языка ===
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;

  // Обновляем title + footer
  document.title = langData[lang].title;
  const footer = document.querySelector("footer");
  if (footer) footer.textContent = langData[lang].footer;

  // Активные кнопки
  const btnRu = document.getElementById("btn-ru");
  const btnEn = document.getElementById("btn-en");
  if (btnRu && btnEn) {
    btnRu.classList.toggle("active", lang === "ru");
    btnEn.classList.toggle("active", lang === "en");
  }

  // Перевод пунктов меню по data-атрибутам
  document.querySelectorAll(".main-nav a").forEach((link) => {
    const text = link.getAttribute(`data-${lang}`);
    if (text) link.textContent = text;
  });

  // Оповестим страницы, чтобы они обновили локальный текст
  document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
}

// === Обработка кнопок RU / EN ===
function wireLangButtons() {
  const btnRu = document.getElementById("btn-ru");
  const btnEn = document.getElementById("btn-en");
  btnRu?.addEventListener("click", () => setLanguage("ru"));
  btnEn?.addEventListener("click", () => setLanguage("en"));
}

// === Мобильное меню с оверлеем, выезжающее снизу ===
function initMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const overlay = document.getElementById("nav-overlay");
  if (!toggle || !nav || !overlay) return;

  const openMenu = () => {
    nav.classList.add("open");
    overlay.classList.add("active");
    document.body.classList.add("menu-open");
    toggle.setAttribute("aria-expanded", "true");
  };

  const closeMenu = () => {
    nav.classList.remove("open");
    overlay.classList.remove("active");
    document.body.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.contains("open");
    isOpen ? closeMenu() : openMenu();
  });

  overlay.addEventListener("click", closeMenu);
  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeMenu();
  });

  // Сброс при переходе на десктоп (кроссбраузерно)
  const mq = window.matchMedia("(min-width: 769px)");
  if (mq.addEventListener) {
    mq.addEventListener("change", (e) => e.matches && closeMenu());
  } else if (mq.addListener) {
    mq.addListener((e) => e.matches && closeMenu());
  }
}

// === Подключение общего header.html ===
async function ensureHeaderLoaded() {
  if (document.querySelector("header.site-header")) return; // уже есть

  const host = document.createElement("div");
  document.body.insertBefore(host, document.body.firstChild);

  try {
    const res = await fetch("header.html", { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch header.html");
    host.innerHTML = await res.text();
  } catch (err) {
    console.error("Header load error:", err);
  }
}

// ======= Bootstrap =======
document.addEventListener("DOMContentLoaded", async () => {
  await ensureHeaderLoaded(); // загрузим общий header
  wireLangButtons();          // повесим обработчики
  initMobileMenu();           // инициализируем бургер
  setActiveNav();             // подсветка текущего раздела
  setLanguage(currentLang);   // применим язык
});