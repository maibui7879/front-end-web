import React, { useState, useEffect } from 'react';
import { Card, Table, Tag, message } from 'antd';
import { getLogs } from '../../services/admin';
import withAdminAuth from '../../components/hoc/withAdminAuth';

const LogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await getLogs();
      setLogs(response.logs);
    } catch (error) {
      message.error('Lỗi khi tải danh sách log: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Người dùng',
      dataIndex: 'full_name',
      key: 'full_name',
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <div style={{ color: '#999', fontSize: '12px' }}>{record.email}</div>
        </div>
      ),
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
      render: (action) => (
        <Tag color={
          action.includes('create') ? 'green' :
          action.includes('update') ? 'blue' :
          action.includes('delete') ? 'red' : 'default'
        }>
          {action}
        </Tag>
      ),
    },
    {
      title: 'Thời gian',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleString(),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Lịch sử hoạt động">
        <Table
          columns={columns}
          dataSource={logs}
          rowKey="id"
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default withAdminAuth(LogPage); 