import React, { useState } from 'react';
import TeamList from './components/TeamList';
import TeamDetail from './components/TeamDetail';
import TeamForm from './components/TeamForm';

const App = () => {
    const [selectedTeamId, setSelectedTeamId] = useState(null);
    const [isCreatingNewTeam, setIsCreatingNewTeam] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            {isCreatingNewTeam ? (
                // Truyền setIsCreatingNewTeam vào TeamForm
                <TeamForm setIsCreatingNewTeam={setIsCreatingNewTeam} />
            ) : selectedTeamId ? (
                <TeamDetail selectedTeamId={selectedTeamId} setSelectedTeamId={setSelectedTeamId} />
            ) : (
                <TeamList setSelectedTeamId={setSelectedTeamId} setIsCreatingNewTeam={setIsCreatingNewTeam} />
            )}
        </div>
    );
};

export default App;
