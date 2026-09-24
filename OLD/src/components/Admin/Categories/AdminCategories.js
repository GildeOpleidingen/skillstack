import './AdminCategories.css';
import adminTemplate from './AdminCategories.ejs';

export async function renderAdminCategories() {

  // Get types and categories?
  // Fetch categories & types
  const resCategories = await fetch("/api/categories", {
    credentials: "include"
  });
  const { categories, types } = await resCategories.json();

  console.log('State: ', window.state);
  try {
    // Render main template into #main
    const html = adminTemplate({
      user: window.state.user,
      categories,
      types
    });
    document.getElementById("main").innerHTML = html;

    document.querySelectorAll('[data-panel]').forEach(panel => {
    panel.addEventListener('click', () => {
      const panelId = panel.getAttribute('data-panel');
      const content = document.getElementById(`panel-${panelId}`);
      const arrow = document.getElementById(`arrow-${panelId}`);

      if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        arrow.textContent = '▲';
      } else {
        content.classList.add('hidden');
        arrow.textContent = '▼';
      }
    });
  });

  // Add main category
  document.querySelectorAll(".add-maincategory-form").forEach(form => {
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const typeId = form.dataset.type;
      const name = form.querySelector("input[name='name']").value;
      const icon = form.querySelector("input[name='icon']").value || "📘";

      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, icon, parent_id: 0, type_id: typeId })
      });

      location.reload();
    });
  });

  // Add subcategory
  document.querySelectorAll(".add-subcategory-form").forEach(form => {
    form.addEventListener("submit", async e => {
      e.preventDefault();
      const parentId = form.dataset.parent;
      const name = form.querySelector("input[name='name']").value;
      const icon = form.querySelector("input[name='icon']").value || "📘";

      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, icon, parent_id: parentId })
      });

      location.reload();
    });
  });

  // Delete
  document.querySelectorAll(".delete").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      if (confirm("Delete this category?")) {
        await fetch(`/api/categories/${id}`, { method: "DELETE" });
        location.reload();
      }
    });
  });

  // Edit
  document.querySelectorAll(".edit").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const newName = prompt("New name:");
      if (newName) {
        await fetch(`/api/categories/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newName })
        });
        location.reload();
      }
    });
  });

  // Move up/down
  document.querySelectorAll(".move-up, .move-down").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      const dir = btn.classList.contains("move-up") ? "up" : "down";
      await fetch(`/api/categories/${id}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction: dir })
      });
      location.reload();
    });
  });

  // Toggle availability
  document.querySelectorAll(".toggle").forEach(btn => {
    btn.addEventListener("click", async () => {
      const id = btn.dataset.id;
      await fetch(`/api/categories/${id}/toggle`, { method: "POST" });
      location.reload();
    });
  });


  } catch (err) {
    //...
  } 
}
