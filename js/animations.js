const reduceMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = () => matchMedia("(pointer: fine)").matches;
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

function splitHeadings() {
  document.querySelectorAll("[data-split]").forEach((node) => {
    const text = node.textContent.trim().replace(/\s+/g, " ");
    if (!text) return;
    const words = text.split(" ");
    const byChar = node.dataset.split === "chars";
    let charIndex = 0;
    node.setAttribute("aria-label", text);
    node.textContent = "";
    words.forEach((word, i) => {
      const outer = document.createElement("span");
      outer.className = "word";
      outer.setAttribute("aria-hidden", "true");
      const inner = document.createElement("span");
      inner.className = "word__in";
      if (byChar) {
        [...word].forEach((character) => {
          const letter = document.createElement("span");
          letter.className = "char";
          letter.textContent = character;
          letter.style.setProperty("--c", charIndex++);
          inner.append(letter);
        });
      } else {
        inner.textContent = word;
        inner.style.setProperty("--w", i);
      }
      outer.append(inner);
      node.append(outer);
      if (i < words.length - 1) node.append(document.createTextNode(" "));
    });
  });
}

function assignStagger() {
  document.querySelectorAll("[data-stagger]").forEach((box) => {
    [...box.children]
      .filter((child) => !child.hasAttribute("data-static"))
      .forEach((child, i) => child.style.setProperty("--i", i));
  });
}

function initHeroName() {
  const heading = document.querySelector('[data-split="chars"]');
  if (!heading || reduceMotion()) return;
  const hero = heading.closest(".hero");
  const chars = [...heading.querySelectorAll(".char")];
  if (!hero || !chars.length || !matchMedia("(pointer: fine)").matches) return;

  const items = chars.map((el) => ({ el, y: 0, mix: 0 }));
  let centers = [];
  let active = false;
  let ready = false;
  let raf = 0;
  const pointer = { x: 0, y: 0 };

  const parseRgb = (value, fallback) => {
    const m = value.trim().match(/^(\d+)\s+(\d+)\s+(\d+)$/);
    return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : fallback;
  };
  let inkRgb = [244, 244, 245];
  let glowRgb = [165, 180, 252];
  const readTint = () => {
    const cs = getComputedStyle(document.documentElement);
    inkRgb = parseRgb(cs.getPropertyValue("--ink-rgb"), inkRgb);
    glowRgb = parseRgb(cs.getPropertyValue("--glow-rgb"), glowRgb);
  };
  readTint();
  window.addEventListener("themechange", () => {
    readTint();
    items.forEach((item) => { item.el.style.color = ""; });
    start();
  });

  const measure = () => {
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    centers = chars.map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 + scrollX,
        y: rect.top + rect.height / 2 + scrollY
      };
    });
  };

  const tick = () => {
    raf = 0;
    let moving = false;
    items.forEach((item, i) => {
      const center = centers[i];
      let targetY = 0;
      let targetMix = 0;
      if (active && center) {
        const dx = pointer.x - center.x;
        const dy = pointer.y - center.y;
        const reach = 1 - Math.min(Math.hypot(dx, dy) / 190, 1);
        const eased = reach * reach * (3 - 2 * reach);
        targetY = -5.5 * eased;
        targetMix = eased * 0.55;
      }
      item.y += (targetY - item.y) * 0.16;
      item.mix += (targetMix - item.mix) * 0.1;
      if (Math.abs(targetY - item.y) > 0.04 || Math.abs(targetMix - item.mix) > 0.01) moving = true;

      const y = Math.abs(item.y) < 0.02 ? 0 : item.y;
      item.el.style.transform = y ? `translate3d(0,${y.toFixed(2)}px,0)` : "";
      if (item.mix > 0.01) {
        const mix = item.mix;
        const r = Math.round(inkRgb[0] + (glowRgb[0] - inkRgb[0]) * mix);
        const g = Math.round(inkRgb[1] + (glowRgb[1] - inkRgb[1]) * mix);
        const b = Math.round(inkRgb[2] + (glowRgb[2] - inkRgb[2]) * mix);
        item.el.style.color = `rgb(${r} ${g} ${b})`;
      } else if (item.el.style.color) {
        item.el.style.color = "";
      }
    });
    if (!moving && !active) {
      items.forEach((item) => {
        item.el.style.transform = "";
        item.el.style.color = "";
        item.y = 0;
        item.mix = 0;
      });
    }
    if (moving) raf = requestAnimationFrame(tick);
  };

  const start = () => {
    if (ready && !raf) raf = requestAnimationFrame(tick);
  };

  const onMove = (event) => {
    pointer.x = event.clientX + window.scrollX;
    pointer.y = event.clientY + window.scrollY;
    active = true;
    start();
  };

  const onLeave = () => {
    active = false;
    start();
  };

  const onResize = () => {
    measure();
    start();
  };

  const attach = () => {
    if (ready) return;
    ready = true;
    measure();
    hero.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerleave", onLeave);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", () => {
      if (!active) return;
      active = false;
      start();
    }, { passive: true });
  };

  const last = chars[chars.length - 1];
  last.addEventListener("animationend", (event) => {
    if (event.animationName === "char-rise") attach();
  });
  setTimeout(attach, 2500);
  if (document.fonts?.ready) document.fonts.ready.then(() => { if (ready) measure(); });
}

function initHeroField() {
  const hero = document.querySelector(".hero");
  const canvas = document.getElementById("hero-field");
  const wash = document.getElementById("hero-wash");
  if (!hero || !canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const reduced = reduceMotion();
  const finePointer = matchMedia("(pointer: fine)").matches;
  const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
  let width = 1;
  let height = 1;
  let dpr = 1;
  let lines = [];
  let fadeGradient = null;
  let start = 0;
  let raf = 0;
  let lastFrame = 0;
  let inView = true;
  const state = { px: 0, py: 0, sx: 0, sy: 0, gx: 0, gy: 0, gtx: 0, gty: 0, active: false, strength: 0 };
  const palette = { strong: "#75757F", soft: "#3A3A41" };
  const readPalette = () => {
    const cs = getComputedStyle(document.documentElement);
    palette.strong = cs.getPropertyValue("--field-a").trim() || palette.strong;
    palette.soft = cs.getPropertyValue("--field-b").trim() || palette.soft;
  };
  readPalette();
  window.addEventListener("themechange", () => { readPalette(); draw(performance.now()); });

  const buildLines = () => {
    const count = width < 560 ? 11 : width < 960 ? 15 : 19;
    lines = Array.from({ length: count }, (_, i) => {
      const seed = Math.sin(i * 127.1 + 311.7) * 43758.5453;
      const rand = seed - Math.floor(seed);
      const edge = Math.sin(Math.PI * ((i + 0.5) / count));
      return {
        offset: (i + 0.5) / count,
        amp: (5 + rand * 13) * (0.35 + 0.65 * edge),
        freq: 2.2 + rand * 2.4,
        phase: rand * Math.PI * 2,
        speed: 0.07 + rand * 0.05,
        alpha: 0.1 + (i % 4) * 0.016,
        pine: i % 5 !== 2,
        weight: i % 6 === 0 ? 1 : 0.8,
        delay: i * 0.045
      };
    });
  };

  function draw(now) {
    if (!start) start = now;
    const t = reduced ? 6 : (now - start) / 1000;
    ctx.clearRect(0, 0, width, height);
    state.sx += (state.px - state.sx) * 0.08;
    state.sy += (state.py - state.sy) * 0.08;
    state.strength += ((state.active ? 1 : 0) - state.strength) * 0.05;

    const step = Math.max(9, width / 130);
    lines.forEach((line) => {
      const reveal = reduced ? 1 : easeOutCubic(clamp((t - 0.2 - line.delay) / 1.15, 0, 1));
      if (reveal <= 0) return;
      const baseY = line.offset * height;
      const endX = -32 + (width + 64) * reveal;
      ctx.beginPath();
      for (let x = -32; x <= endX; x += step) {
        const nx = x / width;
        const wave =
          Math.sin(nx * line.freq + t * line.speed + line.phase) * line.amp +
          Math.sin(nx * line.freq * 2.3 - t * line.speed * 0.6 + line.phase * 1.6) * line.amp * 0.32 +
          Math.sin(nx * 1.25 + t * 0.035 + line.phase) * 5;
        let y = baseY + wave;
        if (state.strength > 0.003) {
          const dx = x - state.sx;
          const dy = y - state.sy;
          const pull = Math.exp(-(dx * dx) / 72200 - (dy * dy) / 24200);
          y -= pull * state.strength * 16;
        }
        if (x === -32) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.globalAlpha = line.alpha * (reduced ? 1 : 0.25 + 0.75 * reveal);
      ctx.strokeStyle = line.pine ? palette.strong : palette.soft;
      ctx.lineWidth = line.weight;
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
    if (fadeGradient) {
      ctx.globalCompositeOperation = "destination-in";
      ctx.fillStyle = fadeGradient;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = "source-over";
    }

    if (wash && !reduced) {
      state.gx += (state.gtx - state.gx) * 0.06;
      state.gy += (state.gty - state.gy) * 0.06;
      wash.style.setProperty("--wx", `${state.gx.toFixed(1)}px`);
      wash.style.setProperty("--wy", `${state.gy.toFixed(1)}px`);
    }
  }

  const frame = (now) => {
    raf = 0;
    if (!inView || document.hidden) return;
    if (now - lastFrame < 33) {
      raf = requestAnimationFrame(frame);
      return;
    }
    lastFrame = now;
    draw(now);
    raf = requestAnimationFrame(frame);
  };

  const startLoop = () => {
    if (reduced || raf || !inView || document.hidden) return;
    raf = requestAnimationFrame(frame);
  };

  const stopLoop = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fadeGradient = ctx.createLinearGradient(0, 0, 0, height);
    fadeGradient.addColorStop(0, "rgba(0,0,0,0)");
    fadeGradient.addColorStop(0.2, "rgba(0,0,0,1)");
    fadeGradient.addColorStop(0.76, "rgba(0,0,0,1)");
    fadeGradient.addColorStop(1, "rgba(0,0,0,0)");
    buildLines();
    if (!state.active) {
      state.sx = state.px = width * 0.66;
      state.sy = state.py = height * 0.4;
    }
    draw(performance.now());
    startLoop();
  };

  if (!reduced && finePointer) {
    hero.addEventListener("pointermove", (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) return;
      state.px = x;
      state.py = y;
      state.gtx = x - width * 0.66;
      state.gty = y - height * 0.4;
      state.active = true;
      startLoop();
    }, { passive: true });
    hero.addEventListener("pointerleave", () => {
      state.active = false;
      state.gtx = 0;
      state.gty = 0;
      startLoop();
    });
  }

  if (!reduced && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) startLoop();
      else stopLoop();
    }, { threshold: 0 });
    io.observe(hero);
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopLoop();
      else startLoop();
    });
  } else if (reduced) {
    inView = true;
  }

  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(canvas);
  else window.addEventListener("resize", resize);
  resize();
}

function initSheen() {
  if (!finePointer()) return;
  const surfaces = document.querySelectorAll(
    ".hero__facts, .details, .credential, .featured__card, .project-card, .contact__panel"
  );
  let pending = null;
  let raf = 0;
  const flush = () => {
    raf = 0;
    if (!pending) return;
    pending.node.style.setProperty("--sheen-x", `${pending.x.toFixed(1)}%`);
    pending.node.style.setProperty("--sheen-y", `${pending.y.toFixed(1)}%`);
    pending = null;
  };
  surfaces.forEach((node) => {
    node.addEventListener("pointermove", (event) => {
      const rect = node.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pending = {
        node,
        x: ((event.clientX - rect.left) / rect.width) * 100,
        y: ((event.clientY - rect.top) / rect.height) * 100
      };
      if (!raf) raf = requestAnimationFrame(flush);
    }, { passive: true });
  });
}

function initMagnetic() {
  if (!finePointer() || reduceMotion()) return;
  document.querySelectorAll(".btn").forEach((btn) => {
    let raf = 0;
    let tx = 0;
    let ty = 0;
    const flush = () => {
      raf = 0;
      btn.style.setProperty("--mag-x", `${tx.toFixed(1)}px`);
      btn.style.setProperty("--mag-y", `${ty.toFixed(1)}px`);
    };
    const set = (x, y) => {
      tx = x;
      ty = y;
      if (!raf) raf = requestAnimationFrame(flush);
    };
    btn.addEventListener("pointermove", (event) => {
      const r = btn.getBoundingClientRect();
      set(
        clamp((event.clientX - (r.left + r.width / 2)) * 0.18, -5, 5),
        clamp((event.clientY - (r.top + r.height / 2)) * 0.24, -4, 4)
      );
    }, { passive: true });
    btn.addEventListener("pointerleave", () => set(0, 0));
  });
}

function initStatCount() {
  if (reduceMotion()) return;
  const host = document.getElementById("featured-project");
  if (!host) return;
  const counters = [];
  host.querySelectorAll(".featured__stats strong").forEach((node) => {
    const match = node.textContent.trim().match(/^(\d+)(.*)$/);
    if (match) counters.push({ node, to: Number(match[1]), suffix: match[2] });
  });
  if (!counters.length) return;

  const run = () => counters.forEach((item, i) => {
    const duration = 850 + i * 140;
    const t0 = performance.now();
    const step = (now) => {
      const p = clamp((now - t0) / duration, 0, 1);
      item.node.textContent = Math.round(item.to * (1 - Math.pow(1 - p, 4))) + item.suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });

  if (!("IntersectionObserver" in window)) {
    run();
    return;
  }
  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    io.disconnect();
    setTimeout(run, 240);
  }, { threshold: 0.35 });
  io.observe(host);
}

function initReveals() {
  const targets = [...document.querySelectorAll("[data-animate], [data-stagger]")];
  if (!targets.length) return;
  if (!("IntersectionObserver" in window)) {
    targets.forEach((n) => n.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -6% 0px" });
  targets.forEach((n) => io.observe(n));
}

function initScrollUI() {
  const nav = document.getElementById("site-nav");
  const progress = document.getElementById("progress-bar");
  const toTop = document.getElementById("to-top");
  const timeline = document.querySelector(".timeline");
  const fill = document.getElementById("timeline-fill");
  const links = [...document.querySelectorAll(".nav__links a")];
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const atBottom = max > 0 && y >= max - 8;

    nav?.classList.toggle("is-scrolled", y > 12);
    if (progress) progress.style.transform = `scaleX(${max > 0 ? clamp(y / max, 0, 1) : 0})`;
    toTop?.classList.toggle("is-visible", y > 600);

    const vh = window.innerHeight;
    let current = null;
    let bestVisible = 0;
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
      if (visible > bestVisible) {
        bestVisible = visible;
        current = section.id;
      }
    });
    if (bestVisible < vh * 0.3) current = null;
    if (atBottom && sections.length) current = sections[sections.length - 1].id;
    links.forEach((a) => {
      const active = a.getAttribute("href") === "#" + current;
      a.classList.toggle("is-active", active);
      if (active) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });

    if (timeline && fill && !reduceMotion()) {
      const rect = timeline.getBoundingClientRect();
      const start = window.innerHeight * .82;
      const end = window.innerHeight * .45;
      const travel = rect.height + start - end;
      const p = clamp((start - rect.top) / travel, 0, 1);
      fill.style.transform = `scaleY(${p.toFixed(4)})`;
    }
    ticking = false;
  };

  const request = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  update();
}

function initNavMenu() {
  const nav = document.getElementById("site-nav");
  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("nav-menu");
  if (!nav || !toggle || !menu) return;

  const setState = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.classList.toggle("menu-open", open);
  };

  toggle.addEventListener("click", () => setState(!nav.classList.contains("is-open")));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) setState(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || !nav.classList.contains("is-open")) return;
    setState(false);
    toggle.focus();
  });
  document.addEventListener("click", (e) => {
    if (nav.classList.contains("is-open") && !nav.contains(e.target)) setState(false);
  });
  const desktop = matchMedia("(min-width: 901px)");
  const onChange = (e) => { if (e.matches) setState(false); };
  if (desktop.addEventListener) desktop.addEventListener("change", onChange);
  else desktop.addListener(onChange);
}

function initCopy() {
  const btn = document.querySelector("[data-copy]");
  if (!btn) return;
  const label = btn.querySelector(".copy-btn__text");
  const status = document.getElementById("copy-status");
  const email = btn.dataset.copy;
  let timer = null;

  const done = () => {
    btn.classList.add("is-copied");
    if (label) label.textContent = "Copied";
    if (status) status.textContent = "Email address copied.";
    clearTimeout(timer);
    timer = setTimeout(() => {
      btn.classList.remove("is-copied");
      if (label) label.textContent = "Copy email";
      if (status) status.textContent = "";
    }, 2600);
  };

  const fallback = () => {
    const area = document.createElement("textarea");
    area.value = email;
    area.setAttribute("readonly", "");
    area.style.cssText = "position:fixed;top:-1000px;left:0;opacity:0";
    document.body.append(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch { ok = false; }
    area.remove();
    if (ok) done();
    else if (status) status.textContent = "Copy failed — select the address above instead.";
  };

  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email);
      done();
    } catch {
      fallback();
    }
  });
}

function initClock() {
  const node = document.getElementById("local-time");
  if (!node) return;
  const format = new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
  const tick = () => { node.textContent = format.format(new Date()) + " local"; };
  tick();
  setInterval(tick, 30000);
}

function initBackToTop() {
  const btn = document.getElementById("to-top");
  if (!btn) return;
  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: reduceMotion() ? "auto" : "smooth" });
  });
}

export function initAnimations() {
  splitHeadings();
  assignStagger();
  initHeroName();
  initHeroField();
  initSheen();
  initMagnetic();
  initStatCount();
  initReveals();
  initScrollUI();
  initNavMenu();
  initCopy();
  initClock();
  initBackToTop();
}
