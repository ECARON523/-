import { getMainContainer } from "../../core/uiContainer.js";
import { leaderboard } from "./dummyLeaderboard.js";

export function renderTrackerUI() {
  const container = getMainContainer();
  
  container.innerHTML = `
    <div class="tracker-container">
      <h2 class="tracker-header">🏆 Рейтинг</h2>
      <ul class="tracker-list">
        ${leaderboard.map((p, index) => `
          <li class="tracker-item">
            <span class="tracker-name">
              ${index === 0 ? '👑' : '👤'} ${p.name}
            </span>
            <span class="tracker-points">${p.points}</span>
          </li>
        `).join('')}
      </ul>
      <button class="tracker-refresh-btn" onclick="location.reload()">Обновить данные</button>
    </div>
  `;
}