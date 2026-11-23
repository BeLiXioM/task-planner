const tasks =[];

let editingTaskId = null;

const taskForm = document.querySelector("#task-form");
const taskTitleInput = document.querySelector("#task-title");
const taskListElement = document.querySelector("#task-list");
const taskErrorElement = document.querySelector("#task-error");
const taskCountElement = document.querySelector("#task-count");
const taskFilterSelect = document.querySelector("#task-filter");
const taskSubmitButton = document.querySelector("#task-button");
const cancelEditButton = document.querySelector("#cancel-edit");
const taskDateInput = document.querySelector("#task-date");

function handleTaskSubmit(event) {
  event.preventDefault();
  const title = taskTitleInput.value.trim();
  const dueDate = taskDateInput.value;

  if (!title) {
    taskErrorElement.textContent = "Введите название задачи";
    return;
  }

  taskErrorElement.textContent = "";

  if (editingTaskId === null){
    const task = {
    id: crypto.randomUUID(),
    title: title,
    completed: false,
    dueDate: dueDate
  }
    tasks.push(task);
  }
  else {
    const task = tasks.find(item => item.id === editingTaskId);
    if (task){
      task.title = title;
      task.dueDate = dueDate;
    }
  }
cancelEditButton.hidden = true;
  editingTaskId = null;
  taskSubmitButton.textContent = "Добавить";

  saveTasks();
  renderTasks();
  taskTitleInput.value = "";
  taskDateInput.value = "";
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
        const editButton = document.createElement("button");
        const dateElement = document.createElement("span");
        if (task.dueDate){
          dateElement.textContent = ` Срок: ${task.dueDate}`
        }
        else{
          dateElement.textContent = " Без срока";
        }
        editButton.type = "button";
        editButton.textContent = "Редактировать";
        editButton.dataset.action = "edit";
        editButton.dataset.taskId = task.id;
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.taskId = task.id;
        deleteButton.type = "button";
        const deleteSpan = document.createElement("span");
        deleteSpan.textContent = "Удалить";
        deleteButton.append(deleteSpan);
        checkbox.dataset.action = "toggle";
        checkbox.dataset.taskId = task.id;
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        titleElement.textContent = task.title;
        if (task.completed){
            titleElement.classList.add("task-completed");
        }
        li.append(checkbox, titleElement, dateElement, editButton ,deleteButton);
        taskListElement.append(li);
        if (isTaskOverdue(task)){
            dateElement.classList.add("task-overdue");
        }
      
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
   if (task.dueDate !== undefined && typeof task.dueDate !== "string"){
   return false; 
  }
  else {
    return typeof task.id === "string" && typeof task.title === "string" && typeof task.completed === "boolean";
  }
}

taskListElement.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) {
  return;
}
  if (button.dataset.action === "delete"){
            deleteTask(button.dataset.taskId);
        }
  else if (button.dataset.action === "edit"){
    startEditing(button.dataset.taskId);
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
      if (taskId === editingTaskId){
        cancelEditing();
      }
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

  function startEditing(taskId){
    const task = tasks.find(task => task.id === taskId);
    if (!task){
      return;
    }
    if (typeof task.dueDate === "string"){
      taskDateInput.value = task.dueDate;
    }
    else{
      taskDateInput.value = "";
    }
    editingTaskId = task.id;
    taskTitleInput.value = task.title;
    taskErrorElement.textContent = "";
    taskTitleInput.focus();
    taskSubmitButton.textContent = "Сохранить";
    cancelEditButton.hidden = false;
  }

  function cancelEditing(){
    editingTaskId = null;
    taskTitleInput.value = "";
    taskDateInput.value = "";
    taskSubmitButton.textContent = "Добавить"
    taskErrorElement.textContent = "";
    cancelEditButton.hidden = true;
    taskTitleInput.focus();
  }

  function isTaskOverdue(task){
    if (task.completed || !(task.dueDate)){
      return false;
    }
    const today = new Date();
    today.setHours(0,0,0,0);
    const deadline = new Date(`${task.dueDate}T00:00:00`);
    return deadline < today;
  }
  
  cancelEditButton.addEventListener("click", cancelEditing);

restoreTaskFilter();
restoreTasks();
renderTasks();

taskForm.addEventListener("submit", handleTaskSubmit);


taskForm.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && editingTaskId !== null){
    cancelEditing();
  }
});