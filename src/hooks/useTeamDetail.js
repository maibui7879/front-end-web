import { useEffect, useState } from 'react';
import axios from 'axios';
import { message } from 'antd';

const useTeamDetail = (teamId) => {
  const [team, setTeam] = useState(null);
  const [creator, setCreator] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeamDetail = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');

      const teamRes = await axios.get(`http://localhost:5000/api/teams/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTeam(teamRes.data);

      const creatorId = teamRes.data.creator_id;
      const creatorRes = await axios.get(`http://localhost:5000/api/user/profile/${creatorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCreator(creatorRes.data.profile);

      const memberRes = await axios.get(`http://localhost:5000/api/teams/${teamId}/members`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMembers(memberRes.data);
    } catch (error) {
      message.error('Không thể tải thông tin nhóm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teamId) fetchTeamDetail();
  }, [teamId]);

  return { team, creator, members, loading, fetchTeamDetail };
};

export default useTeamDetail;
