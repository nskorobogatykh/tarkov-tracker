export const locationMap = {
    '-1': 'Любая',
    0: 'Завод',
    1: 'Таможня',
    2: 'Лес',
    3: 'Берег',
    4: 'Развязка',
    5: 'Лаборатория',
    6: 'Маяк',
    7: 'Улицы Таркова'
};

export const allLocations = ['Завод', 'Таможня', 'Берег', 'Лес', 'Развязка', 'Маяк', 'Улицы Таркова'];

export const locationStaticData = {
    'Завод': {
        imageUrl: 'https://placehold.co',
        width: 1920,
        height: 1080,
        extracts: [
            { id: 'ext_f1', name: 'Ворота 3', coords: [200, 300] },
            { id: 'ext_f2', name: 'Ворота 0 (Ключ)', coords: [850, 200] },
            { id: 'ext_f3', name: 'Подвал (Ключ)', coords: [500, 1600] }
        ],
        spawns: {
            pmc: [[300, 400], [800, 600]],
            scav: [[500, 900]],
            boss: [[550, 800]]
        }
    }
};

export const getLocationClass = (locName) => {
    const map = {
        'Завод': 'loc-factory',
        'Таможня': 'loc-customs',
        'Берег': 'loc-shoreline',
        'Лес': 'loc-woods',
        'Развязка': 'loc-inter',
        'Маяк': 'loc-lighthouse',
        'Улицы Таркова': 'loc-streets',
        'Любая': 'loc-any'
    };
    return map[locName] || 'loc-any';
};
