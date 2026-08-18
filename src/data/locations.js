export const locationStaticData = {
    'Завод': {
        imageUrl: '/maps/factory.jpg',
        width: 1920, height: 1080,
        extracts: [
            { id: 'ext_f1', name: 'Ворота 3', coords: [200, 300] },
            { id: 'ext_f2', name: 'Ворота 0 (Ключ)', coords: [850, 200] },
            { id: 'ext_f3', name: 'Подвал (Ключ)', coords: [500, 1000] }
        ],
        spawns: {
            pmc: [[300, 400], [800, 600]],
            scav: [[500, 900]],
            boss: [[550, 800]]
        }
    },
    'Таможня': { imageUrl: '/maps/customs.jpg', width: 2400, height: 1350, extracts: [] },
    'Лес': { imageUrl: '/maps/woods.jpg', width: 2000, height: 2000, extracts: [] },
    'Берег': { imageUrl: '/maps/shoreline.jpg', width: 2000, height: 2000, extracts: [] },
    'Развязка': { imageUrl: '/maps/interchange.jpg', width: 1500, height: 1500, extracts: [] },
    'Маяк': { imageUrl: '/maps/lighthouse.jpg', width: 1800, height: 1800, extracts: [] },
    'Улицы Таркова': { imageUrl: '/maps/streets.jpg', width: 2500, height: 2500, extracts: [] }
};

export const allLocations = Object.keys(locationStaticData);
