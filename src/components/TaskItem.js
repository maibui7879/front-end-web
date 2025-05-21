import { Card, Tag, Button } from "antd";

const getPriorityStyle = (priority) => {
  switch (priority) {
    case "high":
      return { backgroundColor: "#fff1f0" }; // đỏ nhạt
    case "medium":
      return { backgroundColor: "#fffbe6" }; // vàng nhạt
    case "low":
      return { backgroundColor: "#f6ffed" }; // xanh nhạt
    default:
      return { backgroundColor: "#f0f5ff" }; // xanh lam nhạt (mặc định)
  }
};

const getPriorityColor = (priority) => {
  switch (priority) {
    case "high":
      return "red";
    case "medium":
      return "gold";
    case "low":
      return "green";
    default:
      return "blue";
  }
};

const TaskItem = ({ task, onEdit, onDelete, onView }) => {
  return (
    <Card
      title={task.title}
      extra={<Tag color={getPriorityColor(task.priority)}>{task.priority}</Tag>}
      style={{ marginBottom: 16, ...getPriorityStyle(task.priority) }}
      className="cursor-pointer"
      onClick={onView}
    >
      <p className="text-sm text-gray-600">{task.description}</p>
      <p className="text-xs text-gray-500">
        {task.start_time} - {task.end_time}
      </p>
      <p className="text-xs">
        Trạng thái: <span className="font-medium">{task.status}</span>
      </p>

      <div
        className="flex justify-end gap-2 mt-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Button type="primary" onClick={onEdit}>
          Sửa
        </Button>
        <Button danger onClick={onDelete}>
          Xóa
        </Button>
      </div>
    </Card>
  );
};

export default TaskItem;
