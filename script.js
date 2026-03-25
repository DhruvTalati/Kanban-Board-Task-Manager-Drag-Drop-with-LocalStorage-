let taskData = {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");

const coloums = [todo, progress, done];
let dragElement = null;

function updateStorage() {
  coloums.forEach((col) => {
    const tasks = col.querySelectorAll(".task");

    taskData[col.id] = Array.from(tasks).map((t) => {
      return {
        title: t.querySelector("h2").innerText,
        desc: t.querySelector("p").innerText,
      };
    });
  });

  localStorage.setItem("tasks", JSON.stringify(taskData));
}

if (localStorage.getItem("tasks")) {
  const data = JSON.parse(localStorage.getItem("tasks"));

  for (const col in data) {
    const coloumn = document.querySelector(`#${col}`);

    data[col].forEach((task) => {
      const div = document.createElement("div");

      div.classList.add("task");
      div.setAttribute("draggable", "true");

      div.innerHTML = `
        <h2>${task.title}</h2>
        <p>${task.desc}</p>
        <button>Delete</button>`;

      div.addEventListener("dragstart", () => {
        dragElement = div;
      });

      const deleteBtn = div.querySelector("button");
      deleteBtn.addEventListener("click", () => {
        div.remove();
        updateStorage();
        coloums.forEach((col) => {
          const tasks = col.querySelectorAll(".task");
          const count = col.querySelector(".right");

          count.innerHTML = ` Count - ${tasks.length}`;
        });
      });

      coloumn.appendChild(div);
    });
  }
}
coloums.forEach((col) => {
  const tasks = col.querySelectorAll(".task");
  const count = col.querySelector(".right");

  count.innerHTML = ` Count - ${tasks.length}`;
});

const tasks = document.querySelectorAll(".task");

tasks.forEach((task) => {
  task.addEventListener("dragstart", () => {
    dragElement = task;
  });
});

function draggedOnTask(column) {
  column.addEventListener("dragenter", () => {
    column.classList.add("hover-over");
  });

  column.addEventListener("dragleave", () => {
    column.classList.remove("hover-over");
  });

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();
    column.appendChild(dragElement);
    column.classList.remove("hover-over");

    coloums.forEach((col) => {
      const tasks = col.querySelectorAll(".task");
      const count = col.querySelector(".right");

      count.innerHTML = ` ${tasks.length}`;
    });

    updateStorage();
  });
}

draggedOnTask(todo);
draggedOnTask(progress);
draggedOnTask(done);

// Modal Logic

const modal = document.querySelector(".modal");
const toggleBtn = document.querySelector("#toggle-modal");
const bg = document.querySelector(".modal .bg");
const addTaskBtn = document.querySelector("#add-new-task");

toggleBtn.addEventListener("click", (e) => {
  e.preventDefault();
  modal.classList.toggle("active");
});

bg.addEventListener("click", (e) => {
  e.preventDefault();
  modal.classList.remove("active");
});

addTaskBtn.addEventListener("click", () => {
  const taskTitle = document.querySelector("#task-title-input").value;
  const taskDesc = document.querySelector("#task-desc-input").value;
  const div = document.createElement("div");

  div.classList.add("task");
  div.setAttribute("draggable", "true");

  div.innerHTML = `
  <h2>${taskTitle}</h2>
  <p>${taskDesc}</p>
  <button>Delete</button>
  `;
  document.querySelector("#task-title-input").value = "";
  document.querySelector("#task-desc-input").value = "";

  todo.appendChild(div);

  coloums.forEach((col) => {
    const tasks = col.querySelectorAll(".task");
    const count = col.querySelector(".right");

    taskData[col.id] = Array.from(tasks).map((t) => {
      return {
        title: t.querySelector("h2").innerText,
        desc: t.querySelector("p").innerText,
      };
    });

    localStorage.setItem("tasks", JSON.stringify(taskData));

    count.innerText = tasks.length;
  });

  div.addEventListener("dragstart", () => {
    dragElement = div;
  });

  modal.classList.remove("active");
});
