import TaskItem from "./TeamDetailPage/Task/TaskItem"

const TaskList = ({ tasks, onEdit, onDelete, onView }) => {
  return (
    <div className="max-h-[600px] overflow-y-auto border rounded p-4">
      {Array.isArray(tasks) && tasks.length > 0 ? (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onEdit={() => onEdit(task)}
            onDelete={() => onDelete(task.id)}
            onView={() => onView(task)}
          />
        ))
      ) : (
        <p className="text-gray-500">Chưa có công việc nào</p>
      )}
    </div>
  )
}

export default TaskList
