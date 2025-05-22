"use client"

import { useState } from "react"
import TaskForm from "../components/TeamDetailPage/Task/TaskForm"
import TaskDetails from "../components/TeamDetailPage/Task/TaskDetails"
import TaskList from "../components/TaskList"
import useTasks from "../hooks/useTasks"

const PersonalTaskPage = () => {
  const { tasks, saveTask, removeTask } = useTasks()
  const [selectedTask, setSelectedTask] = useState(null)
  const [editingTask, setEditingTask] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const handleSaveTask = async (task) => {
    const success = await saveTask(task)
    if (success) {
      setEditingTask(null)
      setShowForm(false)
    } else {
      alert("Lỗi khi lưu công việc, vui lòng thử lại")
    }
  }

  const handleDelete = async (id) => {
    const success = await removeTask(id)
    if (!success) {
      alert("Xoá công việc thất bại, vui lòng thử lại")
    }
  }

  const handleAddClick = () => {
    setEditingTask(null)
    setShowForm(true)
  }

  const handleEditClick = (task) => {
    setEditingTask(task)
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setEditingTask(null)
    setShowForm(false)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex gap-8">
        <div className="w-1/3">
          {!showForm && (
            <button
              onClick={handleAddClick}
              className="mb-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 w-full"
            >
              Thêm công việc
            </button>
          )}

          {showForm && <TaskForm onSave={handleSaveTask} task={editingTask} onCancel={handleCancelForm} />}
        </div>

        <div className="w-2/3">
          <TaskList tasks={tasks} onEdit={handleEditClick} onDelete={handleDelete} onView={setSelectedTask} />
        </div>
      </div>

      {selectedTask && <TaskDetails task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </div>
  )
}

export default PersonalTaskPage
