import { isValidTask } from "./validation.js";

export function saveTasks(tasks){
  localStorage.setItem("plannerTasks", JSON.stringify(tasks));
}

export function restoreTasks(tasks){
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
