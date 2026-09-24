import './Exercise.css';
import exerciseTemplate  from './Exercise.ejs';
import { typeLine } from "../../utils/utils.js";

export async function renderExercise(exerciseId, categoryId) {

  // Fetch categories + types
  const resCategories = await fetch("/api/categories", { credentials: "include" });
  const categoriesData = await resCategories.json();
  const categories = categoriesData.categories || [];
  const types = categoriesData.types || [];

  // Get current category safely
  const category = categories.find(c => String(c.id) === String(categoryId)) || { icon: "📂", name: "Unknown" };

  // --- Fetch exercise --- 
  const exerciseQ = await fetch(`/api/exercise?id=${exerciseId}`); 
  const exercise = exerciseQ.ok ? await exerciseQ.json() : { title: "Unknown", score: 0, desc: "No description" };

  console.log('category: ', category);
  console.log('exercise:', exercise);
  // --- Render EJS template into #main ---
  const html = exerciseTemplate({
    user: window.state.user,
    exercise,
    category
  });
  document.getElementById("main").innerHTML = html;

  // PopUp 
  const closeBtn = document.getElementById("closeBtn");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      const overlay = document.getElementById("popup-overlay");
      overlay?.classList.add("hidden");
    });
  }

  // DOM references
  const descriptionEl = document.getElementById("challenge-description");
  const form = document.getElementById("challengeForm");
  const tbody = document.getElementById("submission-table-body");
  const terminalContainer = document.getElementById("terminal_container");
  const bannerEl = document.getElementById("grading-banner");
  const exerciseBox = document.getElementById("exercise-box");

  // --- Render text blocks only ---
  if (descriptionEl && exercise.blocks) {
    const textBlocks = exercise.blocks
      .filter(b => b.block_type === "text")
      .sort((a,b) => a.sort_order - b.sort_order)
      .map(b => b.content)
      .join("");
    descriptionEl.innerHTML = textBlocks;
  }

  // Hide terminal initially
  if (terminalContainer) terminalContainer.style.display = "none";

  // --- Setup CodeMirror ---
  let editor = null;
  const editorEl = document.getElementById("codeEditor");
  if (editorEl) {
    editor = CodeMirror.fromTextArea(editorEl, {
      mode: "text/x-javascript",
      theme: "monokai",
      lineNumbers: true,
      lineWrapping: true,
      tabSize: 2
    });
  }

  // --- Terminal ---
  let term = null;
  const termEl = document.getElementById("terminal");
  if (termEl) {
    term = new Terminal({ rows: 10, cols: 80, fontSize: 14, theme: { background: '#000000' } });
    term.open(termEl);
    term.write('Welcome to your terminal\r\n');
  }

  // --- UI Helpers ---
  function toggleAccepted(isAccepted) {
    if (!exerciseBox) return;
    exerciseBox.classList.toggle('opacity-50', isAccepted);
    exerciseBox.style.pointerEvents = isAccepted ? 'none' : 'auto';
    if (form) {
      const inputs = form.querySelectorAll("input, button, select, textarea");
      if (!isAccepted) inputs.forEach(el => el.disabled = false);
    }
  }

  function toggleUI(isGrading) {
    if (bannerEl) bannerEl.classList.toggle('hidden', !isGrading);
    if (exerciseBox) exerciseBox.classList.toggle('hidden', isGrading);
  }

  // --- Polling ---
  async function fetchSubmissions() {
    const res = await fetch(`/api/submissions?ex_id=${exercise.id}`, { credentials: 'include' });
    return res.ok ? res.json() : [];
  }

  async function poll() {
    const submissions = await fetchSubmissions();
    const latest = submissions[0];
    const grading = submissions.some(s => +s.graded === 0);
    const accepted = submissions.some(s => s.result === "Accepted");

    toggleAccepted(accepted);
    toggleUI(grading);

    // --- Show popup once ---
    if (accepted && window.state.showPopup !== false) {
      // Fill points info (optional: from latest.score or exercise.score)
      const pointsEl = document.getElementById("points");
      if (pointsEl) pointsEl.textContent = `${exercise.score} points`;
      const overlay = document.getElementById("popup-overlay");
      overlay?.classList.remove("hidden");
      window.state.showPopup = false; // prevent further popups
    }

    // Render submission table
    if (tbody) {
      tbody.innerHTML = "";
      submissions.forEach((sub, idx) => {
        const row = document.createElement("tr");
        row.className = idx % 2 === 0 ? "bg-white" : "bg-gray-50";
        row.innerHTML = `
          <td class="px-4 py-2 font-medium text-gray-600">#${idx + 1}</td>
          <td class="px-4 py-2">${sub.result}</td>
          <td class="px-4 py-2">${sub.submitted_at}</td>
          <td class="px-4 py-2">${sub.graded_at}</td>`;
        tbody.appendChild(row);
      });
    }

    if (editor && editor.getValue().trim() === "" && latest?.code) {
      editor.setValue(latest.code);
    }

    if (latest && latest.graded == 1 && latest.result.length > 0 && term) {
      await typeLine(term, latest.result);
      clearInterval(window.pollTimer);
      window.pollTimer = null;
    }
    if (submissions.length === 0) {
      clearInterval(window.pollTimer);
      window.pollTimer = null;
    }
  }

  function startPolling(poll) {
    if (window.pollTimer) clearInterval(window.pollTimer);
    poll();
    window.pollTimer = setInterval(poll, 5000);
  }

  // --- Form submission ---
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      toggleUI(true);

      const formData = new URLSearchParams(new FormData(form));
      try {
        const response = await fetch('/api/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
          credentials: 'include'
        });
        await response.json();
        startPolling(poll);
        window.state.refresh = true;
        window.state.showPopup = true;
      } catch (err) {
        alert('Submission failed: ' + err.message);
      }
    });
  }

  // Run poll once
  poll();
}
