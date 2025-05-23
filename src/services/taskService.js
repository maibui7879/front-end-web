import axios from "axios"
import API_BASE_URL from "./api"

const getToken = () => localStorage.getItem("token")

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
})

export const fetchPersonalTasks = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/tasks`, {
      headers: getAuthHeaders(),
    })
    return res.data
  } catch (error) {
    const msg =
      error.response?.data?.message ||
      `Error ${error.response?.status || ""}: Failed to fetch tasks`
    throw new Error(msg)
  }
}

export const fetchTeamTasks = async (teamId) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/tasks/team/${teamId}`, {
      headers: getAuthHeaders(),
    })
    return res.data
  } catch (error) {
    const msg =
      error.response?.data?.message ||
      `Error ${error.response?.status || ""}: Failed to fetch team tasks`
    throw new Error(msg)
  }
}

export const createTask = async (taskData) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/tasks`, taskData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    })
    return res.data
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to create task"
    throw new Error(msg)
  }
}

export const updateTask = async (taskId, taskData) => {
  try {
    const res = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, taskData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
    })
    return res.data
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to update task"
    throw new Error(msg)
  }
}

export const deleteTask = async (taskId) => {
  try {
    await axios.delete(`${API_BASE_URL}/tasks/${taskId}`, {
      headers: getAuthHeaders(),
    })
    return true
  } catch (error) {
    const msg = error.response?.data?.message || "Failed to delete task"
    throw new Error(msg)
  }
}
