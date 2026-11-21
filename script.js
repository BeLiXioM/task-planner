const tasks =[];

const taskForm = document.querySelector("#task-form");
const taskTitleInput = document.querySelector("#task-title");
const taskListElement = document.querySelector("#task-list");
const taskErrorElement = document.querySelector("#task-error");
const taskCountElement = document.querySelector("#task-count");
const taskFilterSelect = document.querySelector("#task-filter");

function handleTaskSubmit(event) {
  event.preventDefault();
  const title = taskTitleInput.value.trim();

  if (!title) {
    taskErrorElement.textContent = "Введите название задачи";
    return;
  }

  taskErrorElement.textContent = "";

  const task = {
    id: crypto.randomUUID(),
    title: title,
    completed: false
  }

  tasks.push(task);
  saveTasks();
  renderTasks();
  taskTitleInput.value = "";
  taskTitleInput.focus();
}

function renderTasks(){
    taskListElement.textContent = "";

    taskCountElement.textContent = `Осталось задач: ${countActiveTasks(tasks)}`;
    const visibleTasks = filterTasks(tasks, taskFilterSelect.value);

   if (visibleTasks.length === 0) {
  const li = document.createElement("li");

  if (tasks.length === 0) {
    li.textContent = "Задач пока нет";
  } else {
    li.textContent = "Нет задач для выбранного фильтра";
  }

  taskListElement.append(li);
  return;
}
    

    for (const task of visibleTasks){
        const li = document.createElement("li");
        const checkbox = document.createElement("input");
        const titleElement = document.createElement("span");
        const deleteButton = document.createElement("button");
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.taskId = task.id;
        deleteButton.type = "button";
        deleteButton.textContent = "Удалить";
        checkbox.dataset.action = "toggle";
        checkbox.dataset.taskId = task.id;
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        titleElement.textContent = task.title;
        if (task.completed){
            titleElement.classList.add("task-completed");
        }
        li.append(checkbox, titleElement, deleteButton);
        taskListElement.append(li);
      
    }
}

taskFilterSelect.addEventListener("change", () => {
  saveTaskFilter();
  renderTasks();
});

function isValidTask(task){
  if (task === null || typeof task !== "object"){
    return false;
  }
  else {
    return typeof task.id === "string" && typeof task.title === "string" && typeof task.completed === "boolean";
  }
}

taskListElement.addEventListener("click", (event) => {
  if (event.target.dataset.action === "delete"){
            deleteTask(event.target.dataset.taskId);
        }
});

function setTaskCompleted(taskId, completed){
    const task = tasks.find(item => item.id === taskId);
    if (task) {
  task.completed = completed;
  saveTasks();
  renderTasks();
}
}

taskListElement.addEventListener("change", (event) => {
    if (event.target.dataset.action === "toggle"){
        setTaskCompleted(event.target.dataset.taskId, event.target.checked);
    }
})

function countActiveTasks(tasks){
    return tasks.filter(task => !task.completed).length;
}

function deleteTask(taskId){
     const index = tasks.findIndex(task => task.id === taskId);
     if (index !== -1) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }
}

function saveTasks(){
  localStorage.setItem("plannerTasks", JSON.stringify(tasks));
}

function restoreTasks(){
  const savedTasksJSON = localStorage.getItem("plannerTasks");
  if ( savedTasksJSON === null){
    return;
  }
  try {
    const savedTasks = JSON.parse(savedTasksJSON);
    if (!Array.isArray(savedTasks)){
      throw new Error("Ожидался массив задач");
    }
    for (const task of savedTasks){
      if (!isValidTask(task)){
        throw new Error("Некорректные данные задачи!");
      }
    }
    tasks.length = 0;
    for (const task of savedTasks){
      tasks.push(task);
    }
  }
  catch {
    console.error("Не удалось восстановить задачи");
  }
}

function filterTasks(tasks, status){
  if (status === "all"){
    return tasks;
  }
  if (status === "active"){
    return tasks.filter( task => !task.completed);
    }
  if (status === "completed"){
    return tasks.filter( task => task.completed);
  }  
  return tasks;
  }

  function saveTaskFilter(){
    localStorage.setItem("plannerFilter", taskFilterSelect.value);
  }

  function restoreTaskFilter(){
    const savedFilter = localStorage.getItem("plannerFilter");
    if (savedFilter === "all" || savedFilter === "active" || savedFilter === "completed"){
      taskFilterSelect.value = savedFilter;
    }
  }

restoreTaskFilter();
restoreTasks();
renderTasks();

taskForm.addEventListener("submit", handleTaskSubmit);
