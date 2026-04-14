import { dataService } from "../../core/dataService.js";
import { getMainContainer } from "../../core/uiContainer.js";

export async function renderTrackerUI() {
  const container = getMainContainer();
  try {
    const tasks = await dataService.getTasks();
    const stats = calculateWeekly(tasks);

    container.innerHTML = `
      <h2 style="font-weight:800; margin-bottom:20px;">📊 Мой прогресс</h2>
      
      <div class="card" style="text-align:center;">
        <h3 style="margin-bottom:20px; font-size:16px;">Статистика дня</h3>
        <div class="circle-chart" style="background: conic-gradient(#48bb78 ${stats.percent * 3.6}deg, var(--border) 0deg);">
          <div class="circle-inner">${stats.percent}%</div>
        </div>
        <p style="text-align:center; font-weight:800; font-size:14px; color:var(--text-sec); margin:0;">
          ${stats.completed} из ${stats.total} задач выполнено
        </p>
      </div>

      <div class="card">
        <h3 style="margin:0 0 15px 0; font-size:16px;">Активность за неделю</h3>
        <div class="bar-chart">
          ${stats.days.map(d => `
            <div class="bar-column">
              <div class="bar-fill" style="height: ${Math.max(d.count * 25, 4)}px;"></div>
              <span class="bar-label">${d.label}</span>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- НАШ НОВЫЙ МАСКОТ -->
      <div class="motivation-box" style="margin-top:30px; display:flex; align-items:center; gap:15px; padding-bottom:20px;">
        <div class="mascot-avatar" style="width:60px; height:60px; background:#4299e1; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:30px; box-shadow: 0 4px 10px rgba(66, 153, 225, 0.3);">
          ⚡
        </div>
        <div class="bubble" style="background:var(--card); padding:15px; border-radius:20px; border-bottom-left-radius:0; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border:1px solid var(--border); flex:1;">
          <p style="margin:0; font-weight:700; font-style:italic; font-size:14px; line-height:1.4;">
            "Эй, чемпион! Твой успех состоит из маленьких шагов, которые ты делаешь прямо сейчас. Не смей останавливаться, ты на правильном пути!"
          </p>
        </div>
      </div>
    `;
  } catch (err) { container.innerHTML = "Ошибка данных"; }
}

function calculateWeekly(tasks) {
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const weekData = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const count = tasks.filter(t => t.is_completed && t.created_at.startsWith(dateStr)).length;
    weekData.push({ label: days[d.getDay()], count: count });
  }
  const done = tasks.filter(t => t.is_completed).length;
  return { completed: done, total: tasks.length, percent: tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0, days: weekData };
}