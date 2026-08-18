export const getLocationClass = (locationName) => {
    if (!locationName) return 'loc-any';

    const mapping = {
        'Таможня': 'loc-customs',
        'Завод': 'loc-factory',
        'Лес': 'loc-woods',
        'Берег': 'loc-shoreline',
        'Развязка': 'loc-interchange',
        'Резерв': 'loc-reserve',
        'Маяк': 'loc-lighthouse',
        'Улицы Таркова': 'loc-streets',
        'Лаборатория': 'loc-labs',
        'Эпицентр': 'loc-ground-zero',
        'Любая': 'loc-any'
    };

    return mapping[locationName.trim()] || 'loc-any';
};
