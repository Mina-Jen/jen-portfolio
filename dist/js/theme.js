const KEY = "jm-theme";
const root = document.documentElement;
const meta = document.getElementById("meta-theme");
const media = matchMedia("(prefers-color-scheme: dark)");

const stored = () => {
  try { return localStorage.getItem(KEY); } catch { return null; }
};
const system = () => (media.matches ? "dark" : "light");

export function initTheme() {
  const button = document.getElementById("theme-toggle");

  const apply = (theme, persist) => {
    root.dataset.theme = theme;
    if (persist) {
      try { localStorage.setItem(KEY, theme); } catch { /* private mode */ }
    }
    if (meta) meta.setAttribute("content", theme === "dark" ? "#09090B" : "#F1F1F3");
    if (button) {
      button.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    }
    window.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));
  };

  apply(root.dataset.theme === "light" ? "light" : "dark", false);

  button?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    apply(next, true);
  });

  const onSystem = () => { if (!stored()) apply(system(), false); };
  if (media.addEventListener) media.addEventListener("change", onSystem);
  else if (media.addListener) media.addListener(onSystem);
}
