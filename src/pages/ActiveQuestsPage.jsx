import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { allLocations, getLocationClass } from '../data/locations';

export const ActiveQuestsPage = ({ onQuestClick, onLocationClick }) => {
    const {
        questsData,
        userProgress,
        setUserProgress,
        activeTabCompletedQuestIds,
        setActiveTabCompletedQuestIds
    } = useProgress();

    const [locationFilter, setLocationFilter] = useState('ALL');

    const activeQuests = questsData.filter(q => userProgress.takenQuestIds.includes(q.id));

    // Получение списка уникальных локаций для селекта
    const locSet = new Set();
    activeQuests.forEach(q => {
        const locs = Array.isArray(q.location) ? q.location : [q.location];
        locs.forEach(l => locSet.add(l));
    });
    const sortedLocations = Array.from(locSet).sort((a, b) => a.localeCompare(b, 'ru'));

    const filteredQuests = activeQuests.filter(q => {
        if (locationFilter === 'ALL') return true;
        const locs = Array.isArray(q.location) ? q.location : [q.location];
        return locs.includes(locationFilter);
    });

    const groupedByTrader = {};
    filteredQuests.forEach(q => {
        if (!groupedByTrader[q.trader]) groupedByTrader[q.trader] = [];
        groupedByTrader[q.trader].push(q);
    });

    const handleSubtaskChange = (stId, checked) => {
        setUserProgress(prev => {
            const nextSubtasks = checked
                ? [...prev.completedSubtasks, stId]
                : prev.completedSubtasks.filter(id => id !== stId);
            return { ...prev, completedSubtasks: nextSubtasks };
        });
    };

    const handleCounterChange = (st, value) => {
        const val = Math.max(0, Math.min(st.target, value));
        setUserProgress(prev => {
            const nextProgress = { ...prev.subtaskProgress, [st.id]: val };
            let nextSubtasks = [...prev.completedSubtasks];

            if (val >= st.target && !nextSubtasks.includes(st.id)) {
                nextSubtasks.push(st.id);
            } else if (val < st.target) {
                nextSubtasks = nextSubtasks.filter(id => id !== st.id);
            }

            return { ...prev, subtaskProgress: nextProgress, completedSubtasks: nextSubtasks };
        });
    };

    return (
        <div className="layout">
            <div>
                <h2>Квесты в работе</h2>

                {activeQuests.length === 0 ? (
                    <div style={{ color: '#666', padding: '20px' }}>Нет взятых квестов. Возьмите их во вкладке "Торговцы".</div>
                ) : (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '16px' }}>Фильтр по локации:</span>
                            <select
                                className="location-filter-select"
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                            >
                                <option value="ALL">Все локации</option>
                                {sortedLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                            </select>
                        </div>

                        {Object.keys(groupedByTrader).map(traderName => (
                            <div key={traderName} style={{ marginBottom: '20px' }}>
                                <h3 style={{ color: '#d1b880', borderBottom: '1px solid #333', paddingBottom: '4px', marginBottom: '10px', fontSize: '1.1rem' }}>
                                    {traderName}
                                </h3>
                                {groupedByTrader[traderName].map(quest => {
                                    const isCompletedInSession = activeTabCompletedQuestIds.includes(quest.id);
                                    const locList = Array.isArray(quest.location) ? quest.location : [quest.location];

                                    return (
                                        <div key={quest.id} className={`quest-row ${isCompletedInSession ? 'status-completed' : ''}`} style={{ flexDirection: 'column', alignItems: 'stretch' }}>
                                            <div className="quest-info-block" style={{ justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px', cursor: 'pointer' }}>
                                                    <input
                                                        type="checkbox"
                                                        className="subtask-checkbox"
                                                        checked={isCompletedInSession}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setActiveTabCompletedQuestIds(prev => [...prev, quest.id]);
                                                            } else {
                                                                setActiveTabCompletedQuestIds(prev => prev.filter(id => id !== quest.id));
                                                            }
                                                        }}
                                                    />
                                                    <span className="quest-title-text open-quest-detail" style={{ fontSize: '1.05rem', marginLeft: '8px' }} onClick={() => onQuestClick(quest.id)}>
                                                        {quest.title}
                                                    </span>
                                                    <span className="badge-ll">LL{quest.minLoyalty || 1}</span>
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    {locList.map(loc => (
                                                        <span key={loc} className={`loc-badge ${getLocationClass(loc)}`} onClick={() => onLocationClick(loc)}>{loc}</span>
                                                    ))}
                                                </div>
                                            </div>

                                            {quest.subtasks && quest.subtasks.length > 0 && (
                                                <div className="subtask-list">
                                                    {quest.subtasks.map(st => {
                                                        const isDone = userProgress.completedSubtasks.includes(st.id);
                                                        const currentCount = userProgress.subtaskProgress[st.id] || 0;

                                                        return (
                                                            <div key={st.id} className={`subtask-item ${isDone ? 'completed' : ''}`}>
                                                                {st.type !== 'counter' ? (
                                                                    <>
                                                                        <input
                                                                            type="checkbox"
                                                                            className="subtask-checkbox"
                                                                            checked={isDone}
                                                                            onChange={(e) => handleSubtaskChange(st.id, e.target.checked)}
                                                                        />
                                                                        <span>{st.text}</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <span>{st.text}</span>
                                                                        <div className="subtask-counter">
                                                                            <button className="counter-btn" onClick={() => handleCounterChange(st, currentCount - 1)}>-</button>
                                                                            <input
                                                                                className="counter-input"
                                                                                type="number"
                                                                                value={currentCount}
                                                                                onChange={(e) => handleCounterChange(st, parseInt(e.target.value) || 0)}
                                                                            />
                                                                            <button className="counter-btn" onClick={() => handleCounterChange(st, currentCount + 1)}>+</button>
                                                                            <span className="counter-target-text">/ {st.target}</span>
                                                                        </div>
                                                                    </>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* Правый сайдбар агрегатора локаций */}
            <div className="sidebar">
                <h3 style={{ color: '#d1b880', marginBottom: '12px', fontSize: '1rem' }}>Локации</h3>
                {allLocations.map(locName => {
                    let specCount = 0;
                    let anyCount = 0;

                    activeQuests.forEach(q => {
                        const locs = Array.isArray(q.location) ? q.location : [q.location];
                        if (locs.includes('Любая')) anyCount++;
                        else if (locs.includes(locName)) specCount++;
                    });

                    const totalCount = specCount + anyCount;

                    return (
                        <div
                            key={locName}
                            className={`location-item ${getLocationClass(locName)} ${totalCount === 0 ? 'empty-loc' : ''}`}
                            onClick={() => totalCount > 0 && onLocationClick(locName)}
                        >
                            <span>{locName}</span>
                            <span className="location-count">
                                {specCount} {anyCount > 0 && <span style={{ opacity: 0.6 }}>(+{anyCount})</span>}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
