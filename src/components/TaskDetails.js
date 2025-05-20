const TaskDetails = ({ task, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-2">{task.title}</h2>
        <p className="mb-2">{task.description}</p>

        <p>
          <strong>Thời gian:</strong> {task.start_time} - {task.end_time}
        </p>
        <p>
          <strong>Trạng thái:</strong> {task.status}
        </p>
        <p>
          <strong>Ưu tiên:</strong> {task.priority}
        </p>

        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default TaskDetails;
