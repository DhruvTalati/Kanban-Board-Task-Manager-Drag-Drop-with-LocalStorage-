let taskData = {};

const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");
const searchInput = document.querySelector("#search-task");
const priorityFilter = document.querySelector("#priority-filter");

const totalCount = document.querySelector("#total-count");
const todoCount = document.querySelector("#todo-count");
const progressCount = document.querySelector("#progress-count");
const doneCount = document.querySelector("#done-count");
const themeToggle = document.querySelector("#theme-toggle");

const taskViewModal = document.querySelector(".task-view-modal");
const taskViewBg = document.querySelector(".task-view-bg");

const viewTitle = document.querySelector("#view-title");
const viewDesc = document.querySelector("#view-desc");
const viewPriority = document.querySelector("#view-priority");
const viewDate = document.querySelector("#view-date");
const closeView = document.querySelector("#close-view");

const columns = [todo, progress, done];
let dragElement = null;
let editTask = null;
let isEditMode = false;

function updateStorage() {
  columns.forEach((col) => {
    const tasks = col.querySelectorAll(".task");

    taskData[col.id] = Array.from(tasks).map((t) => {
      return {
        title: t.querySelector("h2").innerText,
        desc: t.querySelector("p").innerText,
        priority: t.querySelector(".priority").innerText,
        date: t.querySelector(".due-date").innerText.replace("📅 Due: ", ""),
      };
    });
  });

  localStorage.setItem("tasks", JSON.stringify(taskData));
}

function openTaskView(task) {
  viewTitle.innerText = task.querySelector("h2").innerText;
  viewDesc.innerText = task.querySelector("p").innerText;

  const priority = task.querySelector(".priority").innerText;
  const priorityClass = task.querySelector(".priority").classList[1];

  viewPriority.innerText = priority;
  viewPriority.className = "priority " + priorityClass;

  viewDate.innerText = task.querySelector(".due-date").innerText;

  taskViewModal.classList.add("active");
}

function updateDashboardStats() {
  const todoTasks = todo.querySelectorAll(".task").length;
  const progressTasks = progress.querySelectorAll(".task").length;
  const doneTasks = done.querySelectorAll(".task").length;

  todoCount.innerText = todoTasks;
  progressCount.innerText = progressTasks;
  doneCount.innerText = doneTasks;
  totalCount.innerText = todoTasks + progressTasks + doneTasks;
}

if (localStorage.getItem("tasks")) {
  const data = JSON.parse(localStorage.getItem("tasks"));

  for (const col in data) {
    const column = document.querySelector(`#${col}`);

    data[col].forEach((task) => {
      const div = document.createElement("div");

      div.classList.add("task");
      div.setAttribute("draggable", "true");

      div.innerHTML = `
        <h2>${task.title}</h2>
        <span class="priority ${(task.priority || "Low").toLowerCase()}">${task.priority || "Low"}</span>
        <p>${task.desc}</p>

        <small class="due-date">📅 Due: ${task.date || "No Date"}</small>
      <div class="task-actions">
        <button class="edit-btn">Edit</button>
         <button class="delete-btn">Delete</button>
      </div>`;

      div.addEventListener("dragstart", () => {
        dragElement = div;
      });

      //Delete Button

      const deleteBtn = div.querySelector(".delete-btn");
      deleteBtn.addEventListener("click", () => {
        div.remove();
        updateStorage();
        columns.forEach((col) => {
          const tasks = col.querySelectorAll(".task");
          const count = col.querySelector(".right");

          count.innerHTML = ` Count - ${tasks.length}`;
        });
        updateDashboardStats();
      });

      //Edit Button
      const editBtn = div.querySelector(".edit-btn");
      editBtn.addEventListener("click", () => {
        isEditMode = true;
        editTask = div;

        document.querySelector("#task-title-input").value =
          div.querySelector("h2").innerText;

        document.querySelector("#task-desc-input").value =
          div.querySelector("p").innerText;

        document.querySelector("#task-date").value = div
          .querySelector(".due-date")
          .innerText.replace("📅 Due: ", "");

        addTaskBtn.innerText = "Save Changes";

        modal.classList.add("active");
      });
      div.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") return;

        openTaskView(div);
      });

      column.appendChild(div);
    });
  }
  updateDashboardStats();
}
columns.forEach((col) => {
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

    columns.forEach((col) => {
      const tasks = col.querySelectorAll(".task");
      const count = col.querySelector(".right");

      count.innerHTML = ` ${tasks.length}`;
    });

    updateStorage();
    updateDashboardStats();
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
  const taskPriority = document.querySelector("#task-priority").value;
  const taskDate = document.querySelector("#task-date").value;

  if (isEditMode) {
    editTask.querySelector("h2").innerText = taskTitle;
    editTask.querySelector("p").innerText = taskDesc;
    editTask.querySelector(".due-date").innerText = "📅 Due: " + taskDate;
    editTask.querySelector(".priority").innerText = taskPriority;
    editTask.querySelector(".priority").className =
      "priority " + taskPriority.toLowerCase();

    isEditMode = false;
    editTask = null;

    addTaskBtn.innerText = "Add Task";

    document.querySelector("#task-title-input").value = "";
    document.querySelector("#task-desc-input").value = "";

    modal.classList.remove("active");

    updateStorage();
    updateDashboardStats();

    return;
  }

  const div = document.createElement("div");

  div.classList.add("task");
  div.setAttribute("draggable", "true");

  div.innerHTML = `
    <h2>${taskTitle}</h2>
    <span class="priority ${taskPriority.toLowerCase()}">
       ${taskPriority}
    </span>
    <p>${taskDesc}</p>

    <small class="due-date">📅 Due: ${taskDate}</small>

    <div class="task-actions">
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    </div>`;

  document.querySelector("#task-title-input").value = "";
  document.querySelector("#task-desc-input").value = "";

  todo.appendChild(div);
  div.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") return;
    console.log("task clicked");
    openTaskView(div);
  });

  const deleteBtn = div.querySelector(".delete-btn");

  deleteBtn.addEventListener("click", () => {
    div.remove();
    updateStorage();
    updateDashboardStats();
  });

  const editBtn = div.querySelector(".edit-btn");

  editBtn.addEventListener("click", () => {
    isEditMode = true;
    editTask = div;

    document.querySelector("#task-title-input").value =
      div.querySelector("h2").innerText;

    document.querySelector("#task-desc-input").value =
      div.querySelector("p").innerText;

    document.querySelector("#task-priority").value =
      div.querySelector(".priority").innerText;

    addTaskBtn.innerText = "Save Changes";

    modal.classList.add("active");
  });

  columns.forEach((col) => {
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

searchInput.addEventListener("input", () => {
  const searchText = searchInput.value.toLowerCase();

  const allTasks = document.querySelectorAll(".task");

  allTasks.forEach((task) => {
    const title = task.querySelector("h2").innerText.toLowerCase();
    const desc = task.querySelector("p").innerText.toLowerCase();

    if (title.includes(searchText) || desc.includes(searchText)) {
      task.style.display = "flex";
    } else {
      task.style.display = "none";
    }
  });
});
updateDashboardStats();

const white = document.querySelector(".left");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");

  if (document.body.classList.contains("light-mode")) {
    themeToggle.innerText = "🌙 Dark";
    white.style.color = "white";
  } else {
    themeToggle.innerText = "☀️ Light";
  }

  if (document.body.classList.contains("light-mode")) {
    localStorage.setItem("theme", "light");
  } else {
    localStorage.setItem("theme", "dark");
  }
});

if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light-mode");
  themeToggle.innerText = "🌙 Dark";
}

priorityFilter.addEventListener("change", () => {
  const selected = priorityFilter.value;

  const allTasks = document.querySelectorAll(".task");

  allTasks.forEach((task) => {
    const badge = task.querySelector(".priority");

    if (selected === "all") {
      task.style.display = "flex";
    } else if (badge.classList.contains(selected)) {
      task.style.display = "flex";
    } else {
      task.style.display = "none";
    }
  });
});

closeView.addEventListener("click", () => {
  taskViewModal.classList.remove("active");
});

taskViewBg.addEventListener("click", () => {
  taskViewModal.classList.remove("active");
});
