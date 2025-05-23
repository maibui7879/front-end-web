import React, { useEffect, useState } from 'react';
import {
  Button, Table, Typography, Spin, Form, Space,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { sortByKey } from '../../../../utils/sortUtils';
import CreateTaskModal from './CreateTaskModal';
import AssignTaskModal from './AssignTaskModal';
import useTeamTasks from '../../../../hooks/useTeamTask';
import useAssignHistory from '../../../../hooks/useAssignHistory';
import useEditableCell from '../../../../hooks/useEditableCell';

import TeamTaskColumns from './TeamTaskColumns';

const { Title } = Typography;

const TeamTaskList = ({ teamId }) => {
  const { tasks, loading, fetchTasks } = useTeamTasks(teamId);
  const { assignHistory, fetchAssignComments } = useAssignHistory(tasks);
  const { editingKey, form, edit, cancel, save } = useEditableCell(fetchTasks);

  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    tasks.forEach((task) => {
      if (!assignHistory[task.id]) fetchAssignComments(task.id);
    });
  }, [tasks]);

  const openAssignModal = (taskId) => {
    setSelectedTaskId(taskId);
    setAssignModalVisible(true);
  };

  const columns = TeamTaskColumns({
    editingKey,
    form,
    save,
    cancel,
    edit,
    assignHistory,
    onOpenAssignModal: openAssignModal,
  });

  return (
    <div className="md:p-6 mx-auto max-w-full overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <Title level={3} className="!mb-0">Danh sách công việc</Title>
        <Space size="middle">
          {editingKey && (
            <>
              <Button type="primary" onClick={() => save(editingKey)}>Lưu</Button>
              <Button onClick={cancel}>Hủy</Button>
            </>
          )}
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalVisible(true)}>
            Tạo Task
          </Button>
        </Space>
      </div>

      {loading ? (
        <Spin tip="Đang tải..." />
      ) : (
        <Form form={form} component={false}>
          <div className="overflow-x-auto max-w-full w-full">
          <Table
            rowKey="id"
            dataSource={sortByKey(tasks, sortKey, sortOrder)}
            onChange={(pagination, filters, sorter) => {
              if (sorter.order) {
                setSortKey(sorter.field);
                setSortOrder(sorter.order === 'ascend' ? 'asc' : 'desc');
              } else {
                setSortKey(null);
                setSortOrder('asc');
              }
            }}
            columns={columns.map(col => ({
              ...col,
              sorter: !!col.dataIndex,
              sortOrder: sortKey === col.dataIndex ? (sortOrder === 'asc' ? 'ascend' : 'descend') : null,
            }))}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
            className="!text-center !rounded-md [&_.ant-pagination]:!justify-center"
          />
          </div>
        </Form>
      )}

      <CreateTaskModal
        teamId={teamId}
        visible={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        onCreate={() => {
          setCreateModalVisible(false);
          fetchTasks();
        }}
      />

      <AssignTaskModal
        teamId={teamId}
        taskId={selectedTaskId}
        visible={assignModalVisible}
        onCancel={() => setAssignModalVisible(false)}
        onSuccess={() => {
          setAssignModalVisible(false);
          fetchAssignComments(selectedTaskId);
          fetchTasks();
        }}
      />
    </div>
  );
};

export default TeamTaskList;
