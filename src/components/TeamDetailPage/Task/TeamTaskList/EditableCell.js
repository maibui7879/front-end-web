import React from 'react';
import { Form, Input, Select, DatePicker } from 'antd';
import dayjs from 'dayjs';

const EditableCell = ({
  editingKey,
  record,
  dataIndex,
  inputNode,
  form,
  edit,
}) => {
  if (editingKey === record.id) {
    return (
      <Form.Item
        name={dataIndex}
        rules={['title', 'status', 'priority'].includes(dataIndex)
          ? [{ required: true, message: `Vui lòng nhập ${dataIndex}` }]
          : []}
        style={{ margin: 0 }}
      >
        {inputNode}
      </Form.Item>
    );
  }

  if (dataIndex === 'timeRange') {
    return (
      <div style={{ cursor: 'pointer' }} onClick={() => edit(record)}>
        {dayjs(record.start_time).format('YYYY-MM-DD HH:mm')} → {dayjs(record.end_time).format('YYYY-MM-DD HH:mm')}
      </div>
    );
  }

  return (
    <div style={{ cursor: 'pointer' }} onClick={() => edit(record)}>
      {record[dataIndex]}
    </div>
  );
};

export default EditableCell;
