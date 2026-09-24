
export function typeLine(term, text, delay = 30) {
  return new Promise(resolve => {
    let i = 0;
    function typeChar() {
      if (i < text.length) {
        term.write(text[i]);
        i++;
        setTimeout(typeChar, delay);
      } else {
        term.write('\r\n'); // Move to next line after typing is done
        resolve();
      }
    }
    typeChar();
  });
}

export function createStar(x, y) {
  const star = document.createElement('div');
  star.className = 'star';
  star.style.left = `${x}px`;
  star.style.top = `${y}px`;
  document.getElementById('stars-container').appendChild(star);

  setTimeout(() => star.remove(), 1000); // Clean up
}

export function launchStars() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  for (let i = 0; i < 20; i++) {
    const x = Math.random() * width;
    const y = height / 2 + (Math.random() * 100 - 50);
    setTimeout(() => createStar(x, y), i * 50);
  }
}

export async function loadTemplate(templatePath, placeholder) {
  const res = await fetch(templatePath);
  const html = await res.text();
  document.getElementById(placeholder).innerHTML = html;
}

export async function getData(forceRefresh = false) {
  // Only fetch if we don't have data or forced refresh
  if (!window.state.user || forceRefresh) {
    try {
      const [ user, tasks, score, leaderboard, user_selected_typesO, contributions ] = await Promise.all([
        fetch("/api/user",  { credentials:"include" }).then(r=>r.json()),
        fetch("/api/tasks", { credentials:"include" }).then(r=>r.json()),
        fetch("/api/score", { credentials:"include" }).then(r=>r.json()),
        fetch("/api/leaderboard", {credentials:"include"}).then(r=>r.json()),
        fetch("/api/user_selected_types", {credentials:"include"}).then(r=>r.json()),
        fetch("/api/contributions", {credentials: "include"}).then(r=>r.json())
      ]);

      // Cache results
      window.state.refresh = false;
      window.state.user = user;
      window.state.tasks = tasks;
      window.state.score = score;
      window.state.leaderboard = leaderboard;
      window.state.user_selected_types = Array.isArray(user_selected_typesO) ? user_selected_typesO : [user_selected_typesO];
      window.state.contributions = contributions;
      window.state.showPopup = false;
    } catch(err) {
      console.error("Failed to load data:", err);
    }
  }
}


export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
    credentials: "include" // keep session cookie
  });

  if (!res.ok) throw new Error("Upload failed");
  return await res.json(); // { url: "/uploads/123/file_16940234.png" }
}

