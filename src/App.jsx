import React, { useState } from 'react';
import { Header } from './components/Header';
import { TradersPage } from './pages/TradersPage';
import { ActiveQuestsPage } from './pages/ActiveQuestsPage';
import { MapPage } from './pages/MapPage';
import { QuestDetailPage } from './pages/QuestDetailPage';
import { ProgressProvider } from './context/ProgressContext';

export default function App() {
  const [view, setView] = useState('traders'); // 'traders', 'active-quests', 'map', 'quest-detail'
  const [activeParam, setActiveParam] = useState(null); // ID квеста или имя локации

  const handleNavigation = (targetView, param = null) => {
    setView(targetView);
    setActiveParam(param);
  };

  return (
    <ProgressProvider>
      <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 font-sans antialiased">
        <Header activeTab={view} onNavigate={handleNavigation} />

        <main className="max-w-7xl mx-auto">
          {view === 'traders' && <TradersPage onNavigate={handleNavigation} />}
          {view === 'active-quests' && <ActiveQuestsPage onNavigate={handleNavigation} />}
          {view === 'map' && <MapPage activeLocation={activeParam} onNavigate={handleNavigation} />}
          {view === 'quest-detail' && <QuestDetailPage questId={activeParam} onNavigate={handleNavigation} />}
        </main>
      </div>
    </ProgressProvider>
  );
}
