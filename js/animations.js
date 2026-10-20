export function initAnimations() {
  document.querySelectorAll(".hero__art path").forEach((p, i) => {
    p.setAttribute("pathLength", "1");
    p.style.setProperty("--i", i);
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  document.querySelectorAll("[data-animate]").forEach((n) => io.observe(n));
}
