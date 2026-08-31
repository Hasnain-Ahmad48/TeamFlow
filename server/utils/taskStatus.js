const isTaskOverdue = task => {
  if (task.status === "completed") {
    return false;
  }

  if (!task.dueDate) {
    return false;
  }

  const currentDate = new Date();
  const dueDate = new Date(task.dueDate);

  return dueDate < currentDate;
};

module.exports = {
  isTaskOverdue,
};
