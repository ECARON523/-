import { dataService } from "../../core/dataService.js";
import { getMainContainer } from "../../core/uiContainer.js";

export async function renderTrackerUI() {
  const container = getMainContainer();
  container.innerHTML = `<h2 style="text-align:center; color:var(--text-sec); margin-top:20px;">Загрузка статистики...</h2>`;

  try {
    const tasks = await dataService.getTasks();
    const stats = calculateWeeklyStats(tasks);

    container.innerHTML = `
      <div class="tracker-page">
        <h2 class="section-title" style="font-weight:800; margin-bottom:20px;">📊 Мой прогресс</h2>
        
        <!-- Круг прогресса -->
        <div class="card stats-card" style="text-align:center;">
          <h3 style="margin-bottom:20px; font-size:16px;">Статистика дня</h3>
          <div class="circle-chart" style="background: conic-gradient(#48bb78 ${stats.totalPercent * 3.6}deg, var(--border) 0deg);">
            <div class="circle-inner">${stats.totalPercent}%</div>
          </div>
          <div class="legend" style="display:flex; justify-content:center; gap:20px; font-weight:700; color:var(--text-sec);">
            <span>Выполнено: ${stats.completed}</span>
            <span>Всего: ${stats.total}</span>
          </div>
        </div>

        <!-- Столбики за неделю (ИСПРАВЛЕННЫЕ) -->
        <div class="card">
          <h3 class="stats-title" style="margin-bottom:20px; font-size:16px;">Активность за неделю</h3>
          <div class="bar-chart" style="height: 160px; display: flex; align-items: flex-end; justify-content: space-between; padding: 10px 5px; border-bottom: 1px solid var(--border);">
             ${stats.days.map(d => {
               // НАХОДИМ МАКСИМУМ ДЛЯ МАСШТАБИРОВАНИЯ
               // Берем либо самый большой результат в неделе, либо минимум 5, чтобы график не был пустым
               const maxVal = Math.max(...stats.days.map(x => x.val), 5);
               // Считаем высоту в процентах (макс 80%, чтобы цифра сверху влезла)
               const barHeight = (d.val / maxVal) * 80;
               
               return `
               <div class="bar-column" style="display: flex; flex-direction: column; align-items: center; flex: 1; height: 100%; justify-content: flex-end; gap: 5px;">
                 <!-- ЦИФРА -->
                 <span style="font-size: 11px; font-weight: 800; color: ${d.val > 0 ? 'var(--accent)' : 'var(--text-sec)'}; opacity: ${d.val > 0 ? '1' : '0.3'};">
                   ${d.val}
                 </span>
                 
                 <!-- СТОЛБИК (теперь в %) -->
                 <div class="bar-fill" style="height: ${barHeight}%; width: 28px; background: var(--accent); border-radius: 6px; transition: height 0.5s; min-height: 2px;"></div>
                 
                 <!-- ПОДПИСЬ -->
                 <span class="bar-label" style="font-size: 11px; color: var(--text-sec); font-weight: 800; margin-top: 5px;">${d.label}</span>
               </div>
             `;}).join('')}
          </div>
        </div>

        <!-- МАСКОТ -->
        <div class="motivation-box" style="margin-top:30px; display:flex; align-items:center; gap:15px; padding-bottom:20px;">
          <div class="mascot-avatar" style="width:60px; height:60px; background:#4299e1; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:30px; box-shadow: 0 4px 10px rgba(66, 153, 225, 0.3);">
            ⚡
          </div>
          <div class="bubble" style="background:var(--card); padding:15px; border-radius:20px; border-bottom-left-radius:0; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border:1px solid var(--border); flex:1;">
            <p style="margin:0; font-weight:700; font-style:italic; font-size:14px; line-height:1.4;">
              "Эй, чемпион! Твой успех состоит из маленьких шагов, которые ты делаешь прямо сейчас. Не смей останавливаться!"
            </p>
          </div>
        </div>
      </div>
    `;
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p style="color:red; text-align:center;">Ошибка загрузки данных</p>`;
  }
}

// РАБОЧАЯ ЛОГИКА ПОДСЧЕТА (БЕЗ ИЗМЕНЕНИЙ)
function calculateWeeklyStats(tasks) {
  const now = new Date();
  const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  const weekData = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0]; 
    
    const count = tasks.filter(t => 
      t.is_completed && t.created_at && t.created_at.startsWith(dateStr)
    ).length;

    weekData.push({ label: days[d.getDay()], val: count });
  }

  const completed = tasks.filter(t => t.is_completed).length;
  const total = tasks.length;

  return {
    completed: completed,
    total: total,
    totalPercent: total > 0 ? Math.round((completed / total) * 100) : 0,
    days: weekData
  };
}