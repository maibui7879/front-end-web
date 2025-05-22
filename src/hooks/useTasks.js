"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchPersonalTasks, createTask, updateTask, deleteTask } from "../services/taskService"
import { formatDateTime, formatDateTimeForAPI } from "../utils/dateUtils"

const useTasks = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Fetch all tasks
  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await fetchPersonalTasks()

      if (Array.isArray(data.personalTasks)) {
        const formattedTasks = data.personalTasks.map((task) => ({
          ...task,
          start_time: formatDateTime(task.start_time),
          end_time: formatDateTime(task.end_time),
          created_at: formatDateTime(task.created_at),
        }))
        setTasks(formattedTasks)
      } else {
        throw new Error("Invalid data format from API")
      }
    } catch (err) {
      console.error("Error fetching tasks:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Save a task (create or update)
  const saveTask = useCallback(
    async (task) => {
      const isEditing = !!task.id

      const formattedTask = {
        ...task,
        start_day: task.start_time ? formatDateTimeForAPI(task.start_time) : null,
        end_day: task.end_time ? formatDateTimeForAPI(task.end_time) : null,
      }

      try {
        if (isEditing) {
          await updateTask(task.id, formattedTask)
        } else {
          await createTask(formattedTask)
        }

        await fetchTasks()
        return true
      } catch (err) {
        console.error("Error saving task:", err)
        setError(err.message)
        return false
      }
    },
    [fetchTasks],
  )

  // Delete a task
  const removeTask = useCallback(async (taskId) => {
    try {
      await deleteTask(taskId)
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId))
      return true
    } catch (err) {
      console.error("Error deleting task:", err)
      setError(err.message)
      return false
    }
  }, [])

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    saveTask,
    removeTask,
  }
}

export default useTasks
