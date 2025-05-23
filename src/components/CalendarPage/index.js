import React, { useState } from 'react';
import { Button, message, Modal, Spin, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import TimelineStacked from './TimelineStacked';
import EventList from './EventList';
import EventModal from './EventModal';

import {
  useFetchEvents,
  useCreateEvent,
  useUpdateEvent,
  useCancelEvent,
} from '../../hooks/useCalendarApi';

import { usePersistedDayjsState } from '../../hooks/usePersistedDayjsState';

const { Title } = Typography;
const LOCAL_STORAGE_KEY = 'calendar_selectedDate';

const CalendarPage = () => {
  const { events, loading, fetchEvents } = useFetchEvents();
  const { createEvent } = useCreateEvent();
  const { updateEvent } = useUpdateEvent();
  const { cancelEvent } = useCancelEvent();

  // Dùng hook custom để giữ state với localStorage
  const [selectedDate, setSelectedDate] = usePersistedDayjsState(
    LOCAL_STORAGE_KEY,
    dayjs().startOf('day')
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const openCreateModal = () => {
    setEditingEvent(null);
    setModalVisible(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setModalVisible(true);
  };

  const handleDeleteEvent = (event) => {
    Modal.confirm({
      title: 'Xác nhận xóa sự kiện?',
      content: event.title,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await cancelEvent(event.id);
          message.success('Xóa sự kiện thành công');
          fetchEvents();
        } catch {
          message.error('Xóa sự kiện thất bại');
        }
      },
    });
  };

  const handleModalSubmit = async (data) => {
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, data);
        message.success('Cập nhật sự kiện thành công');
      } else {
        await createEvent(data);
        message.success('Tạo sự kiện thành công');
      }
      setModalVisible(false);
      fetchEvents();
    } catch {
      message.error('Thao tác thất bại');
    }
  };

  const handleEventClick = (ev) => {
    openEditModal(ev);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <Title level={3} style={{ marginBottom: 0 }}>
          Lịch sự kiện cá nhân
        </Title>

        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
          Tạo sự kiện
        </Button>
      </div>

      {loading ? (
        <Spin tip="Đang tải..." />
      ) : (
        <TimelineStacked
          events={events}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onEventClick={handleEventClick}
        />
      )}

      <EventList
        events={events}
        selectedDate={selectedDate}
        onEdit={openEditModal}
        onDelete={handleDeleteEvent}
      />

      <EventModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        eventData={editingEvent}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default CalendarPage;
