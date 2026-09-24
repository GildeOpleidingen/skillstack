import './Login.css';
import loginTemplate from './Login.ejs';

// Login component
export async function renderLogin() {
  const main = document.getElementById("main");
  // TODO use the ejs 
  // TODO use style
  main.innerHTML = `
    <div class="login-page">
      <h2>Login</h2>
      <a href="/login/github" class="btn">Login with GitHub</a>
    </div>
  `;

  // Render main template into #main
  const html = loginTemplate();
  document.getElementById("main").innerHTML = html;
}