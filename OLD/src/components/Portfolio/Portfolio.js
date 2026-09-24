import './Portfolio.css';
import portfolioTemplate from './Portfolio.ejs';

export async function renderPortfolio() {

  // Get data needed
  const [ skills ] = await Promise.all([
        fetch("/api/skills",  { credentials: "include" }).then(r=>r.json()),
  ]);

  window.state.skills = skills;

  // Render main template into #main
  const html = portfolioTemplate({
    user: window.state.user,
    // TODO
  });
  document.getElementById("main").innerHTML = html;

  // Add skills
  /*
    <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Loops</span>
    <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Conditionals</span>
    <span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Functions</span>
    <span class="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Vectors</span>
  */
  const skills_element = document.getElementById("skills");
  if(skills && skills.length > 0) {
    skills.forEach(skill => {
      const span = document.createElement("span");
      span.className = "px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm";
      span.textContent = skill.skill_name;
      skills_element.appendChild(span);
    });
  }

  // Title text
  const title_text_element = document.getElementById("title_text");
  let title_text_element_html = "";
  
  // Add cursus
  if(window.state && window.state.user_selected_types && window.state.user_selected_types.length > 0) {
    window.state.user_selected_types.forEach(type => {
      title_text_element_html += type.type + " Explorer | ";   
    });
  }
  // Exercises Solved
  let sum = 0;
  const contributions = window.state.contributions;

  // pick your cutoff date
  // const cutoff = "2025-03-25";

  // sum all values where date >= cutoff
  sum = Object.entries(contributions)
  // .filter(([date, _]) => date >= cutoff)
  .reduce((acc, [_, val]) => acc + val, 0);

  title_text_element.innerHTML = title_text_element_html + sum + " Exercises done"; 

}
