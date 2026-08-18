import React from 'react';
import { useProgress } from '../context/ProgressContext';
import { getLocationClass } from '../data/locations';

export const QuestDetailPage = ({ questId, onBack }) => {
    const { questsData, userProgress } = useProgress();

    // Ищем нужный квест в нашей базе данных
    const quest = questsData.find(q => q.id === questId);

    // Если квест не найден (например, при некорректном id)
    if (!quest) {
        return (
            <div className="container">
                <div style={{ color: '#ff4444', padding: '20px' }}>Квест не найден в базе данных.</div>
                <button className="btn-back" onClick={onBack}>&larr; Назад</button>
            </div>
        );
    }

    // Приводим локацию к массиву, если она записана строкой
    const locList = Array.isArray(quest.location) ? quest.location : [quest.location];
    const isTaken = userProgress.takenQuestIds.includes(quest.id);
    const isCompleted = userProgress.completedQuestIds.includes(quest.id);

    return (
        <div className="container" style={{ paddingTop: '20px' }}>
            {/* Кнопка возврата на предыдущий экран с сохранением истории переходов */}
            <div style={{ marginBottom: '25px' }}>
                <button className="btn-back" onClick={onBack}>
                    &larr; Назад к списку
                </button>
            </div>

            {/* Шапка квеста с флагами состояния */}
            <div style={{ borderBottom: '1px solid #333', paddingBottom: '16px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
                    <h1 style={{ color: '#d1b880', margin: 0, fontSize: '1.8rem', fontWeight: 'normal' }}>
                        {quest.title}
                    </h1>
                    {/* Плашки статуса квеста */}
                    {isCompleted && <span className="loc-badge status-completed" style={{ color: '#fff' }}>Выполнен</span>}
                    {!isCompleted && isTaken && <span className="badge-ll" style={{ background: '#1a3a1a', borderColor: '#3a7a3a' }}>В работе</span>}
                </div>

                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '12px' }}>
                    <span className="trader-badge-tag">{quest.trader}</span>
                    <span className="badge-ll">LL {quest.minLoyalty || 1}</span>
                    {locList.map(loc => (
                        <span key={loc} className={`loc-badge ${getLocationClass(loc)}`}>
                            {loc}
                        </span>
                    ))}
                </div>
            </div>

            {/* Художественное или техническое описание цели */}
            <div style={{ marginBottom: '24px' }}>
                <h4 style={{ color: '#d1b880', marginBottom: '8px', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Описание задачи:
                </h4>
                <p style={{ color: '#bbb', lineHeight: '1.6', fontSize: '0.95rem', background: '#111', padding: '15px', borderRadius: '4px', border: '1px solid #222' }}>
                    {quest.description || 'Официальные указания от торговца еще не занесены в реестр.'}
                </p>
            </div>

            {/* Список всех подзадач / целей */}
            {quest.subtasks && quest.subtasks.length > 0 && (
                <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ color: '#d1b880', marginBottom: '10px', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Цели в рейде:
                    </h4>
                    <div className="subtask-list" style={{ background: 'transparent', padding: 0 }}>
                        {quest.subtasks.map(st => {
                            const isDone = userProgress.completedSubtasks.includes(st.id);
                            return (
                                <div
                                    key={st.id}
                                    className={`subtask-item ${isDone ? 'completed' : ''}`}
                                    style={{ padding: '10px 0', borderBottom: '1px solid #222' }}
                                >
                                    <span style={{ marginRight: '10px', color: isDone ? '#555' : '#d1b880' }}>
                                        {isDone ? '✓' : '•'}
                                    </span>
                                    <span style={{ color: isDone ? '#666' : '#ccc' }}>
                                        {st.text} {st.type === 'counter' && `(Цель: ${st.target} шт.)`}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Блок обещанных наград */}
            {quest.rewards && (
                <div style={{ marginTop: '30px' }}>
                    <h4 style={{ color: '#d1b880', marginBottom: '12px', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Награда за выполнение:
                    </h4>
                    <div className="quest-rewards-block" style={{ marginLeft: 0, display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {quest.rewards.rep && (
                            <span className="rw-rep" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>
                                +{quest.rewards.rep} репутации {quest.trader}
                            </span>
                        )}
                        {quest.rewards.xp && (
                            <span className="rw-xp" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>
                                +{quest.rewards.xp} Опыта
                            </span>
                        )}
                        {quest.rewards.money > 0 && (
                            <span className="rw-money" style={{ padding: '6px 12px', fontSize: '0.9rem', background: '#2a2415', border: '1px solid #d1b880', color: '#d1b880' }}>
                                {quest.rewards.money.toLocaleString()} ₽
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
