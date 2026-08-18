import React, { useState } from 'react';
import { locationStaticData } from '../data/locations';
import { questsData } from '../data/quests';
import { useProgress } from '../context/ProgressContext';

export const MapPage = ({ activeLocation, onNavigate }) => {
    const { progress, toggleSubtask } = useProgress();
    const [showPmc, setShowPmc] = useState(true);
    const [selectedExtracts, setSelectedExtracts] = useState([]);

    const locData = locationStaticData[activeLocation];
    if (!locData) return <div className="text-center p-8 text-gray-500">Выберите корректную карту из меню.</div>;

    // Собираем невыполненные задачи для карты
    const mapQuests = questsData.filter(q =>
        progress.takenQuestIds.includes(q.id) &&
        (q.location.includes(activeLocation) || q.location.includes('Любая'))
    );

    const toggleExtract = (id) => {
        setSelectedExtracts(prev => prev.includes(id) ? prev.filter(eId => sId !== id) : [...prev, id]);
    };

    return (
        <div className="grid grid-cols-1 xl:grid-cols-[340px_1fr] gap-4 h-[calc(100vh-120px)]">
            {/* Боковая панель рейда */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-md p-4 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-4">
                    <button onClick={() => onNavigate('active-quests')} className="w-full bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-xs py-2 rounded font-bold transition">
                        &larr; Вернуться к задачам
                    </button>

                    <div>
                        <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Выходы в рейде</h3>
                        <div className="flex flex-wrap gap-1.5">
                            {locData.extracts?.map(ext => {
                                const isActive = selectedExtracts.includes(ext.id);
                                return (
                                    <button
                                        key={ext.id}
                                        onClick={() => toggleExtract(ext.id)}
                                        className={`text-xs px-2.5 py-1 rounded-full border transition ${isActive ? 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold' : 'bg-zinc-950 border-zinc-800 text-zinc-500'}`}
                                    >
                                        {ext.name}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="border-t border-zinc-800 pt-3">
                        <h3 className="text-sm font-bold text-gray-400 mb-2 uppercase tracking-wider">Задачи локации</h3>
                        <div className="space-y-2">
                            {mapQuests.map(quest => (
                                <div key={quest.id} className="bg-zinc-950/60 p-2.5 rounded border border-zinc-800/80">
                                    <div className="text-xs font-bold text-amber-400/90 mb-1">{quest.title}</div>
                                    <div className="space-y-1 pl-1">
                                        {quest.subtasks?.map(st => {
                                            const isDone = progress.completedSubtasks.includes(st.id);
                                            return (
                                                <label key={st.id} className={`flex items-center gap-2 text-xs cursor-pointer ${isDone ? 'line-through text-zinc-700' : 'text-zinc-400'}`}>
                                                    <input type="checkbox" checked={isDone} onChange={() => toggleSubtask(st.id)} className="w-3.5 h-3.5 accent-amber-400" />
                                                    <span>{st.text}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <label className="flex items-center gap-2 bg-zinc-950 p-2.5 rounded border border-zinc-800 text-sm text-gray-300 mt-4 cursor-pointer">
                    <input type="checkbox" checked={showPmc} onChange={(e) => setShowPmc(e.target.checked)} className="accent-red-500" />
                    <span>Показывать спавны ЧВК</span>
                </label>
            </div>

            {/* Область интерактивной карты */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-md relative overflow-hidden flex items-center justify-center p-4">
                <div className="relative max-w-full max-h-full">
                    {/* Фновая заглушка-изображение карты */}
                    <img
                        src="https://placehold.co"
                        alt={activeLocation}
                        className="w-full object-contain rounded border border-zinc-800/40"
                    />

                    {/* Статичное название карты по центру */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/80 px-6 py-2 rounded-md border border-zinc-800 text-xl font-bold text-amber-400 tracking-wide shadow-xl">
                        {activeLocation}
                    </div>

                    {/* Пример рендера интерактивной метки (PMC Spawn) */}
                    {showPmc && locData.spawns?.pmc.map((coords, i) => (
                        <div
                            key={i}
                            style={{ top: `${coords[0] / 10}%`, left: `${coords[1] / 10}%` }}
                            className="absolute w-6 h-6 bg-red-600 border border-black text-[10px] text-white font-bold rounded-full flex items-center justify-center shadow-lg transform -translate-x-1/2 -translate-y-1/2"
                            title="PMC Spawn"
                        >
                            P
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
