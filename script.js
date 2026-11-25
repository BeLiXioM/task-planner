import { filterTasks, countActiveTasks, isTaskOverdue } from "./task-utils.js";
import { saveTasks, restoreTasks} from "./storage.js";

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

  saveTasks(tasks);
  renderTasks();
  taskTitleInput.value = "";
  taskDateInput.value = "";
  taskTitleInput.focus();
}


taskFilterSelect.addEventListener("change", () => {
  saveTaskFilter();
  renderTasks();
});

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
  saveTasks(tasks);
  renderTasks();
}
}

taskListElement.addEventListener("change", (event) => {
    if (event.target.dataset.action === "toggle"){
        setTaskCompleted(event.target.dataset.taskId, event.target.checked);
    }
})


function deleteTask(taskId){
     const index = tasks.findIndex(task => task.id === taskId);
     if (index !== -1) {
      if (taskId === editingTaskId){
        cancelEditing();
      }
    tasks.splice(index, 1);
    saveTasks(tasks);
    renderTasks();
  }
}


  function saveTaskFilter(){
    localStorage.setItem("plannerFilter", taskFilterSelect.value);
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
        const titleElement = document.createElement("label");
        const deleteButton = document.createElement("button");
        const editButton = document.createElement("button");
        const dateElement = document.createElement("span");
        const actionsElement = document.createElement("div");
        if (task.dueDate){
          dateElement.textContent = ` Срок: ${task.dueDate}`
        }
        else{
          dateElement.textContent = " Без срока";
        }
        actionsElement.classList.add("task-actions");
        titleElement.classList.add("task-title");
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
        checkbox.id = `task-${task.id}`;
        titleElement.htmlFor = checkbox.id;
        checkbox.dataset.action = "toggle";
        checkbox.dataset.taskId = task.id;
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        titleElement.textContent = task.title;
        li.classList.add("task-item");
        if (task.completed){
            titleElement.classList.add("task-completed");
        }
        actionsElement.append(editButton, deleteButton);
        li.append(checkbox, titleElement, dateElement, actionsElement);
        taskListElement.append(li);
        if (isTaskOverdue(task)){
            dateElement.classList.add("task-overdue");
        }
      
    }
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
  
  cancelEditButton.addEventListener("click", cancelEditing);

restoreTaskFilter();
restoreTasks(tasks);
renderTasks();

taskForm.addEventListener("submit", handleTaskSubmit);


taskForm.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && editingTaskId !== null){
    cancelEditing();
  }
});