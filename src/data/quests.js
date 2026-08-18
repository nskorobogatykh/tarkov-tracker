export const initialQuestsData = [
    {
        "id": "p1",
        "trader": "Прапор",
        "minLoyalty": 1,
        "title": "Дебют",
        "location": [
            "Таможня"
        ],
        "description": "Убить 5 Диких на Таможне. Найти и сдать 2 дробовика MP-133.",
        "rewards": {
            "rep": 0.02,
            "xp": 2800,
            "money": 12000
        },
        "subtasks": [
            {
                "id": "st_p1_1",
                "text": "Ликвидировать Диких на Таможне (0/5)",
                "type": "kill"
            },
            {
                "id": "st_p1_2",
                "text": "Найти или снять с трупов MP-133 (0/2)",
                "type": "find"
            },
            {
                "id": "st_p1_3",
                "text": "Сдать дробовики MP-133 Прапору",
                "type": "handout"
            }
        ]
    },
    {
        "id": "p2",
        "trader": "Прапор",
        "minLoyalty": 1,
        "title": "Проверка на вшивость",
        "location": [
            "Таможня"
        ],
        "description": "Найти бронзовые карманные часы в кабине бензовоза.",
        "rewards": {
            "rep": 0.03,
            "xp": 1800,
            "money": 14500
        },
        "subtasks": [
            {
                "id": "st_p2_1",
                "text": "Найти ключ от спецтехники",
                "type": "find"
            },
            {
                "id": "st_p2_2",
                "text": "Забрать бронзовые карманные часы из грузовика",
                "type": "find",
                "coords": [
                    557.1,
                    518.6
                ]
            },
            {
                "id": "st_p2_3",
                "text": "Передать часы Прапору",
                "type": "handout"
            }
        ]
    },
    {
        "id": "p3",
        "trader": "Прапор",
        "minLoyalty": 2,
        "title": "Дело житейское",
        "location": [
            "Таможня"
        ],
        "description": "Найти защищенный кейс 0013 в Резервуарах на Таможне.",
        "rewards": {
            "rep": 0.04,
            "xp": 4200,
            "money": 22000
        },
        "subtasks": [
            {
                "id": "st_p3_1",
                "text": "Найти защищенный кейс в районе блокпоста",
                "type": "find"
            },
            {
                "id": "st_p3_2",
                "text": "Передать кейс Прапору",
                "type": "handout"
            }
        ]
    },
    {
        "id": "p4",
        "trader": "Прапор",
        "minLoyalty": 2,
        "title": "Магаз-витрина",
        "location": [
            "Любая"
        ],
        "description": "Найти в рейде 3 магазина на 60 патронов для АК-74.",
        "rewards": {
            "rep": 0.05,
            "xp": 5900,
            "money": 35000
        },
        "subtasks": [
            {
                "id": "st_p4_1",
                "text": "Найти 60-зарядные магазины 5.45x39 (0/3)",
                "type": "find"
            },
            {
                "id": "st_p4_2",
                "text": "Сдать магазины Прапору",
                "type": "handout"
            }
        ]
    },
    {
        "id": "p5",
        "trader": "Прапор",
        "minLoyalty": 3,
        "title": "Каратель. Часть 1",
        "location": [
            "Берег"
        ],
        "description": "Убить 15 ЧВК на Берегу, используя оружие серии АКМ.",
        "rewards": {
            "rep": 0.08,
            "xp": 10800,
            "money": 45000
        },
        "subtasks": [
            {
                "id": "st_p5_1",
                "text": "Убить ЧВК на Берегу с АКМ (0/15)",
                "type": "kill"
            }
        ]
    },
    {
        "id": "p6",
        "trader": "Прапор",
        "minLoyalty": 4,
        "title": "Каратель. Часть 6",
        "location": [
            "Любая"
        ],
        "description": "Убить 15 ЧВК в определенный промежуток времени или с СВД.",
        "rewards": {
            "rep": 0.12,
            "xp": 18200,
            "money": 120000
        },
        "subtasks": [
            {
                "id": "st_p6_1",
                "text": "Убить ЧВК с винтовки СВД (0/15)",
                "type": "kill"
            }
        ]
    },
    {
        "id": "t1",
        "trader": "Терапевт",
        "minLoyalty": 1,
        "title": "Первая помощь",
        "location": [
            "Любая"
        ],
        "description": "Найти и сдать 3 аптечки Салева.",
        "rewards": {
            "rep": 0.03,
            "xp": 2100,
            "money": 15000
        },
        "subtasks": [
            {
                "id": "st_t1_1",
                "text": "Найти аптечки Salewa в рейде (0/3)",
                "type": "find"
            },
            {
                "id": "st_t1_2",
                "text": "Сдать аптечки Терапевту",
                "type": "handout"
            }
        ]
    },
    {
        "id": "t2",
        "trader": "Терапевт",
        "minLoyalty": 1,
        "title": "Посылочка",
        "location": [
            "Таможня"
        ],
        "description": "Найти портативный GPS-трекер в кузове машины.",
        "rewards": {
            "rep": 0.04,
            "xp": 3200,
            "money": 18000
        },
        "subtasks": [
            {
                "id": "st_t2_1",
                "text": "Найти потерянную посылку в районе таможенного терминала",
                "type": "find"
            },
            {
                "id": "st_t2_2",
                "text": "Сдать посылку Терапевту",
                "type": "handout"
            }
        ]
    },
    {
        "id": "t3",
        "trader": "Терапевт",
        "minLoyalty": 2,
        "title": "Операция «Водолей»",
        "location": [
            "Таможня"
        ],
        "description": "Найти запасы воды в двухэтажной общаге.",
        "rewards": {
            "rep": 0.05,
            "xp": 4800,
            "money": 22000
        },
        "subtasks": [
            {
                "id": "st_t3_1",
                "text": "Найти комнату с водой в общаге №206",
                "type": "find"
            },
            {
                "id": "st_t3_2",
                "text": "Выжить и выйти с локации",
                "type": "survive"
            }
        ]
    },
    {
        "id": "t4",
        "trader": "Терапевт",
        "minLoyalty": 3,
        "title": "Фармацевт",
        "location": [
            "Таможня"
        ],
        "description": "Найти углеродную ленту в запертой комнате автосервиса.",
        "rewards": {
            "rep": 0.06,
            "xp": 8700,
            "money": 41000
        },
        "subtasks": [
            {
                "id": "st_t4_1",
                "text": "Найти дело фармацевта в машине",
                "type": "find"
            },
            {
                "id": "st_t4_2",
                "text": "Передать документы Терапевту",
                "type": "handout"
            }
        ]
    },
    {
        "id": "t5",
        "trader": "Терапевт",
        "minLoyalty": 4,
        "title": "Частная клиника",
        "location": [
            "Любая"
        ],
        "description": "Принести Офтальмоскоп и Светодиод (LEDX).",
        "rewards": {
            "rep": 0.1,
            "xp": 19600,
            "money": 250000
        },
        "subtasks": [
            {
                "id": "st_t5_1",
                "text": "Найти в рейде LEDX (0/1)",
                "type": "find"
            },
            {
                "id": "st_t5_2",
                "text": "Найти в рейде Офтальмоскоп (0/1)",
                "type": "find"
            },
            {
                "id": "st_t5_3",
                "text": "Сдать медицинские приборы",
                "type": "handout"
            }
        ]
    },
    {
        "id": "s1",
        "trader": "Лыжник",
        "minLoyalty": 1,
        "title": "Поставщик",
        "location": [
            "Таможня"
        ],
        "description": "Найти бронежилет 3М и ружье ТОЗ.",
        "rewards": {
            "rep": 0.04,
            "xp": 3100,
            "money": 17000
        },
        "subtasks": [
            {
                "id": "st_s1_1",
                "text": "Найти бронежилеты БЖ-3М в рейде (0/2)",
                "type": "find"
            },
            {
                "id": "st_s1_2",
                "text": "Найти охотничьи ружья ТОЗ-106 (0/2)",
                "type": "find"
            },
            {
                "id": "st_s1_3",
                "text": "Сдать всё Лыжнику",
                "type": "handout"
            }
        ]
    },
    {
        "id": "s2",
        "trader": "Лыжник",
        "minLoyalty": 2,
        "title": "Вымогатель",
        "location": [
            "Таможня"
        ],
        "description": "Найти потерянный кейс в бытовке у КПП.",
        "rewards": {
            "rep": 0.05,
            "xp": 4900,
            "money": 24000
        },
        "subtasks": [
            {
                "id": "st_s2_1",
                "text": "Найти ключ от бытовки",
                "type": "find"
            },
            {
                "id": "st_s2_2",
                "text": "Забрать ценный кейс из бытовки",
                "type": "find"
            },
            {
                "id": "st_s2_3",
                "text": "Передать кейс Лыжнику",
                "type": "handout"
            }
        ]
    },
    {
        "id": "s3",
        "trader": "Лыжник",
        "minLoyalty": 3,
        "title": "Быстрое правосудие",
        "location": [
            "Завод"
        ],
        "description": "Убить 5 ЧВК на Заводе на близкой дистанции.",
        "rewards": {
            "rep": 0.06,
            "xp": 7800,
            "money": 39000
        },
        "subtasks": [
            {
                "id": "st_s3_1",
                "text": "Ликвидировать ЧВК на Заводе (0/5)",
                "type": "kill"
            }
        ]
    },
    {
        "id": "s4",
        "trader": "Лыжник",
        "minLoyalty": 4,
        "title": "Бывалый",
        "location": [
            "Любая"
        ],
        "description": "Убить 10 Диких снайперов на крышах.",
        "rewards": {
            "rep": 0.09,
            "xp": 14500,
            "money": 80000
        },
        "subtasks": [
            {
                "id": "st_s4_1",
                "text": "Ликвидировать Диких-снайперов (0/10)",
                "type": "kill"
            }
        ]
    }
];
