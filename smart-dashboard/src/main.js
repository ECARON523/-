import { initRouter } from "./core/router.js";
import { initUI } from "./core/uiContainer.js";
import { authService } from "./core/authService.js";

// ПРОВЕРЬ НАЗВАНИЕ ФАЙЛА НИЖЕ! Если файл называется notifications.js, оставь так:
import * as NotificationModule from "./core/notificationService.js"; 

// Выставляем функции в глобальную область
window.registerUser = async (email, password) => {
  const res = await authService.register(email, password);
  console.log("Ответ сервера (регистрация):", res);
};

window.loginUser = async (email, password) => {
  const res = await authService.login(email, password);
  console.log("Ответ сервера (вход):", res);
};

// Запуск приложения
document.addEventListener("DOMContentLoaded", async () => {
  console.log("🚀 App started");

  // Запрос прав на уведомления (безопасный вызов)
  if (NotificationModule && NotificationModule.requestNotificationPermission) {
    try {
      await NotificationModule.requestNotificationPermission();
    } catch (e) {
      console.warn("Notification permission blocked or failed");
    }
  }

  initUI();
  initRouter();
});