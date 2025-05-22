import { useEffect, useState } from 'react';
import TaskForm from '../../components/Tasks/TaskForm';
import TaskItem from '../../components/Tasks/TaskItem';
import TaskDetails from '../../components/Tasks/TaskDetails';

const PersonalTaskPage = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const formatDateTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour12: false,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    const fetchTasks = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:5000/api/tasks', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                console.error('Lỗi tải danh sách công việc, status:', res.status);
                const err = await res.json();
                console.error(err);
                return;
            }

            const data = await res.json();
            console.log('Dữ liệu API tasks:', data);

            if (Array.isArray(data.personalTasks)) {
                const formattedTasks = data.personalTasks.map((task) => ({
                    ...task,
                    start_time: formatDateTime(task.start_time),
                    end_time: formatDateTime(task.end_time),
                    created_at: formatDateTime(task.created_at),
                }));
                setTasks(formattedTasks);
            } else {
                console.error('Dữ liệu không hợp lệ từ API:', data);
            }
        } catch (error) {
            console.error('Lỗi khi tải công việc:', error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const formatDateTimeForAPI = (datetimeLocal) => {
        if (!datetimeLocal) return null;
        return datetimeLocal.replace('T', ' ') + ':00';
    };

    const handleSaveTask = async (task) => {
        const token = localStorage.getItem('token');
        const isEditing = !!task.id;

        const formattedTask = {
            ...task,
            start_day: task.start_time ? formatDateTimeForAPI(task.start_time) : null,
            end_day: task.end_time ? formatDateTimeForAPI(task.end_time) : null,
        };

        try {
            const res = await fetch(`http://localhost:5000/api/tasks${isEditing ? `/${task.id}` : ''}`, {
                method: isEditing ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formattedTask),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Lỗi lưu công việc');
            }

            await fetchTasks();
            setEditingTask(null);
            setShowForm(false);
        } catch (error) {
            console.error('Lỗi khi lưu công việc:', error);
            alert('Lỗi khi lưu công việc, vui lòng thử lại');
        }
    };

    const handleDelete = async (id) => {
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Xoá công việc thất bại');
            }

            setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
        } catch (error) {
            console.error('Lỗi khi xoá công việc:', error);
            alert('Xoá công việc thất bại, vui lòng thử lại');
        }
    };

    const handleAddClick = () => {
        setEditingTask(null);
        setShowForm(true);
    };

    const handleEditClick = (task) => {
        setEditingTask(task);
        setShowForm(true);
    };

    const handleCancelForm = () => {
        setEditingTask(null);
        setShowForm(false);
    };

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

                <div className="w-2/3 max-h-[600px] overflow-y-auto border rounded p-4">
                    {Array.isArray(tasks) && tasks.length > 0 ? (
                        tasks.map((task) => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onEdit={() => handleEditClick(task)}
                                onDelete={() => handleDelete(task.id)}
                                onView={() => setSelectedTask(task)}
                            />
                        ))
                    ) : (
                        <p className="text-gray-500">Chưa có công việc nào</p>
                    )}
                </div>
            </div>

            {selectedTask && <TaskDetails task={selectedTask} onClose={() => setSelectedTask(null)} />}
        </div>
    );
};

export default PersonalTaskPage;
