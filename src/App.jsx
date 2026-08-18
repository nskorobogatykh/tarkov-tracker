import React, { useState } from 'react';
import { ProgressProvider, useProgress } from './context/ProgressContext';
import { Header } from './components/Header';
import { TradersPage } from './pages/TradersPage';
import { ActiveQuestsPage } from './pages/ActiveQuestsPage';
import { MapPage } from './pages/MapPage';
import { QuestDetailPage } from './pages/QuestDetailPage';

function AppContent() {
  const [activePage, setActivePage] = useState('traders'); // 'traders', 'active-quests', 'map', 'quest-details'
  const [previousPage, setPreviousPage] = useState('traders');
  const [selectedQuestId, setSelectedQuestId] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const { userProgress, flushAllPendingCompletions } = useProgress();

  const handlePageChange = (page) => {
    flushAllPendingCompletions(); // старая сессионная логика сдачи квестов
    setPreviousPage(activePage);
    setActivePage(page);
  };

  const handleQuestClick = (questId) => {
    if (activePage !== 'quest-details') {
      setPreviousPage(activePage);
    }
    setSelectedQuestId(questId);
    setActivePage('quest-details');
  };

  const handleLocationClick = (locName) => {
    flushAllPendingCompletions();
    setSelectedLocation(locName);
    setActivePage('map');
  };

  return (
    <>
      <Header
        activePage={activePage}
        setActivePage={handlePageChange}
        takenCount={userProgress.takenQuestIds.length}
        onMapSelect={handleLocationClick}
      />

      <main style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {activePage === 'traders' && (
          <TradersPage onQuestClick={handleQuestClick} />
        )}
        {activePage === 'active-quests' && (
          <ActiveQuestsPage onQuestClick={handleQuestClick} onLocationClick={handleLocationClick} />
        )}
        {activePage === 'map' && (
          <MapPage
            locationName={selectedLocation}
            onBack={() => handlePageChange('active-quests')}
            onQuestClick={handleQuestClick}
          />
        )}
        {activePage === 'quest-details' && (
          <QuestDetailPage
            questId={selectedQuestId}
            onBack={() => handlePageChange(previousPage)}
          />
        )}
      </main>
    </>
  );
}

export default function App() {
  return (
    <ProgressProvider>
      <AppContent />
    </ProgressProvider>
  );
}
