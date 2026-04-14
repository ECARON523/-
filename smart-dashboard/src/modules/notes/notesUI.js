import { dataService } from "../../core/dataService.js";
import { getMainContainer } from "../../core/uiContainer.js";
import { notify } from "../../core/notificationService.js";

export async function renderNotesUI() {
  const container = getMainContainer();
  try {
    const notes = await dataService.getNotes();
    container.innerHTML = `
      <h2 style="font-weight:800; margin-bottom:20px;">📝 Мои заметки</h2>
      <div class="card">
        <input type="text" id="n-t" class="input-field" placeholder="Заголовок" style="margin-bottom:10px; border:none; background:var(--bg);">
        <textarea id="n-c" class="input-field" placeholder="Текст..." style="border:none; background:var(--bg); height:80px; resize:none;"></textarea>
        <button id="n-add" class="btn-primary" style="margin-top:10px;">Сохранить заметку</button>
      </div>
      <div>
        ${notes.map(n => `
          <div class="card" style="position:relative; padding-right: 80px;">
            <h3 style="margin:0 0 10px 0; color:var(--accent); font-size:18px;">${n.title}</h3>
            <p style="margin:0; font-size:14px; color:var(--text-main);">${n.content}</p>
            <div style="position:absolute; top:20px; right:15px; display:flex; gap:8px;">
                <button class="modern-edit-note-btn" data-id="${n.id}" data-title="${n.title}" data-content="${n.content}" style="background:none; border:none; font-size:18px; color:var(--text-sec);">✎</button>
                <button class="modern-del-note-btn" data-id="${n.id}" style="background:none; border:none; font-size:18px; color:var(--danger);">✕</button>
            </div>
          </div>`).join('')}
      </div>
      <div id="edit-note-modal" class="modal-overlay">
        <div class="modal-card">
          <h3 class="modal-title">Изменить заметку</h3>
          <input type="text" id="modal-n-title" class="input-field" style="background:var(--bg); margin-bottom:10px;">
          <textarea id="modal-n-content" class="input-field" style="background:var(--bg); height:120px; resize:none;"></textarea>
          <div class="modal-btns">
            <button id="modal-n-cancel" class="btn-cancel">Отмена</button>
            <button id="modal-n-save" class="btn-save-modal">Готово</button>
          </div>
        </div>
      </div>
      <div id="del-note-modal" class="modal-overlay">
        <div class="modal-card">
          <h3 class="modal-title">Удалить заметку?</h3>
          <p style="text-align:center; color:var(--text-sec);">Заметка исчезнет навсегда.</p>
          <div class="modal-btns">
            <button id="del-n-cancel" class="btn-cancel">Нет</button>
            <button id="del-n-confirm" class="btn-save-modal" style="background:var(--danger);">Удалить</button>
          </div>
        </div>
      </div>
    `;

    const eModal = document.getElementById("edit-note-modal");
    const dModal = document.getElementById("del-note-modal");
    let currentId = null;

    container.querySelectorAll(".modern-edit-note-btn").forEach(btn => {
      btn.onclick = () => { currentId = btn.dataset.id; document.getElementById("modal-n-title").value = btn.dataset.title; document.getElementById("modal-n-content").value = btn.dataset.content; eModal.style.display = "flex"; };
    });
    container.querySelectorAll(".modern-del-note-btn").forEach(btn => {
      btn.onclick = () => { currentId = btn.dataset.id; dModal.style.display = "flex"; };
    });

    document.getElementById("modal-n-cancel").onclick = () => eModal.style.display = "none";
    document.getElementById("del-n-cancel").onclick = () => dModal.style.display = "none";

    document.getElementById("modal-n-save").onclick = async () => {
      await dataService.updateNote(currentId, document.getElementById("modal-n-title").value, document.getElementById("modal-n-content").value);
      eModal.style.display = "none";
      notify("Заметка обновлена!");
      renderNotesUI();
    };
    document.getElementById("del-n-confirm").onclick = async () => {
      await dataService.deleteNote(currentId);
      dModal.style.display = "none";
      notify("Заметка удалена", "error");
      renderNotesUI();
    };
    document.getElementById("n-add").onclick = async () => {
      const t = document.getElementById("n-t").value;
      const c = document.getElementById("n-c").value;
      if(t && c) { await dataService.createNote(t, c); notify("Заметка сохранена!"); renderNotesUI(); }
    };
  } catch (e) { container.innerHTML = "Ошибка"; }
}