import React from 'react';
import { Table, Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import { getInitials } from '../../utils/getInitialsAvatar';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

const SortButton = ({ active, order }) => {
  if (!active) return null;
  return order === 'asc' ? <ArrowUpOutlined style={{ fontSize: 12 }} /> : <ArrowDownOutlined style={{ fontSize: 12 }} />;
};

const TeamList = ({ teams, loading, sortKey, sortOrder, toggleSort }) => {
  const navigate = useNavigate();

  const columns = [
    {
      title: (
        <span
          onClick={() => toggleSort('name')}
          style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
        >
          Tên nhóm <SortButton active={sortKey === 'name'} order={sortOrder} />
        </span>
      ),
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      render: (name, record) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <Avatar
            src={record.avatar_url || null}
            className="bg-gray-200 text-gray-800 font-semibold"
          >
            {!record.avatar_url && getInitials(record.name)}
          </Avatar>
          <span>{name}</span>
        </div>
      ),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
      responsive: ['md'],
    },
    {
      title: (
        <span
          onClick={() => toggleSort('created_at')}
          style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}
        >
          Ngày tạo <SortButton active={sortKey === 'created_at'} order={sortOrder} />
        </span>
      ),
      dataIndex: 'created_at',
      key: 'created_at',
      align: 'center',
      render: (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
      },
    },
    {
      title: 'Người tạo',
      dataIndex: 'creator_name',
      key: 'creator_name',
      align: 'center',
      render: (creatorName) => creatorName || '-',
      responsive: ['md'],
    },
  ];

  return (
    <div className="w-full mx-auto">
      <Table
        dataSource={teams}
        columns={columns}
        rowKey={(record) => record.id}
        loading={loading}
        pagination={{ pageSize: 5, position: ['bottomCenter'] }}
        onRow={(record) => ({
          onClick: () => navigate(`/teams/${record.id}`),
          style: { cursor: 'pointer' },
        })}
      />
    </div>
  );
};

export default TeamList;
