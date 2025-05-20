const TaskItem = ({ task, onEdit, onDelete, onView }) => {
  return (
    <div className="border rounded p-4 flex justify-between items-center">
      <div className="cursor-pointer" onClick={onView}>
        <h3 className="font-semibold text-lg">{task.title}</h3>
        <p className="text-sm text-gray-600">{task.description}</p>
        <p className="text-xs text-gray-400">
          {task.start_time} - {task.end_time}
        </p>
        <p className="text-xs">
          Trạng thái: <span className="font-medium">{task.status}</span>
        </p>
        <p className="text-xs">
          Ưu tiên: <span className="font-medium">{task.priority}</span>
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={onEdit}
          className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
        >
          Sửa
        </button>
        <button
          onClick={onDelete}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Xóa
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
