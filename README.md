# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.


tarkov-tracker/
├── public/
│   └── maps/               # Сюда положите картинки карт (factory.jpg и т.д.)
├── src/
│   ├── data/               # ИЗОЛИРОВАННЫЕ БАЗЫ ДАННЫХ
│   │   ├── traders.js      # Пороги лояльности и имена торговцев
│   │   ├── locations.js    # Данные карт, выходы, координаты спавнов
│   │   ├── items.js        # База предметов для квестов (если нужна)
│   │   └── quests.js       # Наша чистая отформатированная база квестов
│   ├── pages/              # ОТДЕЛЬНЫЕ СТРАНИЦЫ
│   │   ├── TradersPage.jsx
│   │   ├── ActiveQuestsPage.jsx
│   │   ├── MapPage.jsx
│   │   └── QuestDetailPage.jsx
│   ├── components/         # Общие элементы (Шапка, Карточка квеста)
│   │   └── Header.jsx
│   ├── context/
│   │   └── ProgressContext.jsx # Глобальное состояние localStorage (синхронизация)
│   ├── App.jsx             # Корневой компонент (управляет переключением страниц)
│   ├── main.jsx
│   └── index.css           # Настройки Tailwind CSS
├── package.json
└── vite.config.js
