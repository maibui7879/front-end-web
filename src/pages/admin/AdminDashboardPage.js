import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Tag } from 'antd';
import { 
  UserOutlined, 
  TeamOutlined, 
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { getUsers } from '../../services/admin';
import AdminLayout from '../../layouts/AdminLayout';

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalTeams: 0,
    activeTasks: 0
  });

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await getUsers({ limit: 1 });
      // Giả lập dữ liệu thống kê
      setStats({
        totalUsers: response.total || 0,
        activeUsers: Math.floor(response.total * 0.8) || 0,
        totalTeams: Math.floor(response.total / 5) || 0,
        activeTasks: Math.floor(response.total * 2) || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const recentActivities = [
    {
      key: '1',
      user: 'Nguyễn Văn A',
      action: 'Tạo task mới',
      time: '5 phút trước',
      status: 'success'
    },
    {
      key: '2',
      user: 'Trần Thị B',
      action: 'Cập nhật team',
      time: '10 phút trước',
      status: 'processing'
    },
    {
      key: '3',
      user: 'Lê Văn C',
      action: 'Xóa task',
      time: '15 phút trước',
      status: 'error'
    }
  ];

  const columns = [
    {
      title: 'Người dùng',
      dataIndex: 'user',
      key: 'user',
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={
          status === 'success' ? 'green' :
          status === 'processing' ? 'blue' :
          'red'
        }>
          {status === 'success' ? 'Thành công' :
           status === 'processing' ? 'Đang xử lý' :
           'Lỗi'}
        </Tag>
      ),
    },
  ];

  return (
    <AdminLayout>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số người dùng"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Người dùng đang hoạt động"
              value={stats.activeUsers}
              prefix={<CheckCircleOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số nhóm"
              value={stats.totalTeams}
              prefix={<TeamOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Task đang thực hiện"
              value={stats.activeTasks}
              prefix={<ClockCircleOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Card 
        title="Hoạt động gần đây" 
        style={{ marginTop: '16px' }}
      >
        <Table
          columns={columns}
          dataSource={recentActivities}
          pagination={false}
        />
      </Card>
    </AdminLayout>
  );
};

export default AdminDashboardPage; 