(() => {
  const data = window.caseStudyData;
  if (!data) return;

  const ui = {
    ru: {
      back: "Все проекты",
      overviewIndex: "01 / Контекст",
      overviewTitle: "О проекте",
      galleryIndex: "02 / Интерфейс",
      galleryTitle: "Галерея",
      galleryIntro: "Ключевые экраны и пользовательские сценарии приложения.",
      roleLabel: "Роль",
      platformLabel: "Платформа",
      foundationLabel: "Основа",
      nextLabel: "Следующий проект",
      openScreenshot: "Открыть скриншот",
      closeScreenshot: "Закрыть просмотр скриншота"
    },
    en: {
      back: "All projects",
      overviewIndex: "01 / Context",
      overviewTitle: "About the project",
      galleryIndex: "02 / Interface",
      galleryTitle: "Gallery",
      galleryIntro: "Key screens and user flows from the application.",
      roleLabel: "Role",
      platformLabel: "Platform",
      foundationLabel: "Foundation",
      nextLabel: "Next project",
      openScreenshot: "Open screenshot",
      closeScreenshot: "Close screenshot preview"
    }
  };

  const normalizeLanguage = (value) => value === "en" ? "en" : "ru";
  const elements = {};

  document.querySelectorAll("[data-case-copy]").forEach((element) => {
    elements[element.dataset.caseCopy] = element;
  });

  function setText(key, value) {
    if (elements[key] && value) elements[key].textContent = value;
  }

  function applyLanguage(language) {
    const lang = normalizeLanguage(language);
    const copy = data[lang];
    const labels = ui[lang];

    document.documentElement.lang = lang;
    document.title = copy.pageTitle;

    Object.entries(labels).forEach(([key, value]) => setText(key, value));
    Object.entries(copy).forEach(([key, value]) => {
      if (typeof value === "string") setText(key, value);
    });

    document.querySelectorAll(".case-shot").forEach((button, index) => {
      button.setAttribute("aria-label", `${labels.openScreenshot} ${index + 1}`);
    });

    document.querySelectorAll("[data-ru-src][data-en-src]").forEach((image) => {
      const nextSource = image.dataset[`${lang}Src`];
      if (nextSource) image.src = nextSource;
    });

    if (lightboxClose) lightboxClose.setAttribute("aria-label", labels.closeScreenshot);
  }

  const lightbox = document.createElement("div");
  lightbox.className = "case-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-hidden", "true");

  const lightboxImage = document.createElement("img");
  const lightboxClose = document.createElement("button");
  lightboxClose.className = "case-lightbox-close";
  lightboxClose.type = "button";
  lightboxClose.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  lightbox.append(lightboxImage, lightboxClose);
  document.body.appendChild(lightbox);

  let trigger = null;

  function openLightbox(button) {
    const image = button.querySelector("img");
    if (!image) return;

    trigger = button;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox.classList.contains("active")) return;
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lightboxImage.removeAttribute("src");
    trigger?.focus();
  }

  document.querySelectorAll(".case-shot").forEach((button) => {
    button.addEventListener("click", () => openLightbox(button));
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLightbox();
  });

  applyLanguage(localStorage.getItem("lang"));
  document.addEventListener("langchange", (event) => applyLanguage(event.detail?.lang));
})();
