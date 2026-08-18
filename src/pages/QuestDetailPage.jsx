import React from 'react';
import { useProgress } from '../context/ProgressContext';
import { getLocationClass } from '../data/locations';

export const QuestDetailPage = ({ questId, onBack }) => {
    const { questsData } = useProgress();
    const quest = questsData.find(q => q.id === questId);

    if (!quest) return <div>Квест не найден</div>;

    const locList = Array.isArray(quest.location) ? quest.location : [quest.location];

    return (
        <div className="container">
            <div style={{ marginBottom: '20px' }}>
                <button className="btn-gold" onClick={onBack}>&larr; Назад</button>
            </div>

            <div style={{ borderBottom: '1px solid #333', paddingBottom: '12px', marginBottom: '16px' }}>
                <h1 style={{ color: '#d1b880', margin: '0 0 8px 0' }}>{quest.title}</h1>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="trader-badge-tag">{quest.trader}</span>
                    <span className="badge-ll">LL{quest.minLoyalty || 1}</span>
                    {locList.map(loc => (
                        <span key={loc} className={`loc-badge ${getLocationClass(loc)}`}>{loc}</span>
                    ))}
                </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
                <h4 style={{ color: '#d1b880', marginBottom: '6px' }}>Описание квеста</h4>
                <p style={{ color: '#ccc', lineHeight: '1.5' }}>{quest.description || 'Описание отсутствует.'}</p>
            </div>

            <div style={{ marginBottom: '16px' }}>
                <h4 style={{ color: '#d1b880', marginBottom: '6px' }}>Награды за выполнение</h4>
                <div className="quest-rewards-block" style={{ marginLeft: 0 }}>
                    {quest.rewards?.rep && <span className="rw-rep">+{quest.rewards.rep} реп</span>}
                    {quest.rewards?.xp && <span className="rw-xp">+{quest.rewards.xp} XP</span>}
                    {quest.rewards?.money && <span className="rw-money">{quest.rewards.money.toLocaleString()} ₽</span>}
                </div>
            </div>
        </div>
    );
};
