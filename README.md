# Jen Otehlie Mina – Portfolio

Static site (HTML, CSS, ES modules). No build step.

## Structure
- `index.html` – page shell and section containers
- `css/tokens.css` – colors, fonts, spacing (edit the look here)
- `css/base.css` – reset and typography
- `css/layout.css` – nav, sections, grids
- `css/components.css` – buttons, cards, timeline
- `css/animations.css` – all motion, honors reduced-motion
- `js/data/*.js` – ALL content (projects, experience, skills). Edit here, not in HTML
- `js/render.js` – turns data into DOM
- `js/animations.js` – hero draw and scroll hooks
- `js/main.js` – entry point
- `assets/images` – project screenshots; `assets/icons` – favicons/SVGs

## Run locally
ES modules need a server: `npx serve .`

## Deploy (free)
1. Push to GitHub. 2. vercel.com → Add New Project → import repo. 3. Framework preset: Other. Deploy.

## Add a project
Add an object to `js/data/projects.js`, drop its image in `assets/images/`.

## Add richer animation later
Install GSAP via CDN in `index.html`, then add timelines in `js/animations.js`. Elements with `data-animate` are your hooks.
