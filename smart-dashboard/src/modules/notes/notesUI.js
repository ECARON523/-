import { getMainContainer } from "../../core/uiContainer.js";
import { getNotes, addNote, deleteNote } from "./notes.js";

export function renderNotesUI() {
  const container = getMainContainer();
  const notes = getNotes();
  
  container.innerHTML = `
    <div class="notes-container">
      <h2 class="notes-header">📝 Мои Заметки</h2>
      <div class="notes-form">
        <input id="nTitle" class="notes-input" placeholder="Заголовок заметки">
        <input id="nContent" class="notes-input" placeholder="Текст заметки...">
        <button id="addNoteBtn" class="notes-add-btn">Сохранить заметку</button>
      </div>
      <div class="notes-grid">
        ${notes.map(n => `
          <div class="note-card">
            <h3 class="note-title">${n.title}</h3>
            <p class="note-content">${n.content}</p>
            <button class="note-del-btn" data-id="${n.id}">Удалить</button>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  document.getElementById("addNoteBtn").onclick = () => {
    addNote({ title: document.getElementById("nTitle").value, content: document.getElementById("nContent").value });
    renderNotesUI();
  };

  container.querySelectorAll('.note-del-btn').forEach(btn => {
    btn.onclick = () => { deleteNote(Number(btn.dataset.id)); renderNotesUI(); };
  });
}