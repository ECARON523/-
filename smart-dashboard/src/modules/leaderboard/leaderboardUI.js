import { dataService } from "../../core/dataService.js";
import { getMainContainer } from "../../core/uiContainer.js";

export async function renderLeaderboardUI() {
  const container = getMainContainer();
  container.innerHTML = `<h2 style="text-align:center; color:var(--text-sec);">Загрузка рейтинга...</h2>`;

  try {
    const leaderboard = await dataService.getLeaderboard();
    
    container.innerHTML = `
      <div class="leaderboard-page">
        <h2 class="section-title">🏆 Лидерборд</h2>
        <div class="card">
          <table style="width:100%; border-collapse: collapse;">
            ${leaderboard.map((u, i) => `
              <tr style="border-bottom: 1px solid var(--border);">
                <td style="padding:15px; color:var(--text-sec); font-weight:800; width:40px;">${i + 1}</td>
                <td style="padding:15px; font-weight:700;">${u.email.split('@')[0]}</td>
                <td style="padding:15px; text-align:right; color:var(--accent); font-weight:800;">${u.points} pts</td>
              </tr>
            `).join('')}
          </table>
        </div>
      </div>
    `;
  } catch (err) { container.innerHTML = "Ошибка загрузки лидеров"; }
}