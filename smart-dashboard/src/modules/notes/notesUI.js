import { getMainContainer } from "../../core/uiContainer.js";
import { getNotes, deleteNote, addNote } from "./notes.js";

export function renderNotesUI() {
  const container = getMainContainer();
  const notes = getNotes();
  container.innerHTML = `
    <h2>Заметки</h2>
    <input id="nTitle" placeholder="Заголовок"><input id="nContent" placeholder="Текст">
    <button id="addNoteBtn">Добавить</button>
    <div>${notes.map(n => `
      <div style="border:1px solid #444; margin:10px; padding:10px;">
        <h3>${n.title}</h3><p>${n.content}</p>
        <button class="del-btn" data-id="${n.id}">Удалить</button>
      </div>`).join('')}</div>
  `;

  document.getElementById("addNoteBtn").onclick = () => {
    addNote({ title: document.getElementById("nTitle").value, content: document.getElementById("nContent").value });
    renderNotesUI();
  };

  container.querySelectorAll('.del-btn').forEach(btn => {
    btn.onclick = () => { deleteNote(Number(btn.dataset.id)); renderNotesUI(); };
  });
}