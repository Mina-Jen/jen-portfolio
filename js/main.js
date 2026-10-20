import { profile } from "./data/profile.js";
import { experience } from "./data/experience.js";
import { projects } from "./data/projects.js";
import { renderAll } from "./render.js";
import { initAnimations } from "./animations.js";

document.documentElement.classList.add("js");
renderAll({ profile, experience, projects });
initAnimations();
