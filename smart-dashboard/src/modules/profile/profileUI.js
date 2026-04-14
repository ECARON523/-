import { dataService } from "../../core/dataService.js";
import { authService } from "../../core/authService.js";
import { getMainContainer } from "../../core/uiContainer.js";
import { notify } from "../../core/notificationService.js";

export async function renderProfileUI() {
  const container = getMainContainer();
  try {
    const tasks = await dataService.getTasks();
    const notes = await dataService.getNotes();
    const completed = tasks.filter(t => t.is_completed).length;
    const name = localStorage.getItem("userName") || "Пользователь";
    const email = localStorage.getItem("userEmail") || "user@email.com";
    const theme = document.documentElement.getAttribute("data-theme");

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px;">
        <h1 style="margin:0; font-weight:800;">Профиль</h1>
        <div style="display:flex; gap:10px;">
          <button id="t-toggle" class="card" style="margin:0; padding:10px; width:45px;">${theme === 'light' ? '🌙' : '☀️'}</button>
          <button id="open-name-modal" class="btn-primary" style="width:auto; padding:10px 20px;">Редактировать</button>
        </div>
      </div>
      <div class="card" style="text-align:center; padding:30px;">
        <div style="width:70px; height:70px; background:var(--bg); border-radius:50%; margin:0 auto 15px; display:flex; align-items:center; justify-content:center; font-size:30px;">👤</div>
        <h2 style="margin:0;">${name}</h2>
        <p style="color:var(--text-sec); margin-top:5px;">${email}</p>
      </div>
      <h3 style="font-weight:800; margin-top:25px;">Достижения</h3>
      <div class="card">
        <p style="margin:0 0 10px 0; font-weight:700;">Всего задач: <span style="color:var(--accent);">${completed}</span></p>
        <p style="margin:0 0 15px 0; font-weight:700;">Заметок: <span style="color:var(--accent);">${notes.length}</span></p>
        <div style="height:10px; background:var(--bg); border-radius:5px; overflow:hidden;">
          <div style="width:${Math.min((completed/5)*100, 100)}%; background:#48bb78; height:100%; transition:1s;"></div>
        </div>
        <p style="font-size:12px; color:var(--text-sec); margin-top:10px;">Цель: 5 задач</p>
      </div>
      <div class="ad-banner" style="border:none; background:linear-gradient(135deg, #667eea, #764ba2); color:#fff; opacity:1;">🚀 PRO СТАТУС<br><span style="font-size:9px;">Безлимитные облачные заметки</span></div>
      <button id="logout" class="card" style="width:100%; color:var(--danger); font-weight:800; border:none; margin-top:20px;">Выйти из профиля</button>
      <div id="name-modal" class="modal-overlay">
        <div class="modal-card">
          <h3 class="modal-title">Ваше имя</h3>
          <input type="text" id="name-input" class="input-field" value="${name}" style="background:var(--bg);">
          <div class="modal-btns">
            <button id="name-cancel" class="btn-cancel">Отмена</button>
            <button id="name-save" class="btn-save-modal">Сохранить</button>
          </div>
        </div>
      </div>
    `;

    const modal = document.getElementById("name-modal");
    document.getElementById("open-name-modal").onclick = () => modal.style.display = "flex";
    document.getElementById("name-cancel").onclick = () => modal.style.display = "none";
    document.getElementById("name-save").onclick = () => {
      const val = document.getElementById("name-input").value;
      if(val) { localStorage.setItem("userName", val); modal.style.display = "none"; notify("Имя успешно изменено!"); renderProfileUI(); }
    };

    document.getElementById("t-toggle").onclick = () => {
      const next = theme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      notify(`Включена ${next === 'dark' ? 'темная' : 'светлая'} тема`);
      renderProfileUI();
    };
    document.getElementById("logout").onclick = () => authService.logout();
  } catch(e) { container.innerHTML = "Ошибка"; }
}