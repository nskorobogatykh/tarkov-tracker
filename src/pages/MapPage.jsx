import React, { useState, useEffect } from 'react';
import { useProgress } from '../context/ProgressContext';
import { locationStaticData } from '../data/locations';

export const MapPage = ({ locationName, onBack, onQuestClick }) => {
    const {
        questsData,
        userProgress,
        setUserProgress,
        mapRaidCompletedQuestIds,
        setMapRaidCompletedQuestIds
    } = useProgress();

    const [activeExtracts, setActiveExtracts] = useState([]);
    const [showPmc, setShowPmc] = useState(true);

    const locData = locationStaticData[locationName];

    useEffect(() => {
        if (locData?.extracts) {
            setActiveExtracts(locData.extracts.map(e => e.id));
        }
        setMapRaidCompletedQuestIds([]);
    }, [locationName, locData]);

    const activeQuests = questsData.filter(q => userProgress.takenQuestIds.includes(q.id));
    const specificQuests = activeQuests.filter(q => {
        const locs = Array.isArray(q.location) ? q.location : [q.location];
        return locs.includes(locationName);
    });
    const anyQuests = activeQuests.filter(q => {
        const locs = Array.isArray(q.location) ? q.location : [q.location];
        return locs.includes('Любая');
    });

    const handleQuestCheck = (qId, checked) => {
        if (checked) {
            setMapRaidCompletedQuestIds(prev => [...prev, qId]);
        } else {
            setMapRaidCompletedQuestIds(prev => prev.filter(id => id !== qId));
        }
    };

    const handleSubtaskCheck = (stId, checked) => {
        setUserProgress(prev => {
            const nextSubtasks = checked
                ? [...prev.completedSubtasks, stId]
                : prev.completedSubtasks.filter(id => id !== stId);
            return { ...prev, completedSubtasks: nextSubtasks };
        });
    };

    const toggleExtract = (id) => {
        setActiveExtracts(prev => prev.includes(id) ? prev.filter(eId => eId !== id) : [...prev, id]);
    };

    return (
        <div className="map-page-layout">
            <div className="map-sidebar">
                <button className="btn-back" onClick={onBack}>&larr; Назад</button>
                <h2 style={{ margin: '10px 0 0 0', color: '#d1b880' }}>{locationName}</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem' }}>
                        <input type="checkbox" checked={showPmc} onChange={(e) => setShowPmc(e.target.checked)} />
                        Отображать PMC спавны
                    </label>
                </div>

                <div style={{ marginTop: '10px' }}>
                    <h4 style={{ color: '#aaa', marginBottom: '8px', fontSize: '0.9rem' }}>Задачи в рейде:</h4>
                    {[...specificQuests, ...anyQuests].map(quest => {
                        const isRaidDone = mapRaidCompletedQuestIds.includes(quest.id);
                        return (
                            <div key={quest.id} className={`quest-row ${isRaidDone ? 'quest-completed-strikethrough' : ''}`} style={{ flexDirection: 'column', alignItems: 'stretch', padding: '8px' }}>
                                <div className="quest-info-block">
                                    <input type="checkbox" checked={isRaidDone} onChange={(e) => handleQuestCheck(quest.id, e.target.checked)} />
                                    <span className="trader-badge-tag">{quest.trader}</span>
                                    <span className="quest-title-text" style={{ cursor: 'pointer' }} onClick={() => onQuestClick(quest.id)}>{quest.title}</span>
                                </div>
                                {quest.subtasks && (
                                    <div className="subtask-list" style={{ marginTop: '5px' }}>
                                        {quest.subtasks.map(st => {
                                            const isDone = userProgress.completedSubtasks.includes(st.id);
                                            return (
                                                <div key={st.id} className={`subtask-item ${isDone ? 'completed' : ''}`}>
                                                    <input type="checkbox" checked={isDone} onChange={(e) => handleSubtaskCheck(st.id, e.target.checked)} />
                                                    <span>{st.text}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="map-main-area">
                <div className="extracts-bar">
                    <span style={{ fontSize: '0.9rem', color: '#aaa' }}>Выходы:</span>
                    <div className="extracts-chips">
                        {locData?.extracts?.map(ext => (
                            <div
                                key={ext.id}
                                className={`extract-chip ${activeExtracts.includes(ext.id) ? 'active' : ''}`}
                                onClick={() => toggleExtract(ext.id)}
                            >
                                {ext.name}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Интерактивное полотно */}
                <div id="leaflet-map-container" style={{ position: 'relative' }}>
                    {locData ? (
                        <div style={{ width: '100%', height: '100%', backgroundImage: `url(${locData.imageUrl})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
                            {/* Тут вы можете подключить полноценную Leaflet карту через базовый useEffect */}
                        </div>
                    ) : (
                        <div style={{ color: '#aaa', padding: '20px' }}>Карта еще не добавлена</div>
                    )}
                </div>
            </div>
        </div>
    );
};
