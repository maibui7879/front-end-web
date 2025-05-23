import React from 'react';

const DeleteTeamButton = ({ onDelete }) => (
  <a
    onClick={onDelete}
    style={{ color: 'red', cursor: 'pointer', marginLeft: 16 }}
    className="hover:underline"
  >
    Xóa nhóm
  </a>
);

export default DeleteTeamButton;
