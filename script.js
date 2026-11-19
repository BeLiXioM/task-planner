const tasks =[];

const taskForm = document.querySelector("#task-form");
const taskTitleInput = document.querySelector("#task-title");
const taskListElement = document.querySelector("#task-list");
const taskErrorElement = document.querySelector("#task-error");
const taskCountElement = document.querySelector("#task-count");

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
  renderTasks();
  taskTitleInput.value = "";
  taskTitleInput.focus();
}

function renderTasks(){
    taskListElement.textContent = "";

    taskCountElement.textContent = `Осталось задач: ${countActiveTasks(tasks)}`;

    if (tasks.length === 0){
        const li = document.createElement("li");
        li.textContent = "Задач пока нет";
        taskListElement.append(li);
        return 
    }

    for (const task of tasks){
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

taskListElement.addEventListener("click", (event) => {
  if (event.target.dataset.action === "delete"){
            deleteTask(event.target.dataset.taskId);
        }
});

function setTaskCompleted(taskId, completed){
    const task = tasks.find(item => item.id === taskId);
    if (task) {
  task.completed = completed;
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
    renderTasks();
  }
}

renderTasks();



taskForm.addEventListener("submit", handleTaskSubmit);
