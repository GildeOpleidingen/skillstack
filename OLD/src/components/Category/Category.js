import './Category.css';

export async function renderCategories(categoryId = null) {
  const user = window.state.user;

  // Fetch categories & types
  const resCategories = await fetch("/api/categories", {
    credentials: "include"
  });
  const { categories, types } = await resCategories.json();

  // Find category if selected
  let category = null;
  if (categoryId) {
    category = categories.find(c => String(c.id) === String(categoryId));
  }

  // Also lookup type info for this category
  let type = null;
  if (category) {
    type = types.find(t => t.id === category.type_id);
  }

  document.getElementById("main").innerHTML = `
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded shadow mb-6">
      <!-- Left: Welcome -->
      <div class="text-xl font-semibold text-gray-800">
        ${type ? `${type.icon} ${type.name}` : ""} 
        ${category ? `› ${category.icon} ${category.name}` : "📂 Challenges"}
      </div>

      <!-- Right: User Info + Logout -->
      <div class="flex items-center space-x-4 mt-4 md:mt-0">
        <div class="text-gray-700">👤 ${user.username}</div>
        <button id="logout-btn" class="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition">
          Logout
        </button>
      </div>
    </div>

    <!-- Challenge list -->
    <div id="challenges-list" class="space-y-4 max-w-5xl mx-auto mt-6"></div>
  `;

  // Give the browser a chance to render
  await new Promise(requestAnimationFrame);


  // Fetch exercises for this category
  let url = "/api/exercise";
  if (categoryId) {
    url += `?category_id=${categoryId}`;
  }

  const data = await fetch(url, { credentials: "include" }).then(r => r.json());

  const list = document.getElementById("challenges-list");


  let isActiveCount = 0;

  data.forEach(async ch => {
    const isCompleted = ch.status === 'Accepted';
    const isActive = ch.is_active;
    if (isActive) isActiveCount++;
    const item = document.createElement('div');
    item.classList.add('challenge-item');

    item.innerHTML = `
      <div class="bg-white border border-gray-200 shadow-sm rounded-xl p-5 flex items-center justify-between ${isCompleted ? 'opacity-70' : ''}">
        <!-- Left: Number -->
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-blue-100 text-blue-600 font-bold flex items-center justify-center rounded-full">
            ${ch.sub_id}
          </div>
          <div>
            <h3 class="text-base font-semibold text-gray-800">
              ${ch.title}
              ${
                isCompleted
                  ? `<span class="ml-2 inline-block bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-md">✅ Completed</span>`
                  : ""
              }
            </h3>
            <p class="text-sm text-gray-500">Score: ${ch.score}</p>
          </div>
        </div>

        <!-- Right: Lock or Start -->
        <div>
          ${
            isCompleted
              ? `<span class="text-gray-400 text-xl" title="Completed"><a href="/exercise/${categoryId}/${ch.id}" class="nav-link bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-md font-medium shadow-sm transition">View</a></span>`
              : `<a href="/exercise/${categoryId}/${ch.id}" class="nav-link bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded-md font-medium shadow-sm transition">Start</a>`
          }
        </div>
      </div>
    `;
    // Give the browser a chance to render
    await new Promise(requestAnimationFrame);

    if(list && isActive) {      
      list.appendChild(item);
    }


  });

  if (list && !data.length || isActiveCount == 0) {
    list.innerHTML = `<p class="text-gray-500 text-center">Nothing found in this category.</p>`;
    return;
  }
}
