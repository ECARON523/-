import { authService } from "./authService.js";
import { getMainContainer, initUI } from "./uiContainer.js";

let routes = {};
let defaultRoute = "/tasks";

export function initRouter() {
  routes = {
    "/tasks": () => import("../modules/tasks/tasksUI.js").then(m => (m.renderTasksUI || m.default)()),
    "/notes": () => import("../modules/notes/notesUI.js").then(m => (m.renderNotesUI || m.default)()),
    "/tracker": () => import("../modules/tracker/trackerUI.js").then(m => (m.renderTrackerUI || m.default)()),
    "/leaderboard": () => import("../modules/leaderboard/leaderboardUI.js").then(m => (m.renderLeaderboardUI || m.default)()),
    "/profile": () => import("../modules/profile/profileUI.js").then(m => (m.renderProfileUI || m.default)())
  };

  window.addEventListener("hashchange", handleRoute);
  handleRoute();
}

export function navigate(path) {
  window.location.hash = `#${path}`;
}

async function handleRoute() {
  if (!authService.isLoggedIn()) {
    initUI(); 
    return;
  }

  const hashPath = window.location.hash.replace("#", "") || defaultRoute;
  const routeFunc = routes[hashPath];

  if (routeFunc) {
    const container = getMainContainer();
    if (container) container.innerHTML = `<h2 style="text-align:center; margin-top:50px; color:var(--text-sec);">Загрузка...</h2>`;
    
    try {
      await routeFunc();
    } catch (err) {
      console.error("Ошибка загрузки модуля:", err);
      if (getMainContainer()) getMainContainer().innerHTML = "Ошибка загрузки модуля.";
    }
  } else {
    navigate(defaultRoute);
  }
}