export function isValidTask(task){
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