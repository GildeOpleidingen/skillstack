import './AdminExercises.css';
import adminTemplate from './AdminExercises.ejs';

// Toggle button visibility of exercise
async function handleExerciseVisibility(exercise_id, btn) {
  console.info("Toggle visibility for", exercise_id);

  try {
    const currentlyActive = btn.dataset.active === "1";
    const newState = currentlyActive ? 0 : 1;

    const res = await fetch(`/api/exercise/${exercise_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: exercise_id, is_active: newState }),
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to toggle exercise visibility");

    // ✅ Update dataset
    btn.dataset.active = newState;

    // ✅ Update button color
    if (newState === 1) {
      btn.classList.remove("bg-gray-400", "hover:bg-gray-500");
      btn.classList.add("bg-green-500", "hover:bg-green-600");
      btn.title = "Active (Click to hide)";
    } else {
      btn.classList.remove("bg-green-500", "hover:bg-green-600");
      btn.classList.add("bg-gray-400", "hover:bg-gray-500");
      btn.title = "Hidden (Click to activate)";
    }

    // ✅ Update the "Hidden" badge
    const li = btn.closest("li");
    if (li) {
      const badge = li.querySelector(".hidden-badge");
      if (newState === 1 && badge) {
        badge.remove(); // remove "Hidden"
      } else if (newState === 0 && !badge) {
        const badgeEl = document.createElement("span");
        badgeEl.className =
          "hidden-badge ml-2 text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded";
        badgeEl.textContent = "Hidden";
        li.querySelector("div.flex.items-center").appendChild(badgeEl);
      }
    }
  } catch (err) {
    console.error(err);
    alert("Could not update exercise visibility");
  }
}

function handleExerciseEdit(exercise_id) {
  console.info("Edit", exercise_id);
}

function handleExerciseDelete(exercise_id) {
  console.info("Delete", exercise_id);
}

// Fetch exercises for a category (main or sub)
async function fetchExercises(categoryId) {
  try {
    const res = await fetch(`/api/exercise?category_id=${categoryId}`);
    const data = await res.json();

    const ul = document.getElementById(`exercises-${categoryId}`);
    if (!ul) return;

    ul.innerHTML = ''; // Clear

    data.forEach(exercise => {
      const li = document.createElement('li');
      li.className =
        'flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200';

      li.innerHTML = `
        <div class="flex items-center gap-3">          
          <span class="text-gray-700">${exercise.title}</span>
          ${!exercise.is_active ? '<span class="hidden-badge ml-2 text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded">Hidden</span>' : ''}
        </div>
        <div class="flex gap-2">
          <button data-id="${exercise.id}" data-active="${exercise.is_active}"
            class="toggle ${exercise.is_active 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-gray-400 hover:bg-gray-500'} text-white p-2 rounded" 
            title="Toggle Visibility">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>

          <!-- Edit: now an <a> link with nav-link class -->
          <a href="/admin/exercise/${categoryId}/${exercise.id}" 
            class="nav-link edit bg-blue-500 hover:bg-blue-600 text-white p-2 rounded flex items-center justify-center" 
            title="Edit Exercise">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536M9 13h3l9-9a1.414 1.414 0 00-2-2l-9 9v3z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 20h12" />
            </svg>
          </a>
        </div>
      `;

      ul.appendChild(li);
    });
  } catch (err) {
    console.error('Error fetching exercises:', err);
  }
}

// ✅ One-time global event delegation
function setupGlobalDelegates() {
  const main = document.getElementById("main");
  if (main.dataset.delegatesAttached) return; // already done

  // Handle clicks inside exercises lists
  main.addEventListener("click", (event) => {
    const toggleBtn = event.target.closest("button.toggle");
    if (toggleBtn) {
      handleExerciseVisibility(toggleBtn.dataset.id, toggleBtn);
      return;
    }

    const editBtn = event.target.closest("button.edit");
    if (editBtn) {
      handleExerciseEdit(editBtn.dataset.id);
      return;
    }

    const deleteBtn = event.target.closest("button.delete");
    if (deleteBtn) {
      handleExerciseDelete(deleteBtn.dataset.id);
      return;
    }
  });

  // Handle add-exercise form submits
  main.addEventListener("submit", async (event) => {
    const form = event.target.closest(".add-exercise-form");
    if (!form) return;

    event.preventDefault();
    const categoryId = form.dataset.category;
    const name = form.querySelector("[name='name']").value.trim();
    if (!name) return;

    try {
      const res = await fetch("/api/exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: name, category_id: categoryId }),
        credentials: "include"
      });

      if (!res.ok) throw new Error("Failed to add exercise");
      await res.json();

      form.reset();
      fetchExercises(categoryId);
    } catch (err) {
      console.error("Error adding exercise:", err);
      alert("Could not add exercise");
    }
  });

  main.dataset.delegatesAttached = "true";
}

export async function renderAdminExercises() {
  try {
    const resCategories = await fetch('/api/categories', { credentials: 'include' });
    const { categories, types } = await resCategories.json();

    const html = adminTemplate({
      user: window.state.user,
      types,
      categories,
      exercises: [] // no preloaded exercises
    });
    document.getElementById('main').innerHTML = html;

    setupGlobalDelegates(); // ✅ attach once globally

    // Panel toggles
    document.querySelectorAll('[data-panel]').forEach(panel => {
      panel.addEventListener('click', () => {
        const panelId = panel.getAttribute('data-panel');
        const content = document.getElementById(`panel-${panelId}`);
        const arrow = document.getElementById(`arrow-${panelId}`);

        if (content.classList.contains('hidden')) {
          content.classList.remove('hidden');
          arrow.textContent = '▲';
          fetchExercises(panelId); // Load exercises dynamically
        } else {
          content.classList.add('hidden');
          arrow.textContent = '▼';
        }
      });
    });
  } catch (err) {
    console.error('Error rendering admin exercises:', err);
  }
}
