const $ = (id) => document.getElementById(id);
const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html !== undefined) n.innerHTML = html; return n; };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));

export function renderAll({ profile, experience, projects }) {
  $("about-text").append(...profile.about.map((t) => el("p", "", esc(t))));
  profile.skills.forEach((s) => {
    const c = el("article", "card", `<h3>${esc(s.title)}</h3>`);
    s.items.forEach((i) => c.append(el("span", "pill", esc(i))));
    $("skills-grid").append(c);
  });
  experience.forEach((e) => {
    const li = el("li", "", `<h3>${esc(e.role)}</h3><p class="timeline__meta">${esc(e.org)}, ${esc(e.dates)}</p>`);
    li.append(el("ul", "", e.points.map((p) => `<li>${esc(p)}</li>`).join("")));
    $("experience-list").append(li);
  });
  projects.forEach((p) => {
    const thumb = p.image ? `<img src="${esc(p.image)}" alt="${esc(p.title)} screenshot" loading="lazy">` : esc(p.title);
    const c = el("article", "card", `<div class="project__thumb">${thumb}</div><h3>${esc(p.title)}</h3><p>${esc(p.summary)}</p>`);
    p.tags.forEach((t) => c.append(el("span", "pill", esc(t))));
    if (p.link) c.append(el("p", "", `<a class="btn btn--ghost" href="${esc(p.link)}">View project</a>`));
    $("projects-grid").append(c);
  });
  profile.certifications.forEach((t) => $("certs-list").append(el("li", "", esc(t))));
  profile.education.forEach((t) => $("edu-list").append(el("li", "", esc(t))));
  profile.contact.forEach((c) => { const a = el("a", c.primary ? "btn" : "btn btn--ghost", esc(c.label)); a.href = c.href; $("contact-links").append(a); });
}
