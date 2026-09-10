// 🌐 scripts.js — общий header, переключатель языка и мобильное меню

const langData = {
  ru: {
    title: "Дмитрий Сейцман — iOS Разработчик",
    footer: "© 2025 Дмитрий Сейцман. Сайт создан на чистом HTML, JS и немного нейросетей.",
  },
  en: {
    title: "Dmitrii Seitsman — iOS Developer",
    footer: "© 2025 Dmitrii Seitsman. Built with pure HTML, JS, and a pinch of AI.",
  },
};

let currentLang = localStorage.getItem("lang") || "ru";
const themeStorageKey = "theme";

function getPreferredTheme() {
  const savedTheme = localStorage.getItem(themeStorageKey);
  if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function updateThemeControl(theme) {
  const toggle = document.getElementById("theme-toggle");
  if (!toggle) return;

  const isDark = theme === "dark";
  const language = document.documentElement.lang === "en" ? "en" : "ru";
  const label = language === "en"
    ? (isDark ? "Switch to light theme" : "Switch to dark theme")
    : (isDark ? "Включить светлую тему" : "Включить тёмную тему");

  toggle.setAttribute("aria-label", label);
  toggle.setAttribute("title", label);
  toggle.setAttribute("aria-pressed", String(!isDark));
}

function applyTheme(theme, persist = false) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;

  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) {
    themeColor.setAttribute("content", theme === "light" ? "#F6F7F9" : "#0E0E0F");
  }

  if (persist) localStorage.setItem(themeStorageKey, theme);
  updateThemeControl(theme);
}

function wireThemeButton() {
  const toggle = document.getElementById("theme-toggle");
  toggle?.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme, true);
  });
}

window.matchMedia("(prefers-color-scheme: light)").addEventListener?.("change", (event) => {
  if (!localStorage.getItem(themeStorageKey)) {
    applyTheme(event.matches ? "light" : "dark");
  }
});

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

  // 🔤 имя в заголовке (перевод)
  const nameEl = document.getElementById("name");
  if (nameEl) {
    nameEl.textContent = lang === "ru" ? "Дмитрий Сейцман" : "Dmitrii Seitsman";
  }

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

  updateThemeControl(document.documentElement.dataset.theme || getPreferredTheme());

  // оповестим страницы, чтобы они обновили свой локальный текст
  document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
}

function initMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  const overlay = document.getElementById("nav-overlay");
  if (!toggle || !nav) return;

  const openMenu = () => {
    nav.classList.add("open");
    document.body.classList.add("menu-open");
    overlay?.classList.add("active");
    toggle.setAttribute("aria-expanded", "true");
  };

  const closeMenu = () => {
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
    overlay?.classList.remove("active");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.contains("open");
    isOpen ? closeMenu() : openMenu();
  });

  overlay?.addEventListener("click", closeMenu);

  nav.addEventListener("click", (e) => {
    if (e.target.closest("a")) closeMenu();
  });

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

// ————— безопасная загрузка header —————
async function ensureHeaderLoaded() {
  if (document.querySelector("header.site-header")) return;

  const host = document.createElement("div");
  document.body.insertBefore(host, document.body.firstChild);

  try {
    const res = await fetch("/header.html", { cache: "no-store" });

    // GitHub Pages иногда отдаёт "opaque" (без .ok)
    if (!res.ok && res.type !== "opaque") {
      throw new Error(`Header fetch failed: ${res.status}`);
    }

    const html = await res.text();
    if (!html.trim()) {
      throw new Error("Header file is empty or not loaded");
    }

    host.innerHTML = html;
  } catch (err) {
    console.warn("Header not loaded:", err);
  }
}

// ————— bootstrap —————
document.addEventListener("DOMContentLoaded", async () => {
  applyTheme(document.documentElement.dataset.theme || getPreferredTheme());
  await ensureHeaderLoaded();  // загрузим общий header, если его нет
  wireLangButtons();           // обработчики RU/EN
  wireThemeButton();           // светлая / тёмная тема
  initMobileMenu();            // бургер
  setActiveNav();              // подсветка текущей страницы
  setLanguage(currentLang);    // применим язык (title, footer, имя, меню)
});
