// 🌐 scripts.js — общий header, переключатель языка и мобильное меню

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

// ————— helpers —————
function setActiveNav() {
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".main-nav a").forEach((a) => {
    const href = a.getAttribute("href");
    a.classList.toggle("active", href === here);
  });
}

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;

  // title + footer
  document.title = langData[lang].title;
  const footer = document.querySelector("footer");
  if (footer) footer.textContent = langData[lang].footer;

  // активные языковые кнопки
  const btnRu = document.getElementById("btn-ru");
  const btnEn = document.getElementById("btn-en");
  if (btnRu && btnEn) {
    btnRu.classList.toggle("active", lang === "ru");
    btnEn.classList.toggle("active", lang === "en");
  }

  // перевод пунктов меню по data-атрибутам
  document.querySelectorAll(".main-nav a").forEach((link) => {
    const text = link.getAttribute(`data-${lang}`);
    if (text) link.textContent = text;
  });

  // оповестим страницы, чтобы они обновили свой локальный текст
  document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
}

function initMobileMenu() {
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

  // Закрыть по клику на ссылку
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

function wireLangButtons() {
  const btnRu = document.getElementById("btn-ru");
  const btnEn = document.getElementById("btn-en");
  btnRu?.addEventListener("click", () => setLanguage("ru"));
  btnEn?.addEventListener("click", () => setLanguage("en"));
}

async function ensureHeaderLoaded() {
  // если header уже есть — ничего не грузим
  if (document.querySelector("header.site-header")) return;

  // создаём контейнер в самом верху <body>
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

// ————— bootstrap —————
document.addEventListener("DOMContentLoaded", async () => {
  await ensureHeaderLoaded();  // загрузим общий header, если его нет
  wireLangButtons();           // обработчики RU/EN
  initMobileMenu();            // бургер
  setActiveNav();              // подсветка текущей страницы
  setLanguage(currentLang);    // применим язык (title, footer, меню) и дернём langchange
});