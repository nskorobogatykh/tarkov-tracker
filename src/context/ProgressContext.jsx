import React, { createContext, useContext, useState, useEffect } from 'react';
import { questsData } from '../data/quests';
import { loyaltyThresholds } from '../data/traders';

const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
    const [progress, setProgress] = useState(() => {
        const saved = localStorage.getItem('tarkov_react_state');
        return saved ? JSON.parse(saved) : {
            takenQuestIds: [],
            completedQuestIds: [],
            completedSubtasks: [],
            subtaskProgress: {}
        };
    });

    useEffect(() => {
        localStorage.setItem('tarkov_react_state', JSON.stringify(progress));
    }, [progress]);

    // Взять или отменить квест
    const toggleTakeQuest = (id) => {
        setProgress(prev => {
            const isTaken = prev.takenQuestIds.includes(id);
            return {
                ...prev,
                takenQuestIds: isTaken
                    ? prev.takenQuestIds.filter(qId => qId !== id)
                    : [...prev.takenQuestIds, id],
                // Если берем квест, убираем из выполненных
                completedQuestIds: prev.completedQuestIds.filter(qId => qId !== id)
            };
        });
    };

    // Сдать квест целиком
    const toggleCompleteQuest = (id) => {
        setProgress(prev => {
            const isCompleted = prev.completedQuestIds.includes(id);
            return {
                ...prev,
                completedQuestIds: isCompleted
                    ? prev.completedQuestIds.filter(qId => qId !== id)
                    : [...prev.completedQuestIds, id],
                takenQuestIds: prev.takenQuestIds.filter(qId => qId !== id)
            };
        });
    };

    // Изменение подзадач
    const toggleSubtask = (subtaskId) => {
        setProgress(prev => {
            const isDone = prev.completedSubtasks.includes(subtaskId);
            return {
                ...prev,
                completedSubtasks: isDone
                    ? prev.completedSubtasks.filter(sId => sId !== subtaskId)
                    : [...prev.completedSubtasks, subtaskId]
            };
        });
    };

    // Динамический расчет лояльности торговца
    const calculateLoyalty = (traderName) => {
        const completed = questsData.filter(q => q.trader === traderName && progress.completedQuestIds.includes(q.id));
        const totalRep = completed.reduce((sum, q) => sum + (q.rewards?.rep || 0), 0);

        const thresholds = loyaltyThresholds[traderName] || { LL2: 0.2, LL3: 0.35, LL4: 0.6 };
        let level = 'I';
        if (totalRep >= thresholds.LL4) level = 'IV';
        else if (totalRep >= thresholds.LL3) level = 'III';
        else if (totalRep >= thresholds.LL2) level = 'II';

        return { level, rep: totalRep.toFixed(2), doneCount: completed.length };
    };

    return (
        <ProgressContext.Provider value={{ progress, toggleTakeQuest, toggleCompleteQuest, toggleSubtask, calculateLoyalty, setProgress }}>
            {children}
        </ProgressContext.Provider>
    );
};

export const useProgress = () => useContext(ProgressContext);
