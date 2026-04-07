let routes = {};
let defaultRoute = null;

// Инициализация маршрутов
export function initRouter() {
  // Определяем маршруты и их обработчики
  // src/core/router.js
    const routes = {
    "/tasks": () => import("../modules/tasks/tasksUI.js").then(m => m.renderTasksUI()),
    "/notes": () => import("../modules/notes/notesUI.js").then(m => m.renderNotesUI()),
    "/tracker": () => import("../modules/tracker/trackerUI.js").then(m => m.renderTrackerUI())
    };

// ... остальной код (handleRoute и т.д.)

  defaultRoute = "/tasks"; // По умолчанию открывается Tasks

  // Слушаем изменения URL (кнопки браузера)
  window.addEventListener("popstate", handleRoute);

  // Инициализация маршрута при загрузке
  handleRoute();
}

// Переход по маршруту
export function navigate(path) {
  history.pushState({}, "", path);
  handleRoute();
}

// Обработка маршрута
function handleRoute() {
  const path = window.location.pathname;
  const route = routes[path] ? path : defaultRoute;
  routes[route]();
}
