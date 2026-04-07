let routes = {};
let defaultRoute = "/tasks";

export function initRouter() {
  // Теперь здесь функции, которые возвращают промис
  routes = {
    "/tasks": () => import("../modules/tasks/tasksUI.js").then(mod => {
      // Пробуем вызвать либо именованный экспорт, либо default
      const func = mod.renderTasksUI || mod.default;
      return func();
    }),
    "/notes": () => import("../modules/notes/notesUI.js").then(mod => {
      const func = mod.renderNotesUI || mod.default;
      return func();
    }),
    "/tracker": () => import("../modules/tracker/trackerUI.js").then(mod => {
      const func = mod.renderTrackerUI || mod.default;
      return func();
    })
  };

  window.addEventListener("popstate", handleRoute);
  handleRoute();
}

export function navigate(path) {
  window.history.pushState({}, "", path);
  handleRoute();
}

async function handleRoute() {
  const path = window.location.pathname;
  const route = routes[path] ? path : defaultRoute;
  
  // Добавляем await, чтобы дождаться загрузки модуля
  try {
    await routes[route]();
  } catch (err) {
    console.error("Ошибка загрузки модуля:", err);
  }
}