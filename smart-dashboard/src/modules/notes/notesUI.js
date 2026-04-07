import { getMainContainer } from "../../core/uiContainer.js";
import { getNotes } from "./notes.js";

export function renderNotesUI() {
  const container = getMainContainer();
  const notes = getNotes();
  container.innerHTML = `
    <h2>Notes</h2>
    <div>${notes.map(n => `<div style="border:1px solid #444; margin:10px; padding:10px;">
        <h3>${n.title}</h3><p>${n.content}</p>
    </div>`).join('')}</div>
  `;
}