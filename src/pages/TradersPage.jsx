import React, { useState } from 'react';
import { questsData } from '../data/quests';
import { tradersList } from '../data/traders';
import { useProgress } from '../context/ProgressContext';

export const TradersPage = ({ onNavigate }) => {
    const { progress, toggleTakeQuest, toggleCompleteQuest, calculateLoyalty } = useProgress();
    const [openTraders, setOpenTraders] = useState(tradersList.slice(0, 3)); // первые 3 открыты по умолчанию

    const toggleTraderAccordion = (name) => {
        setOpenTraders(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-400">Торговцы и база квестов</h2>

            {tradersList.map(traderName => {
                const traderQuests = questsData.filter(q => q.trader === traderName);
                const { level, rep, doneCount } = calculateLoyalty(traderName);
                const isOpen = openTraders.includes(traderName);

                return (
                    <div key={traderName} className="bg-zinc-900 border border-zinc-800 rounded-md overflow-hidden">
                        {/* Шапка торговца */}
                        <div
                            onClick={() => toggleTraderAccordion(traderName)}
                            className="p-4 bg-zinc-800 flex justify-between items-center cursor-pointer hover:bg-zinc-700 transition"
                        >
                            <div className="flex items-center gap-4">
                                <span className="text-lg font-bold text-amber-400">{traderName}</span>
                                <span className="text-xs bg-black px-2 py-1 rounded text-gray-400">
                                    УЛ: {level} | {rep} реп
                                </span>
                            </div>
                            <div className="text-sm text-gray-400">Сделано: {doneCount} / {traderQuests.length}</div>
                        </div>

                        {/* Список квестов торговца */}
                        {isOpen && (
                            <div className="p-4 bg-zinc-950 space-y-2">
                                {[1, 2, 3, 4].map(ll => {
                                    const llQuests = traderQuests.filter(q => (q.minLoyalty || 1) === ll);
                                    if (llQuests.length === 0) return null;

                                    return (
                                        <div key={ll} className="border border-zinc-800/60 rounded mb-4">
                                            <div className="bg-zinc-900/50 p-2 text-sm text-amber-200/80 font-semibold border-b border-zinc-800/60">
                                                Уровень лояльности {ll}
                                            </div>
                                            <div className="divide-y divide-zinc-800/40">
                                                {llQuests.map(quest => {
                                                    const isCompleted = progress.completedQuestIds.includes(quest.id);
                                                    const isTaken = progress.takenQuestIds.includes(quest.id);

                                                    return (
                                                        <div
                                                            key={quest.id}
                                                            className={`p-3 flex items-center justify-between gap-4 transition ${isCompleted ? 'opacity-40 bg-zinc-900/20' : 'bg-zinc-900/40'}`}
                                                        >
                                                            <div className="flex items-center gap-3 flex-1">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isCompleted}
                                                                    onChange={() => toggleCompleteQuest(quest.id)}
                                                                    className="w-4 h-4 accent-amber-400 cursor-pointer"
                                                                />
                                                                <span
                                                                    onClick={() => onNavigate('quest-detail', quest.id)}
                                                                    className={`font-medium cursor-pointer hover:text-amber-300 transition ${isCompleted ? 'line-through text-gray-500' : 'text-gray-200'}`}
                                                                >
                                                                    {quest.title}
                                                                </span>
                                                                <span className="text-xs text-green-400 bg-emerald-950/40 border border-emerald-900 px-1.5 py-0.5 rounded">+{quest.rewards.rep} реп</span>
                                                            </div>

                                                            <div className="flex items-center gap-2">
                                                                {quest.location.map(loc => (
                                                                    <span
                                                                        key={loc}
                                                                        onClick={() => loc !== 'Любая' && onNavigate('map', loc)}
                                                                        className="text-xs font-bold px-2 py-0.5 rounded cursor-pointer bg-zinc-800 text-amber-400/90 border border-zinc-700 hover:brightness-125"
                                                                    >
                                                                        {loc}
                                                                    </span>
                                                                ))}
                                                                <button
                                                                    onClick={() => toggleTakeQuest(quest.id)}
                                                                    className={`text-xs font-bold px-3 py-1 rounded transition ${isTaken ? 'bg-red-900/40 text-red-300 border border-red-800' : 'bg-emerald-900/40 text-emerald-300 border border-emerald-800'}`}
                                                                >
                                                                    {isTaken ? 'Отменить' : 'Взять'}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
