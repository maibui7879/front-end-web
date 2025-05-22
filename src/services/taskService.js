const API_BASE_URL = "http://localhost:5000/api"

// Get all personal tasks
export const fetchPersonalTasks = async () => {
  const token = localStorage.getItem("token")

  const response = await fetch(`${API_BASE_URL}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || `Error ${response.status}: Failed to fetch tasks`)
  }

  return response.json()
}

// Create a new task
export const createTask = async (taskData) => {
  const token = localStorage.getItem("token")

  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to create task")
  }

  return response.json()
}

// Update an existing task
export const updateTask = async (taskId, taskData) => {
  const token = localStorage.getItem("token")

  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(taskData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to update task")
  }

  return response.json()
}

// Delete a task
export const deleteTask = async (taskId) => {
  const token = localStorage.getItem("token")

  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Failed to delete task")
  }

  return true
}
