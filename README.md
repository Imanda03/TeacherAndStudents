# ThisWay LMS Frontend

React 18 + Vite + Tailwind LMS frontend with separate Teacher and Student portals, documentation buttons (JSON/Diagram) on every page, and mock data wiring.

## Stack

- React 18, TypeScript, Vite
- Tailwind CSS (custom palette/typography), Framer Motion
- React Router v6/7 compatible Routes
- React Hook Form + Yup (installed, not yet wired to all forms)
- React Hot Toast, Lucide icons, Recharts, React Flow, Prism React Renderer

## Quick start

```bash
npm install
npm run dev
```

> Note: Vite 7.3 requires Node 22.12+ (or 20.19+). Current engine warnings will disappear once Node is updated.

## Scripts

- npm run dev – start Vite dev server
- npm run build – type-check then build
- npm run preview – preview the production build
- npm run lint – eslint

## Layout & routing

- Teacher routes under /teacher/\* (Dashboard, Lessons, Assignments, Students, Posts, AI Assistant, Profile).
- Student routes under /student/\* (Dashboard, Lessons, Assignments, Posts, Friends, Profile).
- Shared layouts and components live in src/components/common and src/layouts.

## Documentation buttons

Each page uses FeatureHeader to surface **Show JSON** and **Show Diagram** buttons. JSON uses JsonViewer (schema, example, API request/response, search, copy/export, line numbers, theme toggle). Diagrams use DiagramViewer (React Flow with zoom/fit/export and walkthrough highlighting).

## Mock data

Initial mock structures and schemas live in src/utils/mockData.ts, src/utils/jsonSchemas.ts, and diagram definitions in src/utils/diagramData.ts.

## Next steps

- Wire real forms with React Hook Form + Yup validation.
- Flesh out lesson tab builder and assignment wizard interactions.
- Add real-time chat/feed integrations and persistence APIs.
- Harden accessibility and responsive polish across all screens.# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
