import { useState, useEffect, useCallback } from "react"
import { fetchPersonalTasks, fetchTeamTasks, createTask, updateTask, deleteTask } from "../services/taskService"
import { formatDateTime, formatDateTimeForAPI } from "../utils/dateUtils"
import { message } from "antd"

const useTasks = (teamId = null) => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      let data
      if (teamId) {
        data = await fetchTeamTasks(teamId)
      } else {
        data = await fetchPersonalTasks()
      }

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
      setError(err.message)
      message.error(teamId ? "Không thể tải danh sách task nhóm" : "Không thể tải danh sách task cá nhân")
    } finally {
      setLoading(false)
    }
  }, [teamId])

  const saveTask = useCallback(
    async (task) => {
      const isEditing = !!task.id
      const formattedTask = {
        ...task,
        start_time: task.start_time ? formatDateTimeForAPI(task.start_time) : null,
        end_time: task.end_time ? formatDateTimeForAPI(task.end_time) : null,
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
        setError(err.message)
        message.error("Lỗi khi lưu task")
        return false
      }
    },
    [fetchTasks],
  )

  const removeTask = useCallback(
    async (taskId) => {
      try {
        await deleteTask(taskId)
        setTasks((prev) => prev.filter((t) => t.id !== taskId))
        return true
      } catch (err) {
        setError(err.message)
        message.error("Lỗi khi xóa task")
        return false
      }
    },
    [],
  )

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
