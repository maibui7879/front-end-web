import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Select, 
  Space, 
  message,
  Popconfirm,
  Tag
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined,
  UserOutlined,
  LockOutlined,
  MailOutlined
} from '@ant-design/icons';
import { getUsers, createUser, updateUserRole, updateUserStatus, deleteUser } from '../../services/admin';
import withAdminAuth from '../../components/hoc/withAdminAuth';

const { Option } = Select;

const UserManagementPage = () => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });

  const fetchUsers = async (params = {}) => {
    try {
      setLoading(true);
      const response = await getUsers({
        page: params.current || pagination.current,
        limit: params.pageSize || pagination.pageSize,
        ...params
      });
      setUsers(response.users);
      setPagination({
        ...pagination,
        total: response.total,
        current: response.page,
        pageSize: response.limit
      });
    } catch (error) {
      message.error('Lỗi khi tải danh sách người dùng: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleTableChange = (pagination, filters, sorter) => {
    fetchUsers({
      current: pagination.current,
      pageSize: pagination.pageSize,
      ...filters
    });
  };

  const handleCreateUser = async (values) => {
    try {
      await createUser(values);
      message.success('Tạo người dùng thành công!');
      setModalVisible(false);
      form.resetFields();
      fetchUsers();
    } catch (error) {
      message.error('Lỗi khi tạo người dùng: ' + error.message);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await updateUserRole({ userId, role: newRole });
      message.success('Cập nhật vai trò thành công!');
      fetchUsers();
    } catch (error) {
      message.error('Lỗi khi cập nhật vai trò: ' + error.message);
    }
  };

  const handleUpdateStatus = async (userId, newStatus) => {
    try {
      await updateUserStatus({ userId, status: newStatus });
      message.success('Cập nhật trạng thái thành công!');
      fetchUsers();
    } catch (error) {
      message.error('Lỗi khi cập nhật trạng thái: ' + error.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      message.success('Xóa người dùng thành công!');
      fetchUsers();
    } catch (error) {
      message.error('Lỗi khi xóa người dùng: ' + error.message);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role === 'admin' ? 'Admin' : 'Member'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Hoạt động' : 'Khóa'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Select
            defaultValue={record.role}
            style={{ width: 100 }}
            onChange={(value) => handleUpdateRole(record.id, value)}
          >
            <Option value="admin">Admin</Option>
            <Option value="member">Member</Option>
          </Select>
          <Select
            defaultValue={record.status}
            style={{ width: 100 }}
            onChange={(value) => handleUpdateStatus(record.id, value)}
          >
            <Option value="active">Hoạt động</Option>
            <Option value="inactive">Khóa</Option>
          </Select>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa người dùng này?"
            onConfirm={() => handleDeleteUser(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title="Quản lý người dùng"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingUser(null);
              setModalVisible(true);
            }}
          >
            Thêm người dùng
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
        />
      </Card>

      <Modal
        title={editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
        visible={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateUser}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>

          <Form.Item
            name="full_name"
            label="Họ và tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
          >
            <Select>
              <Option value="admin">Admin</Option>
              <Option value="member">Member</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingUser ? "Cập nhật" : "Thêm mới"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default withAdminAuth(UserManagementPage); 