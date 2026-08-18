import React from 'react';
import { questsData } from '../data/quests';

export const QuestDetailPage = ({ questId, onNavigate }) => {
    const quest = questsData.find(q => q.id === questId);
    if (!quest) return <div className="p-4 text-center">Квест не найден.</div>;

    return (
        <div className="bg-zinc-900 border border-zinc-800 rounded-md p-6 max-w-3xl mx-auto space-y-6">
            <button onClick={() => onNavigate('traders')} className="bg-zinc-800 hover:bg-zinc-700 text-amber-400 text-sm px-4 py-2 rounded font-bold transition">
                &larr; К списку торговцев
            </button>

            <div className="border-b border-zinc-800 pb-4">
                <h1 className="text-2xl font-bold text-amber-400 mb-2">{quest.title}</h1>
                <div className="flex gap-2">
                    <span className="bg-zinc-950 text-xs px-2.5 py-1 rounded text-zinc-400 border border-zinc-800 font-bold">{quest.trader}</span>
                    <span className="bg-zinc-950 text-xs px-2.5 py-1 rounded text-blue-400 border border-zinc-800 font-bold">LL{quest.minLoyalty || 1}</span>
                    {quest.location.map(l => (
                        <span key={l} className="bg-zinc-950 text-xs px-2.5 py-1 rounded text-amber-200 border border-zinc-800">{l}</span>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <h3 className="text-zinc-400 font-bold uppercase tracking-wider text-xs">Описание</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{quest.description}</p>
            </div>

            <div className="space-y-2">
                <h3 className="text-zinc-400 font-bold uppercase tracking-wider text-xs">Подзадачи</h3>
                <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 pl-1">
                    {quest.subtasks?.map(st => <li key={st.id}>{st.text}</li>)}
                </ul>
            </div>

            <div className="bg-zinc-950 p-4 rounded border border-zinc-800/80">
                <h3 className="text-zinc-500 font-bold uppercase tracking-wider text-xs mb-2">Награды</h3>
                <div className="flex gap-4 text-sm font-semibold">
                    <span className="text-emerald-400">+{quest.rewards.rep} репутации</span>
                    <span className="text-blue-400">+{quest.rewards.xp} Опыта</span>
                </div>
            </div>
        </div>
    );
};
