import api from "./api";

export const createTask = async taskData => {
  const response = await api.post("/tasks", taskData);
  return response.data;
};

export const getProjectTasks = async (projectId, params = {}) => {
  const response = await api.get(`/tasks/project/${projectId}`, {params});

  return response.data;
};

export const getMyAssignedTasks = async () => {
  const response = await api.get("/tasks/my-tasks");
  return response.data;
};

export const getTaskById = async taskId => {
  const response = await api.get(`/tasks/${taskId}`);
  return response.data;
};

export const updateTaskStatus = async (taskId, status) => {
  const response = await api.patch(`/tasks/${taskId}/status`, {status});

  return response.data;
};

export const updateTask = async (taskId, taskData) => {
  const response = await api.patch(`/tasks/${taskId}`, taskData);

  return response.data;
};

export const deleteTask = async taskId => {
  const response = await api.delete(`/tasks/${taskId}`);
  return response.data;
};
