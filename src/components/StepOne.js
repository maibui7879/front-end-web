import React from 'react';
import { Input } from 'antd';

const StepOne = ({ teamName, teamDescription, setTeamName, setTeamDescription }) => {
    return (
        <div className="space-y-3">
            <Input
                placeholder="Tên nhóm"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="rounded-md"
            />
            <Input.TextArea
                placeholder="Mô tả nhóm"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                rows={3}
                className="rounded-md"
            />
        </div>
    );
};

export default StepOne;
