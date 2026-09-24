/* ===== helper ============================================================ */
function animateGauge(target) {
  const circle = document.querySelector('.gauge-fg');
  const label  = document.getElementById('gauge-value');

  const radius       = +circle.getAttribute('r');         // 90
  const circumference = 2 * Math.PI * radius;             // 565.48
  const clamp        = p => Math.max(0, Math.min(100, p));
  const pickColor    = pct =>
    pct < 50 ? '#ef4444' : pct < 75 ? '#f59e0b' : '#10b981';

  const end   = clamp(target);
  const start = 0;
  const dur   = 800;                                      // ms animation
  const t0    = performance.now();

  (function frame(now) {
    const prog = Math.min(1, (now - t0) / dur);
    const pct  = start + (end - start) * prog;

    circle.style.strokeDashoffset = circumference * (1 - pct / 100);
    circle.style.stroke           = pickColor(pct);
    label.textContent             = pct.toFixed(0);

    if (prog < 1) requestAnimationFrame(frame);
  })(t0);
}

export function renderGauge(score) {
  /* ── score card circular gauge ───────────────── */
  document.getElementById("score").innerHTML = `
    <div class="circle-gauge">
      <svg class="gauge-ring" viewBox="0 0 220 220">
        <circle class="gauge-bg" cx="110" cy="110" r="90"/>
        <circle class="gauge-fg" cx="110" cy="110" r="90"/>
      </svg>
      <div class="gauge-text"><span id="gauge-value">0</span>%</div>
    </div>
  `;

  /* ── animate the gauge ────────────────────────────── */
  console.log('score:', score);
  if (window.state.score && window.state.score.length > 0) {
    animateGauge(window.state.score[0].percentage ?? 0);   // <= API delivers { percentage: 34.6 }
  }
}
