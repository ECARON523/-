import { navigate } from "./router.js";
import { authService } from "./authService.js";

let isLoginMode = true;

export function initUI() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  const app = document.getElementById("app");
  if (!authService.isLoggedIn()) { renderAuthUI(app); } 
  else { renderAppUI(app); }
}

function renderAuthUI(container) {
  container.innerHTML = `
    <div class="card auth-card" style="margin:80px auto; max-width:320px; text-align:center;">
      <h2 style="font-weight:800;">Smart Dashboard</h2>
      <p style="color:var(--text-sec); margin-bottom:20px;">${isLoginMode ? 'Вход' : 'Регистрация'}</p>
      <input type="email" id="email" class="input-field" placeholder="Email" style="margin-bottom:10px;">
      <input type="password" id="pass" class="input-field" placeholder="Пароль" style="margin-bottom:15px;">
      <button id="auth-btn" class="btn-primary">${isLoginMode ? 'Войти' : 'Создать аккаунт'}</button>
      <p style="margin-top:15px; font-size:14px;">
        <a href="#" id="toggle-auth" style="color:var(--accent); text-decoration:none; font-weight:700;">
          ${isLoginMode ? 'Нет аккаунта? Регистрация' : 'Есть аккаунт? Войти'}
        </a>
      </p>
    </div>`;

  document.getElementById("toggle-auth").onclick = (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    renderAuthUI(container);
  };

  document.getElementById("auth-btn").onclick = async () => {
    const e = document.getElementById("email").value;
    const p = document.getElementById("pass").value;
    const res = isLoginMode ? await authService.login(e, p) : await authService.register(e, p);
    if (!res.error) { 
      localStorage.setItem("userEmail", e);
      window.location.reload(); 
    } else alert(res.error);
  };
}

function renderAppUI(container) {
  container.innerHTML = `
    <main id="main-content"></main>
    <nav class="bottom-nav">
      <button class="nav-item active" data-path="/tasks">
        <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
        ЗАДАЧИ
      </button>
      <button class="nav-item" data-path="/notes">
        <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
        ЗАМЕТКИ
      </button>
      <button class="nav-item" data-path="/tracker">
        <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
        ПРОГРЕСС
      </button>
      <button class="nav-item" data-path="/leaderboard">
        <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
        ЛИДЕРЫ
      </button>
      <button class="nav-item" data-path="/profile">
        <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
        ПРОФИЛЬ
      </button>
    </nav>`;
  const navItems = container.querySelectorAll(".nav-item");
  navItems.forEach(btn => {
    btn.onclick = () => {
      navItems.forEach(i => i.classList.remove("active"));
      btn.classList.add("active");
      navigate(btn.dataset.path);
    };
  });
}
export function getMainContainer() { return document.getElementById("main-content"); }