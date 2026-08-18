import React from 'react';
import { allLocations } from '../data/locations';

export const Header = ({ activePage, setActivePage, takenCount, onMapSelect }) => {
    return (
        <header className="app-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <h1>Tarkov Quest Companion</h1>
            </div>

            <div className="nav-tabs">
                <button
                    className={`tab-btn ${activePage === 'traders' ? 'active' : ''}`}
                    onClick={() => setActivePage('traders')}
                >
                    Торговцы
                </button>

                <button
                    className={`tab-btn ${activePage === 'active-quests' ? 'active' : ''}`}
                    onClick={() => setActivePage('active-quests')}
                >
                    Взятые квесты
                    <span className="tab-badge">{takenCount}</span>
                </button>

                <div className="nav-dropdown">
                    <button className={`tab-btn ${activePage === 'map' ? 'active' : ''}`}>
                        Карта ▾
                    </button>
                    <div className="nav-dropdown-content">
                        {allLocations.map(loc => (
                            <a
                                key={loc}
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    onMapSelect(loc);
                                }}
                            >
                                {loc}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
};
