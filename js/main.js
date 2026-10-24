import { profile } from "./data/profile.js?v=20261024h";
import { experience } from "./data/experience.js?v=20261024h";
import { projects } from "./data/projects.js?v=20261024h";
import { renderAll } from "./render.js?v=20261024h";
import { initAnimations } from "./animations.js?v=20261024h";

document.documentElement.classList.add("js");
renderAll({ profile, experience, projects });
initAnimations();
