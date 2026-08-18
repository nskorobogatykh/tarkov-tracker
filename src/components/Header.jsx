import React from 'react';
import { locationStaticData } from '../data/locations';

export const Header = ({ activeTab, onNavigate }) => {
    return (
        <header className="bg-zinc-900 border-b-2 border-zinc-800 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto rounded-t-md mb-6">
            <h1 className="text-xl font-bold text-amber-400 tracking-wide cursor-pointer" onClick={() => onNavigate('traders')}>
                Tarkov Companion
            </h1>

            <nav className="flex items-center gap-3">
                <button
                    onClick={() => onNavigate('traders')}
                    className={`px-4 py-2 text-sm font-bold rounded transition ${activeTab === 'traders' ? 'bg-amber-400 text-black' : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'}`}
                >
                    Торговцы
                </button>
                <button
                    onClick={() => onNavigate('active-quests')}
                    className={`px-4 py-2 text-sm font-bold rounded transition ${activeTab === 'active-quests' ? 'bg-amber-400 text-black' : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'}`}
                >
                    Взятые квесты
                </button>

                {/* Дропдаун карт на чистом Tailwind CSS */}
                <div className="relative group">
                    <button className={`px-4 py-2 text-sm font-bold rounded bg-zinc-800 text-gray-300 hover:bg-zinc-700 group-hover:text-amber-400 flex items-center gap-1`}>
                        Карты <span>▾</span>
                    </button>
                    <div className="absolute top-full right-0 mt-1 bg-zinc-900 border border-zinc-800 rounded shadow-xl hidden group-hover:block z-50 min-width-[160px] py-1 divide-y divide-zinc-800/40">
                        {Object.keys(locationStaticData).map(loc => (
                            <a
                                key={loc}
                                href="#"
                                onClick={(e) => { e.preventDefault(); onNavigate('map', loc); }}
                                className="block px-4 py-2 text-xs font-semibold text-gray-400 hover:bg-zinc-800 hover:text-amber-400 whitespace-nowrap"
                            >
                                {loc}
                            </a>
                        ))}
                    </div>
                </div>
            </nav>
        </header>
    );
};
