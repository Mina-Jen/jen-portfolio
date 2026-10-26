# Jen Otehlie Mina – Portfolio

Static portfolio (HTML, CSS, ES modules). No build step.
Live at https://jen-portfolio-56w3f6hr0mq.qoder.website.

## Structure
- `index.html` – page shell, section containers, hero, early theme boot script
- `css/tokens.css` – color, type and spacing tokens for both themes (edit the look here)
- `css/base.css` – reset, typography, links, skip link
- `css/layout.css` – sticky nav, hero and atmosphere layer, section rail, about, footer, breakpoints
- `css/components.css` – buttons, facts, capabilities, credentials, timeline, featured browser card, project cards, contact band
- `css/glass.css` – glassmorphism layer: translucent surfaces, backdrop blur, specular edges, pointer-tracked sheen, ambient depth field (warm fractal-noise grain + vertical light ramp + drifting veil) so the frost has real material to diffuse, plus `@supports` and `prefers-reduced-transparency` fallbacks
- `css/animations.css` – kinetic hero name, drafting field, split headings, scroll reveals, glass sweep, reduced-motion fallbacks
- `js/data/*.js` – ALL content (projects, experience, skills). Edit here, not in HTML
- `js/render.js` – turns data into DOM (capabilities, education, timeline, featured project, cards)
- `js/theme.js` – theme toggle and persistence
- `js/animations.js` – hero canvas field + name motion, heading splitting, reveals, nav scrollspy, menu, timeline scrub, glass sheen + magnetic buttons + stat count-up, copy email, local clock
- `js/main.js` – entry point
- `assets/images` – project screenshots; `assets/icons` – favicon
- `dist/` – deployment output staged from the source; don't edit by hand

## Theming
The theme follows the OS on first visit; the nav toggle stores the choice in `localStorage` as `jm-theme` and the early script in `index.html` applies it before paint. Dark values are on `:root`, light values on `[data-theme="light"]` in `css/tokens.css`; components only consume the custom properties, so a new color is one token per theme.

## Run locally
ES modules need a server:

```
python3 -m http.server 5500
```

Then open http://localhost:5500.

## Deploy
Hosted on Qoder Sites. Rebuild `dist/` from the source (`index.html`, `css/`, `js/`, `assets/`) and publish that folder as the site's web directory.

## Add a project
Add an object to `js/data/projects.js`. Set `link` to show the outbound action. Set `featured: true` (with `image`, `imageAlt`, `browserUrl` and optional `stats`) to build the large browser-mockup card; other projects fill the grid below it.
