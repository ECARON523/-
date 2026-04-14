import { dataService } from "../../core/dataService.js";
import { getMainContainer } from "../../core/uiContainer.js";
import { notify } from "../../core/notificationService.js";

export async function renderTasksUI() {
  const container = getMainContainer();
  const name = localStorage.getItem("userName") || "Пользователь";

  try {
    const tasks = await dataService.getTasks();
    container.innerHTML = `
      <div class="task-page">
        <h1 style="color:var(--accent); font-weight:800; margin-bottom:5px;">Привет, ${name}! 👋</h1>
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:20px;">
          <span style="font-size:24px;">✅</span>
          <h2 style="font-weight:800; margin:0;">Мои задачи</h2>
        </div>
        <div class="card" style="display:flex; gap:10px; padding:8px 8px 8px 15px; align-items:center; background:var(--card); border-radius:16px; margin-bottom:25px;">
            <input type="text" id="t-in" placeholder="Добавить новую задачу..." style="flex:1; border:none; background:transparent; color:var(--text-main); font-family:'Nunito'; outline:none; font-size:15px;">
            <button id="t-add" style="background:var(--accent); border:none; color:white; border-radius:25px; padding:10px 20px; font-weight:800;">Добавить</button>
        </div>
        <div class="task-list">
          ${tasks.map(t => `
            <div class="card" style="display:flex; align-items:center; justify-content:space-between; padding:15px 20px; ${t.is_completed ? 'opacity:0.5' : ''}">
              <div style="display:flex; align-items:center; gap:15px;">
                <input type="checkbox" class="t-check" data-id="${t.id}" ${t.is_completed ? 'checked disabled' : ''} style="width:22px; height:22px; accent-color:#48bb78;">
                <span style="font-weight:700; color:var(--text-main); font-size:16px;">${t.title}</span>
              </div>
              <div style="display:flex; gap:12px;">
                <button class="modern-edit-btn" data-id="${t.id}" data-title="${t.title}" style="background:none; border:none; font-size:18px; color:var(--text-sec);">✎</button>
                <button class="modern-del-btn" data-id="${t.id}" style="background:none; border:none; font-size:18px; color:#f56565;">✕</button>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="ad-banner">Здесь могла быть ваша реклама<br><span style="font-size:9px; opacity:0.6;">ad@smartdashboard.com</span></div>
      </div>
      <div id="edit-modal" class="modal-overlay">
        <div class="modal-card">
          <h3 class="modal-title">Редактировать</h3>
          <input type="text" id="modal-input" class="input-field" style="background:var(--bg);">
          <div class="modal-btns">
            <button id="modal-cancel" class="btn-cancel">Отмена</button>
            <button id="modal-save" class="btn-save-modal">Сохранить</button>
          </div>
        </div>
      </div>
      <div id="del-modal" class="modal-overlay">
        <div class="modal-card">
          <h3 class="modal-title">Удалить задачу?</h3>
          <p style="text-align:center; color:var(--text-sec);">Действие необратимо.</p>
          <div class="modal-btns">
            <button id="del-cancel" class="btn-cancel">Нет</button>
            <button id="del-confirm" class="btn-save-modal" style="background:var(--danger);">Удалить</button>
          </div>
        </div>
      </div>
    `;

    const eModal = document.getElementById("edit-modal");
    const dModal = document.getElementById("del-modal");
    let currentId = null;

    container.querySelectorAll(".modern-edit-btn").forEach(btn => {
      btn.onclick = () => { currentId = btn.dataset.id; document.getElementById("modal-input").value = btn.dataset.title; eModal.style.display = "flex"; };
    });
    container.querySelectorAll(".modern-del-btn").forEach(btn => {
      btn.onclick = () => { currentId = btn.dataset.id; dModal.style.display = "flex"; };
    });

    document.getElementById("modal-cancel").onclick = () => eModal.style.display = "none";
    document.getElementById("del-cancel").onclick = () => dModal.style.display = "none";

    document.getElementById("modal-save").onclick = async () => {
      const val = document.getElementById("modal-input").value;
      if(val) { 
        await dataService.updateTask(currentId, val); 
        eModal.style.display = "none"; 
        notify("Задача обновлена!"); 
        renderTasksUI(); 
      }
    };

    document.getElementById("del-confirm").onclick = async () => {
      await dataService.deleteTask(currentId);
      dModal.style.display = "none";
      notify("Задача удалена", "error");
      renderTasksUI();
    };

    document.getElementById("t-add").onclick = async () => {
      const val = document.getElementById("t-in").value;
      if (val) { 
        await dataService.createTask(val); 
        notify("Задача добавлена!"); 
        renderTasksUI(); 
      }
    };

    container.querySelectorAll(".t-check").forEach(c => {
      c.onchange = async () => { 
        await dataService.completeTask(c.dataset.id, true); 
        notify("+10 очков!"); 
        renderTasksUI(); 
      };
    });

  } catch (e) { container.innerHTML = "Ошибка данных"; }
}