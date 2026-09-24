import { getData } from './utils/utils.js';

/* sidebar.js */
export async function renderSidebar() { 
  
  await getData(window.state.refresh);

  async function loadSidebar() {
    const res = await fetch("/api/categories", { credentials: "include" });
    const data = await res.json();
    const { types, categories } = data;

    // Recursively build children
    function buildChildren(cats, parentId) {
      return cats
        .filter(cat => Number(cat.parent_id) === parentId)
        .map(cat => ({
          ...cat,
          children: buildChildren(cats, cat.id)
        }));
    }

    // Build tree with types as root
    function buildTree(types, cats) {
      return types.map(type => {
        const children = cats
          .filter(cat => Number(cat.type_id) === type.id && !cat.parent_id)
          .map(cat => ({
            ...cat,
            children: buildChildren(cats, cat.id)
          }));

        return {
          id: `type-${type.id}`,
          name: type.name,
          icon: type.icon,
          children
        };
      });
    }

    const tree = buildTree(types, categories);

    // Render tree recursively
    function renderTree(nodes, level = 0) {
      return nodes.map(node => {
        const hasChildren = node.children && node.children.length > 0;

        if (hasChildren) {
          return `
              <div class="tree-node flex flex-col">
                <button class="tree-toggle flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-800 transition w-full text-left" data-id="${node.id}">
                  <span class="arrow inline-block transition-transform">▶</span>
                  ${node.icon || ""} ${node.name}
                </button>
                <div class="tree-children hidden flex flex-col" style="margin-left: ${level * 22}px;">
                  ${renderTree(node.children, level + 1)}
                </div>
              </div>
          `;
        } else {
          return `
          <div>
            <a href="/category/${node.id}" class="nav-link flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-gray-800 transition">
              ${node.icon || ""} ${node.name}
            </a>
          </div>`;
        }
      }).join("");
    }

    const categoryTreeHtml = renderTree(tree);

    // ---- ADMIN MENU (only if admin or teacher) ----
    let adminHtml = "";
    if (window.state.user && (window.state.user.role === "admin" || window.state.user.role === "teacher")) {
      adminHtml = `
        <div class="tree-node flex flex-col">
          <button class="tree-toggle flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-800 transition w-full text-left">
            <span class="arrow inline-block transition-transform">▶</span>
              Administration
          </button>
          <div class="tree-children hidden flex flex-col" style="margin-left: 0;">
               <!--<a href="/admin/categories" class="nav-link flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-gray-800 transition">
                  📂 Categories
               </a>-->
              <a href="/admin/exercises" class="nav-link flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-gray-800 transition">
                 📝 Exercises
              </a>
          </div>
        </div>`;
    }

    // Inject sidebar
    document.getElementById("sidebar").innerHTML = `
      <div class="text-xl font-bold text-white flex items-center space-x-2">
        <span>💻</span><span>CodeFolio</span>
      </div>

      <nav class="flex flex-col gap-2">
        <a href="/dashboard" class="nav-link flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-gray-800 transition">
          🏠 <span>Start</span>
        </a>
        <a href="/portfolio" class="nav-link flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-gray-800 transition">
          📁 <span>Your portfolio</span>
        </a>

        ${adminHtml}

        <h2 class="text-xs text-gray-400 mt-4 mb-1 px-3 uppercase tracking-wide">Academy</h2>
        ${categoryTreeHtml}
      </nav>

      <div class="absolute bottom-4 left-5 text-xs text-gray-400">
        ${window.version || ""}
      </div>
    `;

    // Expand/collapse with arrow rotation
    document.querySelectorAll(".tree-toggle").forEach(btn => {
      btn.addEventListener("click", () => {
        const treeNode = btn.closest(".tree-node");
        const childrenContainer = treeNode.querySelector(".tree-children");
        const arrow = btn.querySelector(".arrow");
        if (!childrenContainer) return;

        const isHidden = childrenContainer.classList.contains("hidden");
        childrenContainer.classList.toggle("hidden", !isHidden);
        arrow.style.transform = isHidden ? "rotate(90deg)" : "rotate(0deg)";
      });
    });
  }

  loadSidebar();
}
