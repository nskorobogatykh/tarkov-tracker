import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialQuestsData } from '../data/quests';
import { loyaltyThresholds } from '../data/traders';

const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
    const [questsData] = useState(initialQuestsData);
    const [userProgress, setUserProgress] = useState(() => {
        return JSON.parse(localStorage.getItem('tarkov_app_state')) || {
            takenQuestIds: [],
            completedQuestIds: [],
            completedSubtasks: [],
            subtaskProgress: {}
        };
    });

    // Временные сессионные массивы для отложенного сохранения при переходах между вкладками
    const [tradersTabSessionCompleted, setTradersTabSessionCompleted] = useState([]);
    const [activeTabCompletedQuestIds, setActiveTabCompletedQuestIds] = useState([]);
    const [mapRaidCompletedQuestIds, setMapRaidCompletedQuestIds] = useState([]);

    useEffect(() => {
        localStorage.setItem('tarkov_app_state', JSON.stringify(userProgress));
    }, [userProgress]);

    const flushAllPendingCompletions = () => {
        const allPending = [
            ...tradersTabSessionCompleted,
            ...activeTabCompletedQuestIds,
            ...mapRaidCompletedQuestIds
        ];

        if (allPending.length === 0) return;

        setUserProgress(prev => {
            const nextCompleted = [...prev.completedQuestIds];
            let nextTaken = [...prev.takenQuestIds];

            allPending.forEach(id => {
                if (!nextCompleted.includes(id)) nextCompleted.push(id);
                nextTaken = nextTaken.filter(qId => qId !== id);
            });

            return {
                ...prev,
                completedQuestIds: nextCompleted,
                takenQuestIds: nextTaken
            };
        });

        setTradersTabSessionCompleted([]);
        setActiveTabCompletedQuestIds([]);
        setMapRaidCompletedQuestIds([]);
    };

    const calculateTraderLoyalty = (traderName) => {
        const completedQuests = questsData.filter(q =>
            q.trader === traderName && userProgress.completedQuestIds.includes(q.id)
        );

        const totalRep = completedQuests.reduce((sum, q) => sum + (q.rewards?.rep || 0), 0);
        const formattedRep = totalRep.toFixed(2);

        const thresholds = loyaltyThresholds[traderName] || { LL1: 0, LL2: 0.15, LL3: 0.30, LL4: 0.55 };
        let currentLL = 'I';

        if (totalRep >= thresholds.LL4) currentLL = 'IV';
        else if (totalRep >= thresholds.LL3) currentLL = 'III';
        else if (totalRep >= thresholds.LL2) currentLL = 'II';

        return { level: currentLL, rep: formattedRep };
    };

    return (
        <ProgressContext.Provider value={{
            questsData,
            userProgress,
            setUserProgress,
            tradersTabSessionCompleted,
            setTradersTabSessionCompleted,
            activeTabCompletedQuestIds,
            setActiveTabCompletedQuestIds,
            mapRaidCompletedQuestIds,
            setMapRaidCompletedQuestIds,
            flushAllPendingCompletions,
            calculateTraderLoyalty
        }}>
            {children}
        </ProgressContext.Provider>
    );
};

export const useProgress = () => useContext(ProgressContext);
