const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const filterBtns = document.querySelectorAll(".filter");
const themeToggle = document.getElementById("toggle-theme");
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function renderTasks(filter = "all", search = "") {
  taskList.innerHTML = "";
  tasks
    .filter(task => {
      if (filter === "completed") return task.completed;
      if (filter === "pending") return !task.completed;
      return true;
    })
    .filter(task => task.text.toLowerCase().includes(search.toLowerCase()))
    .forEach((task, index) => {
      const li = document.createElement("li");
      if (task.completed) li.classList.add("completed");

      const span = document.createElement("span");
      span.textContent = task.text;
      span.className = "task-text";
      span.contentEditable = false;
      span.addEventListener("click", () => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks(filter, search);
      });

      // Edit task
      const editBtn = document.createElement("button");
      editBtn.textContent = "edit";
      editBtn.addEventListener("click", () => {
        if (span.isContentEditable) {
          span.contentEditable = false;
          tasks[index].text = span.textContent.trim();
          saveTasks();
        } else {
          span.contentEditable = true;
          span.focus();
        }
      });
      const delBtn = document.createElement("button");
      delBtn.textContent = "delete";
      delBtn.addEventListener("click", () => {
        tasks.splice(index, 1);
        saveTasks();
        renderTasks(filter, search);
      });
      li.appendChild(span);
      li.appendChild(editBtn);
      li.appendChild(delBtn);
      taskList.appendChild(li);
    });
}
addTaskBtn.addEventListener("click", () => {
  const text = taskInput.value.trim();
  if (text !== "") {
    tasks.push({ text, completed: false });
    saveTasks();
    taskInput.value = "";
    renderTasks();
  }
});
taskInput.addEventListener("keypress", e => {
  if (e.key === "Enter") addTaskBtn.click();
});
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderTasks(btn.dataset.filter, searchInput.value);
  });
});
searchInput.addEventListener("input", () => {
  const activeFilter = document.querySelector(".filter.active").dataset.filter;
  renderTasks(activeFilter, searchInput.value);
});
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});
renderTasks();