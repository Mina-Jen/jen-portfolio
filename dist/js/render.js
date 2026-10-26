const $ = (id) => document.getElementById(id);
const el = (tag, cls, html) => { const n = document.createElement(tag); if (cls) n.className = cls; if (html !== undefined) n.innerHTML = html; return n; };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
const external = (href) => /^https?:/i.test(href) ? ' target="_blank" rel="noopener noreferrer"' : "";

const arrow = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 13 L13 3"/><path d="M6 3 H13 V10"/></svg>`;

export function renderAll({ profile, experience, projects }) {
  $("about-text").append(...profile.about.map((t) => el("p", "", esc(t))));

  profile.skills.forEach((s, i) => {
    $("skills-do").append(el("article", "capability",
      `<p class="capability__no">${String(i + 1).padStart(2, "0")}</p>
       <h3 class="capability__title">${esc(s.title)}</h3>
       <ul class="capability__items">${s.items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`
    ));
  });

  profile.education.forEach((e) => {
    $("edu-list").append(el("li", "edu__item",
      `<p class="edu__school">${esc(e.school)}</p><p class="edu__program">${esc(e.program)}</p><span class="edu__years">${esc(e.years)}</span>`
    ));
  });

  profile.certifications.forEach((c) => {
    $("certs-list").append(el("li", "cert__item",
      `<span class="cert__name">${esc(c.title)}</span><span class="cert__year">${esc(c.year)}</span>`
    ));
  });

  experience.forEach((e) => {
    $("experience-list").append(el("li", "timeline__item",
      `<span class="timeline__dot" aria-hidden="true"></span>
       <div class="timeline__head"><h3>${esc(e.role)}</h3><p class="timeline__date">${esc(e.dates)}</p></div>
       <p class="timeline__org">${esc(e.org)}</p>
       <ul class="timeline__points">${e.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>`
    ));
  });

  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  featured.forEach((p) => {
    const stats = p.stats
      ? `<p class="featured__stats">${p.stats.map((s) => `<span><strong>${esc(s.value)}</strong><em>${esc(s.label)}</em></span>`).join("")}</p>`
      : "";
    const view = p.link
      ? `<a class="btn btn--ink" href="${esc(p.link)}"${external(p.link)}>View on GitHub ${arrow.replace("<svg ", '<svg class="btn__arrow" ')}</a>`
      : "";
    const media = p.image
      ? `<div class="browser">
           <div class="browser__bar" aria-hidden="true"><span class="browser__dot"></span><span class="browser__dot"></span><span class="browser__dot"></span><p class="browser__url">${esc(p.browserUrl || p.title)}</p></div>
           <img src="${esc(p.image)}" alt="${esc(p.imageAlt || p.title)}"${p.imageWidth ? ` width="${p.imageWidth}" height="${p.imageHeight}"` : ""} loading="lazy" decoding="async">
         </div>`
      : "";
    $("featured-project").append(el("article", "featured__card",
      `<div class="featured__media">${media}</div>
       <div class="featured__body">
         <p class="label"><span class="label__no">01</span>Featured project</p>
         <h3>${esc(p.title)}</h3>
         <p class="featured__sum">${esc(p.summary)}</p>
         <ul class="chips">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
         ${stats}
         <div class="featured__actions">
           ${view}
           <a class="btn btn--ghost" href="#contact">Talk about it</a>
         </div>
       </div>`
    ));
  });

  rest.forEach((p, i) => {
    const action = p.link
      ? `<a class="project-card__arrow" href="${esc(p.link)}"${external(p.link)} aria-label="Open ${esc(p.title)}">${arrow}</a>`
      : "";
    $("projects-list").append(el("li", "project-card",
      `<div class="project-card__top"><span class="project-card__no">${String(i + featured.length + 1).padStart(2, "0")}</span>${action}</div>
       <h3 class="project__title">${esc(p.title)}</h3>
       <p class="project__sum">${esc(p.summary)}</p>
       <p class="project__tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join("")}</p>`
    ));
  });

  profile.contact.forEach((c) => {
    const a = el("a", "link", esc(c.label));
    a.href = c.href;
    if (/^https?:/i.test(c.href)) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
    $("contact-links").append(a);
  });
}
