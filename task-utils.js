export function filterTasks(tasks, status){
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


export function countActiveTasks(tasks){
    return tasks.filter(task => !task.completed).length;
}

export  function isTaskOverdue(task){
    if (task.completed || !(task.dueDate)){
      return false;
    }
    const today = new Date();
    today.setHours(0,0,0,0);
    const deadline = new Date(`${task.dueDate}T00:00:00`);
    return deadline < today;
  }