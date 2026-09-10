(() => {
  const storageKey = "theme";
  const savedTheme = localStorage.getItem(storageKey);
  const systemTheme = window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
  const theme = savedTheme === "light" || savedTheme === "dark"
    ? savedTheme
    : systemTheme;

  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;

  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) {
    themeColor.setAttribute("content", theme === "light" ? "#F6F7F9" : "#0B0E13");
  }
})();
