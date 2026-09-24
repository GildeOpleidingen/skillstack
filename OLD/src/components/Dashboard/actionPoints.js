import { renderExercise } from "../Exercise/Exercise.js";

export function renderActionPoints() {
  /* ── action‑points card ───────────────────────────── */
  const actionPointsEl = document.getElementById("action-points");
  actionPointsEl.innerHTML = ""; // Clear previous content

  // Map status keywords to colors
  const statusColors = {
    "Compilation error": "bg-red-100 text-red-800",
    "Wrong answer": "bg-yellow-100 text-yellow-800",
    "Not started": "bg-gray-100 text-gray-600",
    "Accepted": "bg-green-100 text-green-800"
  };

  // Helper to get color class for a status (partial match)
  function getStatusClass(status) {
    if (status.includes("Compilation error")) return statusColors["Compilation error"];
    if (status.includes("Wrong answer")) return statusColors["Wrong answer"];
    if (status.includes("Not started")) return statusColors["Not started"];
    if (status.includes("Accepted")) return statusColors["Accepted"];
    return "bg-gray-200 text-gray-700"; // fallback color
  }

  window.state.tasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "flex justify-between items-center cursor-pointer hover:bg-green-50 rounded px-3 py-2 transition-colors";

    const badgeClass = getStatusClass(task.status);

    li.innerHTML = `
      <div>
        <p class="font-semibold text-gray-900">${task.title}</p>
        <p class="text-sm text-gray-500">${task.category_name}</p>
      </div>
      <span class="ml-4 inline-block px-3 py-0.5 text-xs font-semibold rounded-full ${badgeClass}" title="${task.status}">
        ${task.status}
      </span>
    `;

    // 👇 When clicked, navigate to the exercise page
    li.addEventListener("click", async () => {
      // window.location.href = `/exercise/${task.exercise_id}`;
      const path = `/exercise/${task.category_id}/${task.exercise_id}`;
      history.pushState({}, "", path);
      await renderExercise(task.exercise_id, task.category_id);
    });

    actionPointsEl.appendChild(li);
  });
}