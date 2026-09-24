import './AdminExercise.css';
import adminExerciseTemplate from './AdminExercise.ejs';
import {uploadFile} from '../../../utils/utils.js'

// Fetch exercises for a category (main or sub)
async function fetchExercise(exerciseId) {
  try {
    const res = await fetch(`/api/exercise?id=${exerciseId}`, { credentials: 'include' });
    const data = await res.json();

    return data;
  } catch (err) {
    console.error('Error rendering admin exercises:', err);
    return err;
  }
}


export async function renderAdminExercise(exercise_id, category_id) {
  try {
    const exercise = await fetchExercise(exercise_id);
    const categories = [];
    const blocks = exercise.blocks;
    console.log('Exercise: ', exercise);
    
    const html = adminExerciseTemplate({
      user: window.state.user,
      exercise,
      categories,
      blocks
    });
    document.getElementById('main').innerHTML = html;



    const container = document.getElementById("blocks-container");

  // Add new block
  document.querySelectorAll(".add-block").forEach(btn => {
    btn.addEventListener("click", () => {
      const type = btn.dataset.type;
      const block = document.createElement("div");
      block.className = "block-item border rounded p-4 bg-gray-50";
      block.innerHTML = `
        <div class="flex justify-between items-center mb-2">
          <span class="font-medium capitalize">${type} block</span>
          <div class="flex gap-2">
            <button class="move-up text-gray-500">⬆</button>
            <button class="move-down text-gray-500">⬇</button>
            <button class="delete text-red-500">❌</button>
          </div>
        </div>
        ${
          type === "text"
            ? `<div class="quill-editor block-content w-full border rounded p-2 h-24"></div>`
          : type === "image"
            ? `<input type="url" class="block-content w-full border rounded p-2" placeholder="Image URL">`
          : type === "video"
            ? `<input type="url" class="block-content w-full border rounded p-2" placeholder="Video URL (embed)">`
            : type === "test"
              ? `
                <div class="block-content grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div>
                    <label class="text-sm text-gray-600">Input:</label>
                    <textarea class="test-input w-full border rounded p-2 h-24" placeholder="Enter input..."></textarea>
                  </div>
                  <div>
                    <label class="text-sm text-gray-600">Output:</label>
                    <textarea class="test-output w-full border rounded p-2 h-24" placeholder="Enter expected output..."></textarea>
                  </div>
                </div>
                `
          : `<textarea class="block-content w-full border rounded p-2 h-24" placeholder="Write test case..."></textarea>`

        }
      `;
      container.appendChild(block);

      // ✅ If it's a text block, initialize Quill on it
      if (type === "text") {
        const editorEl = block.querySelector(".quill-editor");
        const quill = new Quill(editorEl, {
          theme: "snow",
          placeholder: "Write here...",
                placeholder: "Write here...",
            modules: {
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ indent: "-1" }, { indent: "+1" }],
                [{ color: [] }, { background: [] }],
                [{ align: [] }],
                ["link", "image", "video", "code-block"],
               // [ "code-block"],
                ["clean"]
              ]
            },
        });

        quill.getModule("toolbar").addHandler("image", () => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";
          input.onchange = async () => {
            const file = input.files[0];
            const { url } = await uploadFile(file);
            const range = quill.getSelection();
            quill.insertEmbed(range.index, "image", url);
          };
          input.click();
        });

        editorEl._quill = quill; // keep reference so you can extract content later
      }
    });
  });

  // Delegate actions
  container.addEventListener("click", (e) => {
    const block = e.target.closest(".block-item");
    if (!block) return;

    if (e.target.classList.contains("delete")) {
      block.remove();
    } else if (e.target.classList.contains("move-up")) {
      const prev = block.previousElementSibling;
      if (prev) container.insertBefore(block, prev);
    } else if (e.target.classList.contains("move-down")) {
      const next = block.nextElementSibling;
      if (next) container.insertBefore(next, block);
    }
  });

  // Add editor
  document.querySelectorAll(".quill-editor").forEach((el) => {
    const q = new Quill(el, {
      theme: "snow",
      placeholder: "Write here...",
            modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ["link", "image", "video", "code-block"],
          // [ "code-block"],
          ["clean"]
        ]
      },
    });

    q.getModule("toolbar").addHandler("image", () => {
        const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async () => {
        const file = input.files[0];
        const { url } = await uploadFile(file);
        const range = quill.getSelection();
        quill.insertEmbed(range.index, "image", url);
      };
      input.click();
    });
    // Store reference for saving later
    el._quill = q;
  });

  // Save Exercise
  document.getElementById("save-exercise").addEventListener("click", () => {
    const blocks = [];
    document.querySelectorAll(".block-item").forEach((block) => {
      const type = block.querySelector("span.font-medium").innerText.split(" ")[0].toLowerCase();

      let content;
      if (type === "text") {
        content = block.querySelector(".quill-editor")._quill.root.innerHTML;
      } else if (type === "test") {
        const inputVal = block.querySelector(".test-input").value;
        const outputVal = block.querySelector(".test-output").value;
        content = `${inputVal}|||${outputVal}`;
      } else {
        content = block.querySelector(".block-content").value;
      }

      blocks.push({
        block_type: type,
        content: content,
      });
    });

    fetch(`/api/exercise/${document.querySelector("[name='exercise_id']").value}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        id: document.querySelector("[name='exercise_id']").value,
        title: document.querySelector("[name='title']").value,
        sub_id: document.querySelector("[name='sub_id']").value,      
        blocks
      }),
      credentials: "include",
    });

    alert("Exercise saved successfully!");
  });

      
  } catch (e) {
    console.error(e);
  }
}

