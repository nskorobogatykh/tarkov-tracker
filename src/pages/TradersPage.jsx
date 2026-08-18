import React, { useState } from 'react';
import { useProgress } from '../context/ProgressContext';
import { getLocationClass } from '../data/locations';

export const TradersPage = ({ onQuestClick }) => {
    const {
        questsData,
        userProgress,
        setUserProgress,
        tradersTabSessionCompleted,
        setTradersTabSessionCompleted,
        calculateTraderLoyalty
    } = useProgress();

    // Начальное состояние: первые 4 торговца открыты по умолчанию, уровни лояльности свернуты
    const [openTraders, setOpenTraders] = useState(['Прапор', 'Терапевт', 'Механик', 'Лыжник']);
    const [openLLGroups, setOpenLLGroups] = useState([]);

    const toggleTrader = (trader) => {
        setOpenTraders(prev =>
            prev.includes(trader) ? prev.filter(t => t !== trader) : [...prev, trader]
        );
    };

    const toggleLL = (groupKey) => {
        setOpenLLGroups(prev =>
            prev.includes(groupKey) ? prev.filter(k => k !== groupKey) : [...prev, groupKey]
        );
    };

    // Группируем все квесты по именам их торговцев
    const tradersGrouped = {};
    questsData.forEach(q => {
        if (!tradersGrouped[q.trader]) tradersGrouped[q.trader] = [];
        tradersGrouped[q.trader].push(q);
    });

    return (
        <div className="container">
            <h2>Торговцы и список всех квестов</h2>

            {Object.keys(tradersGrouped).map(traderName => {
                const quests = tradersGrouped[traderName];
                const { level, rep } = calculateTraderLoyalty(traderName);

                // Считаем количество выполненных квестов для счетчика в шапке
                const completedCount = quests.filter(q =>
                    userProgress.completedQuestIds.includes(q.id) || tradersTabSessionCompleted.includes(q.id)
                ).length;

                const isTraderOpen = openTraders.includes(traderName);

                // Распределяем квесты торговца по его внутренним уровням лояльности (LL 1-4)
                const llGroups = { 1: [], 2: [], 3: [], 4: [] };
                quests.forEach(q => {
                    const ll = q.minLoyalty || 1;
                    if (llGroups[ll]) llGroups[ll].push(q);
                });
                return (
                    <div key={traderName} className={`trader-accordion ${isTraderOpen ? 'open' : ''}`}>
                        {/* Шапка торговца с динамическим уровнем лояльности и репутацией */}
                        <div className="trader-header-bar" onClick={() => toggleTrader(traderName)}>
                            <div className="trader-title-info">
                                <span className="trader-name-text">{traderName}</span>
                                <span className="trader-stats-badge">
                                    {level} - уровень лояльности | {rep} реп
                                </span>
                            </div>
                            <div className="trader-stats-badge">Сделано: {completedCount} / {quests.length}</div>
                        </div>

                        {/* Внутреннее содержимое аккордеона торговца */}
                        <div className="trader-content" style={{ display: isTraderOpen ? 'block' : 'none' }}>
                            {Object.keys(llGroups).map(llLevel => {
                                const llQuests = llGroups[llLevel];
                                if (llQuests.length === 0) return null;

                                const llCompletedCount = llQuests.filter(q =>
                                    userProgress.completedQuestIds.includes(q.id) || tradersTabSessionCompleted.includes(q.id)
                                ).length;

                                const isLLAllDone = llCompletedCount === llQuests.length;
                                const groupKey = `${traderName}_LL${llLevel}`;
                                const isLLOpen = openLLGroups.includes(groupKey);

                                return (
                                    <div
                                        key={llLevel}
                                        className={`ll-group ${isLLAllDone ? 'all-completed' : ''} ${isLLOpen ? 'open' : ''}`}
                                    >
                                        {/* Кликабельный заголовок уровня лояльности (LL) */}
                                        <div className="ll-header" onClick={() => toggleLL(groupKey)}>
                                            <span>Уровень лояльности {llLevel}</span>
                                            <span>Сделано: {llCompletedCount} / {llQuests.length}</span>
                                        </div>

                                        {/* Список квестов внутри конкретного уровня лояльности */}
                                        <div className="ll-content" style={{ display: isLLOpen ? 'block' : 'none' }}>
                                            {llQuests.map(quest => {
                                                const isSavedCompleted = userProgress.completedQuestIds.includes(quest.id);
                                                const isSessionCompleted = tradersTabSessionCompleted.includes(quest.id);
                                                const isCompleted = isSavedCompleted || isSessionCompleted;
                                                const isTaken = userProgress.takenQuestIds.includes(quest.id);
                                                const locList = Array.isArray(quest.location) ? quest.location : [quest.location];

                                                return (
                                                    <div key={quest.id} className={`quest-row ${isCompleted ? 'status-completed' : ''}`}>
                                                        <div className="quest-info-block" style={{ flex: 1 }}>
                                                            <input
                                                                type="checkbox"
                                                                className="subtask-checkbox quest-done-check"
                                                                checked={isCompleted}
                                                                onChange={(e) => {
                                                                    if (e.target.checked) {
                                                                        // Используем функцию-модификатор стейта для гарантированного триггера ререндера
                                                                        setTradersTabSessionCompleted(prev => [...prev, quest.id]);
                                                                        setUserProgress(prev => ({
                                                                            ...prev,
                                                                            takenQuestIds: prev.takenQuestIds.filter(id => id !== quest.id)
                                                                        }));
                                                                    } else {
                                                                        setTradersTabSessionCompleted(prev => prev.filter(id => id !== quest.id));
                                                                        setUserProgress(prev => ({
                                                                            ...prev,
                                                                            completedQuestIds: prev.completedQuestIds.filter(id => id !== quest.id)
                                                                        }));
                                                                    }
                                                                }}
                                                            />
                                                            <span
                                                                className="quest-title-text open-quest-detail"
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() => onQuestClick(quest.id)}
                                                            >
                                                                {quest.title}
                                                            </span>
                                                            {quest.rewards && (
                                                                <div className="quest-rewards-block">
                                                                    {quest.rewards.rep && <span className="rw-rep">+{quest.rewards.rep} реп</span>}
                                                                    {quest.rewards.xp && <span className="rw-xp">+{quest.rewards.xp} XP</span>}
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="quest-location-right">
                                                            {locList.map(loc => (
                                                                <span key={loc} className={`loc-badge ${getLocationClass(loc)}`}>
                                                                    {loc}
                                                                </span>
                                                            ))}
                                                        </div>

                                                        <div className="quest-actions">
                                                            <button
                                                                className={`btn-take ${isTaken ? 'taken' : ''}`}
                                                                onClick={() => {
                                                                    setUserProgress(prev => {
                                                                        if (isTaken) {
                                                                            return {
                                                                                ...prev,
                                                                                takenQuestIds: prev.takenQuestIds.filter(id => id !== quest.id)
                                                                            };
                                                                        } else {
                                                                            setTradersTabSessionCompleted(p => p.filter(id => id !== quest.id));
                                                                            return {
                                                                                ...prev,
                                                                                takenQuestIds: [...prev.takenQuestIds, quest.id],
                                                                                completedQuestIds: prev.completedQuestIds.filter(id => id !== quest.id)
                                                                            };
                                                                        }
                                                                    });
                                                                }}
                                                            >
                                                                {isTaken ? 'Отменить' : 'Взять квест'}
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
                    </div>
                );
            })}
        </div>
    );
};
