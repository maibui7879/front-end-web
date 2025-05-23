import { useState } from 'react';
import { Form, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

const useEditableCell = (fetchTasks) => {
  const [editingKey, setEditingKey] = useState('');
  const [form] = Form.useForm();

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
      timeRange: [dayjs(record.start_time), dayjs(record.end_time)],
    });
    setEditingKey(record.id);
  };

  const cancel = () => setEditingKey('');

  const save = async (id) => {
    try {
      const values = await form.validateFields();
      await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        {
          title: values.title,
          description: values.description,
          status: values.status,
          priority: values.priority,
          start_time: values.timeRange[0].format('YYYY-MM-DD HH:mm:ss'),
          end_time: values.timeRange[1].format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      message.success('Đã cập nhật task');
      setEditingKey('');
      fetchTasks();
    } catch (err) {
      if (err.errorFields) return;
      message.error('Cập nhật thất bại');
    }
  };

  return {
    editingKey,
    form,
    edit,
    cancel,
    save,
  };
};

export default useEditableCell;
