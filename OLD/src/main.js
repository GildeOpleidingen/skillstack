import './styles/style.css';
import { renderDashboard } from './components/Dashboard/Dashboard.js';
import { renderExercise } from './components/Exercise/Exercise.js';
import { renderSidebar } from './sidebar.js';
import { renderPortfolio } from './components/Portfolio/Portfolio.js';
import { renderCategories } from './components/Category/Category.js';
import { renderLogin } from './components/Login/Login.js'; // new login component
import { renderAdminCategories } from './components/Admin/Categories/AdminCategories.js';
import { renderAdminExercises }  from './components/Admin/Exercises/AdminExercises.js';
import { renderAdminExercise }  from './components/Admin/Exercise/AdminExercise.js';

// global state (in a separate module maybe)
window.state = {
  refresh: true, // First time
  user: null,
  tasks: null,
  score: null,
  leaderboard: null,
  user_selected_types: null,
  contributions: null,
  skills: null,
};

function isAdmin() {
  return window.state.user && 
         (window.state.user.role === 'admin' || window.state.user.role === 'teacher');
}

function renderForbidden() {
  const main = document.getElementById("main");
  main.innerHTML = `<h2 class="text-red-600">403 - Forbidden</h2><p>You don’t have access to this page.</p>`;
}

// Array routes
const routes = [
  { path: /^\/login$/, handler: renderLogin }, // login route
  { path: /^\/logout$/, handler: handleLogout}, // logout route
  { path: /^\/(dashboard)?$/, handler: renderDashboard },
  { path: /^\/portfolio$/, handler: renderPortfolio },
  { path: /^\/category\/(\d+)/, handler: ([_, categoryId]) => renderCategories(categoryId) },
  { path: /^\/exercise\/(\d+)\/(\d+)/, handler: ([_, categoryId, exerciseId]) => renderExercise(exerciseId, categoryId) },
  

  // Admin routes (static, no lazy loading)
  { path: /^\/admin\/categories$/, handler: () => {
    if (!isAdmin()) return renderForbidden(); 
    return renderAdminCategories();
  }},
  { path: /^\/admin\/exercises$/, handler: () => {
    if (!isAdmin()) return renderForbidden();
    return renderAdminExercises();
  }},
  { path: /^\/admin\/exercise\/(\d+)\/(\d+)/, handler: ([_, categoryId, exerciseId]) => {
    if (!isAdmin()) return renderForbidden();
    return renderAdminExercise(exerciseId, categoryId);
  }},
  // Admin routes (lazy loaded) NOT WORKING???
  // { path: /^\/admin\/categories$/, handler: async () => {
  //     if (!isAdmin()) return renderForbidden(); 
  //     const { renderAdminCategories } = await import('./components/Admin/Categories/AdminCategories.js');
  //     return renderAdminCategories();
  //   }},
  // { path: /^\/admin\/exercises$/, handler: async () => {
  //     if (!isAdmin()) return renderForbidden();
  //     const { renderAdminExercises } = await import('./components/Admin/Exercises/AdminExercises.js');
  //     return renderAdminExercises();
  //   }},
  // { path: /^\/admin\/exercise\/(\d+)\/(\d+)/, handler: async ([_, categoryId, exerciseId]) => {
  //     if (!isAdmin()) return renderForbidden();
  //     const { renderAdminExercise } = await import('./components/Admin/Exercise/AdminExercise.js');
  //     return renderAdminExercise(exerciseId, categoryId);
  //   }},
];

async function handleLogout() {
  try {
    // Call backend to delete the session
    const res = await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    
    if (!res.ok) {
      console.error('Logout failed');
    }

    // Clear user state
    window.state.user = null;

    // Redirect to login page SPA-style
    history.replaceState({}, '', '/login');
    await loadPage('/login');
  } catch (err) {
    console.error('Logout error:', err);
  }
}

async function checkSession(forceRefresh = false) {
  // If we already have user info and no forceRefresh, skip API call
  if (!forceRefresh && window.state.user && !window.state.user.error) {
    return true;
  }

  try {
    const res = await fetch('/api/user', { credentials: 'include' });

    // Unauthorized -> redirect to login
    if (res.status === 401 || res.status === 403) {
      history.replaceState({}, '', '/login');
      await loadPage('/login');
      return false;
    }

    const user = await res.json();

    // If API returned nothing or invalid, redirect to login
    if (!user || Object.keys(user).length === 0) {
      history.replaceState({}, '', '/login');
      await loadPage('/login');
      return false;
    }

    // Save user to global state
    window.state.user = user;
    return true;

  } catch (err) {
    console.error("Session check failed:", err);
    history.replaceState({}, '', '/login');
    await loadPage('/login');
    return false;
  }
}

// SPA navigation
async function loadPage(path) {
  const main = document.getElementById("main");

  // Show loading spinner
  main.innerHTML = `<div class="loading-spinner">Loading...</div>`;

  // Stop polling if active
  if (window.pollTimer) {
    clearInterval(window.pollTimer);
    window.pollTimer = null;
  }

  const sidebar = document.getElementById("sidebar");
  if (path === '/login') {
    document.body.classList.add('login-page');
  } else {
    document.body.classList.remove('login-page');
  }

  // Check session before loading protected routes
  if (path !== '/login' && !(await checkSession())) {
    return; // loadPage called inside checkSession
  }

  try {
    for (const route of routes) {
      const match = path.match(route.path);
      if (match) {
        await route.handler(match);
        window.scrollTo({ top: 0, behavior: "smooth" }); // Optional UX
        // Show the page only after all layout adjustments
        document.body.classList.add("show");
        return;
      }
    }

    // No match: 404 fallback
    main.innerHTML = `<h2>404 - Page Not Found</h2>`;
  } catch (err) {
    console.error("loadPage error:", err);
    // Redirect to home if something breaks
    history.replaceState({}, "", "/");
    await loadPage("/login");
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await renderSidebar();
  initRouter();
  await loadPage(location.pathname);
});

document.addEventListener("click", (e) => {
  if (e.target.id === "logout-btn") {
    e.preventDefault();
    handleLogout();
  }
});

function initRouter() {
  document.body.addEventListener("click", (e) => {    
    const link = e.target.closest("a.nav-link");
    console.info('Clicked: ', link );
    if (link) {
      e.preventDefault();
      const path = link.getAttribute("href");
      history.pushState({}, "", path);
      loadPage(path);
    }
  });

  window.addEventListener("popstate", () => {
    loadPage(location.pathname);
  });
}
