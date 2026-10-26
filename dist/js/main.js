import { profile } from "./data/profile.js?v=20261026k";
import { experience } from "./data/experience.js?v=20261026k";
import { projects } from "./data/projects.js?v=20261026k";
import { renderAll } from "./render.js?v=20261026k";
import { initTheme } from "./theme.js?v=20261026k";
import { initAnimations } from "./animations.js?v=20261026k";

document.documentElement.classList.add("js");
renderAll({ profile, experience, projects });
initTheme();
initAnimations();
