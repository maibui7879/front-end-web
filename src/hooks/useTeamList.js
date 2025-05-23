import { useEffect, useState } from 'react';
import axios from 'axios';
import { message } from 'antd';
import { sortByKey } from '../utils/sortUtils';

const useTeamList = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [newTeamId, setNewTeamId] = useState(null);
  const [sortKey, setSortKey] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/teams', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      let items = res.data.items;
      if (sortKey) {
        items = sortByKey(items, sortKey, sortOrder);
      }
      setTeams(items);
    } catch {
      message.error('Không thể tải danh sách nhóm');
    } finally {
      setLoading(false);
    }
  };

  const toggleSort = (key) => {
    const newOrder = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortOrder(newOrder);
  };

  const handleCreateTeam = async (nextStep) => {
    if (!newTeamName.trim() || !newTeamDescription.trim()) {
      message.warning('Vui lòng nhập đầy đủ thông tin nhóm');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:5000/api/teams',
        { name: newTeamName, description: newTeamDescription },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setNewTeamId(res.data.id);
      message.success('Tạo nhóm thành công');
      fetchTeams();
      nextStep();
    } catch {
      message.error('Lỗi khi tạo nhóm');
    }
  };

  const handleAvatarUploaded = () => {
    setNewTeamName('');
    setNewTeamDescription('');
    setNewTeamId(null);
    fetchTeams();
  };

  useEffect(() => {
    fetchTeams();
  }, [sortKey, sortOrder]);

  return {
    teams,
    loading,
    newTeamName,
    newTeamDescription,
    newTeamId,
    sortKey,
    sortOrder,
    toggleSort,
    setNewTeamName,
    setNewTeamDescription,
    setNewTeamId,
    handleCreateTeam,
    handleAvatarUploaded,
    fetchTeams,
  };
};

export default useTeamList;
