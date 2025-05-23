import { useState, useEffect } from "react";
import { message } from "antd";
import { fetchTaskComments, fetchUserProfile } from "../services/assignService";

const useAssignHistory = (tasks) => {
  const [assignHistory, setAssignHistory] = useState({});
  const token = localStorage.getItem("token");

  const fetchAssignComments = async (taskId) => {
    try {
      const comments = await fetchTaskComments(token, taskId);

      const assignComments = comments
        .filter((c) => c.comment?.match(/\*\* Người dùng (.+?) đã được phân công/))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      if (assignComments.length === 0) {
        setAssignHistory((prev) => ({ ...prev, [taskId]: [] }));
        return;
      }

      const lastAssign = assignComments[0];
      const match = lastAssign.comment.match(/\*\* Người dùng (.+?) đã được phân công/);
      if (!match) return;

      const userId = match[1];
      if (userId === "null") {
        setAssignHistory((prev) => ({ ...prev, [taskId]: [] }));
        return;
      }

      const profile = await fetchUserProfile(token, userId);

      const entry = {
        userId: userId,
        full_name: profile.full_name,
        created_at: new Date(lastAssign.created_at).toLocaleString(),
      };

      setAssignHistory((prev) => ({ ...prev, [taskId]: [entry] }));
    } catch {
      message.error("Không thể tải phân công mới nhất");
    }
  };

  useEffect(() => {
    if (!tasks || !Array.isArray(tasks)) return;
    tasks.forEach((task) => {
      if (!assignHistory[task.id]) fetchAssignComments(task.id);
    });
  }, [tasks]);

  return { assignHistory, fetchAssignComments };
};

export default useAssignHistory;
