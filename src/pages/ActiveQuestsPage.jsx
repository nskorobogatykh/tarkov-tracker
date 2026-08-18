import React, { useState } from 'react';
import { questsData } from '../data/quests';
import { locationStaticData } from '../data/locations';
import { useProgress } from '../context/ProgressContext';

export const ActiveQuestsPage = ({ onNavigate }) => {
    const { progress, toggleSubtask, toggleCompleteQuest } = useProgress();
    const [locFilter, setLocFilter] = useState('ALL');

    const activeQuests = questsData.filter(q => progress.takenQuestIds.includes(q.id));

    // Логика фильтрации
    const filteredQuests = activeQuests.filter(q => {
        if (locFilter === 'ALL') return true;
        return q.location.includes(locFilter);
    });

    return (
        <div className="grid grid-columns-1 lg:grid-cols-[1fr_320px] gap-6">
            {/* Основной блок активных задач */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-400">Квесты в работе</h2>
                    <select
                        value={locFilter}
                        onChange={(e) => setLocFilter(e.target.value)}
                        className="bg-zinc-800 text-amber-400 border border-zinc-700 rounded px-3 py-1.5 outline-none text-sm cursor-pointer"
                    >
                        <option value="ALL">Все локации</option>
                        {Object.keys(locationStaticData).map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                </div>

                {filteredQuests.length === 0 ? (
                    <div className="text-zinc-600 p-6 bg-zinc-900/20 rounded border border-zinc-800/40">Нет взятых задач. Наберите квесты во вкладке "Торговцы".</div>
                ) : (
                    filteredQuests.map(quest => (
                        <div key={quest.id} className="p-4 bg-zinc-900 border border-zinc-800 rounded-md">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        onChange={() => toggleCompleteQuest(quest.id)}
                                        className="w-4 h-4 accent-amber-400 cursor-pointer"
                                    />
                                    <span
                                        onClick={() => onNavigate('quest-detail', quest.id)}
                                        className="font-bold text-amber-400 cursor-pointer hover:underline"
                                    >
                                        {quest.title}
                                    </span>
                                    <span className="text-xs bg-zinc-800 text-gray-400 px-1.5 py-0.5 rounded font-mono">{quest.trader}</span>
                                </div>
                                <div className="flex gap-1">
                                    {quest.location.map(l => (
                                        <span key={l} className="text-xs bg-zinc-800 text-gray-300 px-2 py-0.5 rounded border border-zinc-700">{l}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Список подзадач */}
                            {quest.subtasks && (
                                <div className="mt-3 pl-7 space-y-2 border-l border-zinc-800">
                                    {quest.subtasks.map(st => {
                                        const isDone = progress.completedSubtasks.includes(st.id);
                                        return (
                                            <label key={st.id} className={`flex items-center gap-2 text-sm cursor-pointer ${isDone ? 'line-through text-zinc-600' : 'text-zinc-400'}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={isDone}
                                                    onChange={() => toggleSubtask(st.id)}
                                                    className="accent-amber-400"
                                                />
                                                <span>{st.text}</span>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Правая боковая панель: Агрегатор локаций */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-md p-4 h-fit space-y-3">
                <h3 className="font-bold text-gray-300 text-sm tracking-wide uppercase border-b border-zinc-800 pb-2">План рейдов</h3>
                <div className="space-y-1">
                    {Object.keys(locationStaticData).map(locName => {
                        let specCount = 0;
                        let anyCount = 0;

                        activeQuests.forEach(q => {
                            if (q.location.includes('Любая')) anyCount++;
                            else if (q.location.includes(locName)) specCount++;
                        });

                        const total = specCount + anyCount;

                        return (
                            <div
                                key={locName}
                                onClick={() => onNavigate('map', locName)}
                                className={`flex justify-between items-center p-2 rounded text-sm cursor-pointer hover:bg-zinc-800/80 transition ${total === 0 ? 'opacity-40' : 'bg-zinc-950/40 border border-zinc-800/50'}`}
                            >
                                <span className="text-gray-300 font-medium">{locName}</span>
                                <span className="font-mono font-bold text-amber-400">
                                    {specCount} {anyCount > 0 && <span className="text-zinc-600 text-xs font-normal">(+{anyCount})</span>}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
