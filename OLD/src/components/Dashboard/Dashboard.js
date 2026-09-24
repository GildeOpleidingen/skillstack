import { renderHeatmap } from './heatmap.js';
import { renderGauge } from './renderGauge.js';
import { getData } from '../../utils/utils.js';
import { renderActionPoints } from './actionPoints.js';
import dashboardTemplate from './Dashboard.ejs';

export async function renderDashboard() {
  try {
  
    if (!window.state.user) {
      console.warn('No user in state — sidebar rendering skipped');
      return;
    }
    await getData(window.state.refresh);

    // Render main template into #main
    const html = dashboardTemplate({
      user: window.state.user,
      user_selected_types: window.state.user_selected_types
    });
    document.getElementById("main").innerHTML = html;

    /* ---- leaderboard ---- */
    const ul = document.getElementById("leaderboard");
    window.state.leaderboard.forEach(lb => {
      const li = document.createElement("li");
      li.className = "flex items-center space-x-4 p-4 bg-white rounded shadow";
      li.innerHTML = `
        <img src="${lb.avatar_url}" alt="${lb.username}'s avatar" class="w-12 h-12 rounded-full">
        <div class="flex-1">
          <p class="font-semibold text-gray-900">${lb.username}</p>
          <p class="text-gray-600 text-sm">Exercises solved: ${lb.exercises_solved}</p>
        </div>
        <div class="font-bold text-indigo-600">${lb.total_score} pts</div>
      `;
      ul.appendChild(li);
    });

    /* ---- heatmap ---- */
    renderHeatmap(window.state.contributions);

    /* ---- action points ---- */
    renderActionPoints();

    /* ---- score gauge ---- */
    renderGauge(window.state.score);

    /* ---- language selector ---- */
    document.getElementById("languageSelect").addEventListener("click", e => {
      e.preventDefault();
      submitLanguages();
    });


    function submitLanguages() {
      const selected = Array.from(document.querySelectorAll('input[name="languages"]:checked'))
        .map(input => input.value);
      console.log('User selected: ', selected);
      fetch('/api/user_selected_types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ languages: selected })
      }).then(() => {
        console.log('look into!!');
        // alert('Taalkeuze opgeslagen!');
        location.reload(); // optionally reload the dashboard
      });
    }

  } catch (err) {
    console.error("Failed to load dashboard:", err);
  }
}
