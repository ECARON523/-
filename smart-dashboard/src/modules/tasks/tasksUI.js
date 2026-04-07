import { getMainContainer } from "../../core/uiContainer.js";
import { getTasks, addTask, completeTask } from "./tasks.js";

export function renderTasksUI() {
  const container = getMainContainer();
  const tasks = getTasks();
  
  container.innerHTML = `
    <h2>Мои задачи</h2>
    <input type="text" id="taskInput" placeholder="Новая задача">
    <button id="addBtn">Добавить</button>
    <ul>
      ${tasks.map(t => `
        <li>${t.title} (${t.points} pts) 
          ${t.completed ? '✅' : `<button class="done-btn" data-id="${t.id}">Выполнить</button>`}
        </li>
      `).join('')}
    </ul>
  `;

  document.getElementById("addBtn").onclick = () => {
    const val = document.getElementById("taskInput").value;
    if(val) { addTask({title: val}); renderTasksUI(); }
  };

  container.querySelectorAll('.done-btn').forEach(btn => {
    btn.onclick = () => { completeTask(Number(btn.dataset.id)); renderTasksUI(); };
  });
}