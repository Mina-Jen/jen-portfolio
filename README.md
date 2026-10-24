# Jen Otehlie Mina – Portfolio

Static site (HTML, CSS, ES modules). No build step.

## Structure
- `index.html` – page shell, section containers, hero
- `css/tokens.css` – colors, type, spacing (edit the look here)
- `css/base.css` – reset, typography, links, skip link
- `css/layout.css` – sticky nav, hero and atmosphere layer, section rail, about, footer, breakpoints
- `css/components.css` – buttons, facts, capabilities, credentials, timeline, featured browser card, project cards, contact band
- `css/animations.css` – kinetic hero name, drafting field, split headings, scroll reveals, reduced-motion fallbacks
- `js/data/*.js` – ALL content (projects, experience, skills). Edit here, not in HTML
- `js/render.js` – turns data into DOM (capabilities, education, timeline, featured project, cards)
- `js/animations.js` – hero canvas field + name motion, heading splitting, reveals, nav scrollspy, menu, timeline scrub, copy email, local clock
- `js/main.js` – entry point
- `assets/images` – project screenshots; `assets/icons` – favicon

## Run locally
ES modules need a server: `npx serve .`

## Deploy (free)
1. Push to GitHub. 2. vercel.com → Add New Project → import repo. 3. Framework preset: Other. Deploy.

## Add a project
Add an object to `js/data/projects.js`. Set `link` to show the outbound action. Set `featured: true` (with `image`, `imageAlt`, `browserUrl` and optional `stats`) to build the large browser-mockup card; other projects fill the grid below it.
