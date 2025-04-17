import React, { useState, useEffect, useRef } from 'react';
import 'font-awesome/css/font-awesome.min.css';

const TeamPage = () => {
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef(null);

  const [newTeam, setNewTeam] = useState({
    name: '',
    avatar: '',
    description: '',
    membersCount: '',
  });

  useEffect(() => {
    const storedTeams = JSON.parse(localStorage.getItem('teams')) || [];
    setTeams(storedTeams);
  }, []);

  const handleInputChange = (e) => {
    setNewTeam({ ...newTeam, [e.target.name]: e.target.value });
  };

  const handleCreateTeam = () => {
    const updatedTeams = [...teams, { ...newTeam }];
    setTeams(updatedTeams);
    localStorage.setItem('teams', JSON.stringify(updatedTeams));
    setNewTeam({
      name: '',
      avatar: '',
      description: '',
      membersCount: '',
    });
    setShowModal(false);
  };

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowModal(false);
    }
  };

  return (
    <div className="relative p-6">
      {/* Modal tạo nhóm */}
      {showModal && (
        <div
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
          onClick={handleClickOutside}
        >
          <div
            ref={modalRef}
            className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg relative"
          >
            <h2 className="text-xl font-semibold mb-4">Tạo nhóm mới</h2>

            <input
              type="text"
              name="name"
              placeholder="Tên nhóm"
              value={newTeam.name}
              onChange={handleInputChange}
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="text"
              name="avatar"
              placeholder="URL Ảnh đại diện"
              value={newTeam.avatar}
              onChange={handleInputChange}
              className="w-full mb-3 p-2 border rounded"
            />
            <textarea
              name="description"
              placeholder="Mô tả"
              value={newTeam.description}
              onChange={handleInputChange}
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="number"
              name="membersCount"
              placeholder="Số thành viên"
              value={newTeam.membersCount}
              onChange={handleInputChange}
              className="w-full mb-4 p-2 border rounded"
            />

            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-3 rounded"
                onClick={() => setShowModal(false)}
              >
                Hủy
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-4 rounded"
                onClick={handleCreateTeam}
              >
                Tạo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Nếu chưa có nhóm */}
      {teams.length === 0 ? (
        <div className="flex justify-center items-center h-64 text-center border border-gray-300 rounded-md p-6">
          <p className="text-xl text-gray-600">Bạn chưa tham gia nhóm nào. Hãy tạo nhóm mới.</p>
        </div>
      ) : (
        <div>
          {/* Bảng các nhóm đã tham gia */}
          <table className="min-w-full table-auto border-collapse mt-6">
            <thead>
              <tr>
                <th className="py-2 px-4 text-left">Tên Nhóm</th>
                <th className="py-2 px-4 text-left">Mô Tả</th>
                <th className="py-2 px-4 text-left">Số Thành Viên</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-2 px-4 flex items-center space-x-2">
                    {team.avatar && (
                      <img src={team.avatar} alt="avatar" className="w-6 h-6 rounded-full" />
                    )}
                    <span>{team.name}</span>
                  </td>
                  <td className="py-2 px-4">{team.description}</td>
                  <td className="py-2 px-4">{team.membersCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Nút dấu cộng */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg z-50"
      >
        <i className="fa fa-plus text-xl" />
      </button>
    </div>
  );
};

export default TeamPage;
