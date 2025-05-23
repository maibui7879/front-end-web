import React from 'react';
import { Input, Select, DatePicker, Tag } from 'antd';
import EditableCell from './EditableCell';
import AssignCell from './AssignCell';

const statusColorMap = {
  todo: 'default',
  in_progress: 'processing',
  done: 'success',
};

const priorityColorMap = {
  low: 'green',
  medium: 'gold',
  high: 'red',
};

const TeamTaskColumns = ({
  editingKey,
  form,
  save,
  cancel,
  edit,
  assignHistory,
  onOpenAssignModal,
}) => [
  {
    title: 'Tiêu đề',
    dataIndex: 'title',
    render: (_, record) => (
      <EditableCell
        editingKey={editingKey}
        record={record}
        dataIndex="title"
        inputNode={<Input />}
        form={form}
        save={save}
        cancel={cancel}
        edit={edit}
      />
    ),
  },
  {
    title: 'Mô tả',
    dataIndex: 'description',
    render: (_, record) => (
      <EditableCell
        editingKey={editingKey}
        record={record}
        dataIndex="description"
        inputNode={<Input.TextArea autoSize />}
        form={form}
        save={save}
        cancel={cancel}
        edit={edit}
      />
    ),
  },
  {
    title: 'Trạng thái',
    dataIndex: 'status',
    render: (_, record) => {
      if (editingKey === record.id) {
        return (
          <EditableCell
            editingKey={editingKey}
            record={record}
            dataIndex="status"
            inputNode={(
              <Select style={{ minWidth: 120 }}>
                <Select.Option value="todo">Todo</Select.Option>
                <Select.Option value="in_progress">In Progress</Select.Option>
                <Select.Option value="done">Done</Select.Option>
              </Select>
            )}
            form={form}
            save={save}
            cancel={cancel}
            edit={edit}
          />
        );
      }
      return (
        <Tag color={statusColorMap[record.status]}>
          {record.status === 'todo' ? 'Todo'
            : record.status === 'in_progress' ? 'In Progress'
            : 'Done'}
        </Tag>
      );
    },
  },
  {
    title: 'Ưu tiên',
    dataIndex: 'priority',
    render: (_, record) => {
      if (editingKey === record.id) {
        return (
          <EditableCell
            editingKey={editingKey}
            record={record}
            dataIndex="priority"
            inputNode={(
              <Select style={{ minWidth: 100 }}>
                <Select.Option value="low">Low</Select.Option>
                <Select.Option value="medium">Medium</Select.Option>
                <Select.Option value="high">High</Select.Option>
              </Select>
            )}
            form={form}
            save={save}
            cancel={cancel}
            edit={edit}
          />
        );
      }
      return <Tag color={priorityColorMap[record.priority]}>{record.priority}</Tag>;
    },
  },
  {
    title: 'Thời gian',
    dataIndex: 'timeRange',
    render: (_, record) => (
      <EditableCell
        editingKey={editingKey}
        record={record}
        dataIndex="timeRange"
        inputNode={<DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />}
        form={form}
        save={save}
        cancel={cancel}
        edit={edit}
      />
    ),
  },
  {
    title: 'Phân công',
    key: 'assigned',
    render: (_, record) => (
      <AssignCell
        record={record}
        assignHistory={assignHistory}
        onOpenAssignModal={onOpenAssignModal}
      />
    ),
  },
];

export default TeamTaskColumns;
