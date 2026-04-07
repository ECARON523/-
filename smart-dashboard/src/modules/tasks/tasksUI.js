import { getMainContainer } from "../../core/uiContainer.js";
import { getTasks, addTask, completeTask } from "./tasks.js";

export function renderTasksUI() {
  const container = getMainContainer();
  const tasks = getTasks();
  
  container.innerHTML = `
    <div class="tasks-container">
      <h2 class="tasks-header">📌 Мои задачи</h2>
      <div class="tasks-form">
        <input type="text" id="taskInput" class="tasks-input" placeholder="Что нужно сделать?">
        <button id="addBtn" class="tasks-add-btn">Добавить</button>
      </div>
      <ul class="tasks-list">
        ${tasks.map(t => `
          <li class="task-item ${t.completed ? 'completed' : ''}">
            <div class="task-info">
              <span>${t.title}</span>
              <span class="task-points">${t.points} pts</span>
            </div>
            ${t.completed ? '<span>✅</span>' : `<button class="task-complete-btn" data-id="${t.id}">Выполнить</button>`}
          </li>
        `).join('')}
      </ul>
    </div>
  `;

  document.getElementById("addBtn").onclick = () => {
    const val = document.getElementById("taskInput").value;
    if(val) { addTask({title: val}); renderTasksUI(); }
  };

  container.querySelectorAll('.task-complete-btn').forEach(btn => {
    btn.onclick = () => { completeTask(Number(btn.dataset.id)); renderTasksUI(); };
  });
}