import { getMainContainer } from "../../core/uiContainer.js";
import { leaderboard } from "./dummyLeaderboard.js";

export function renderTrackerUI() {
  const container = getMainContainer();
  container.innerHTML = `
    <h2>Leaderboard</h2>
    <ul>
      ${leaderboard.map(p => `<li>${p.name}: ${p.points} очков</li>`).join('')}
    </ul>
    <button onclick="location.reload()">Обновить рейтинг</button>
  `;
}