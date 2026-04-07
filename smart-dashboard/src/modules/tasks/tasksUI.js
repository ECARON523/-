import { getMainContainer } from "../../core/uiContainer.js";
import { getTasks } from "./tasks.js"; // Импортируем логику из tasks.js

export function renderTasksUI() {
  const container = getMainContainer();
  const tasks = getTasks();
  
  // Рендерим HTML для списка задач
  container.innerHTML = `
    <div class="tasks-module">
      <h2>Мои задачи</h2>
      <ul>
        ${tasks.map(task => `
          <li>
            ${task.title} - ${task.points} очков 
            ${task.completed ? '✅' : '⏳'}
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}