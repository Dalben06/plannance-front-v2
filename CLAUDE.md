# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint with auto-fix
```

No test framework is configured.

## Code Style

- **Formatting**: Prettier — 4-space indent, single quotes, no trailing commas, 250-char line width (see `.prettierrc.json`)
- **Linting**: ESLint with `vue3-essential` + Prettier integration (see `.eslintrc.cjs`)
- Path alias: `@/` → `src/`

## Architecture

This is a Vue 3 SPA admin dashboard built on the **Sakai** template with **PrimeVue 4** and **Tailwind CSS 4**.

### Key layers

| Directory             | Role                                                                                                                                                                                                        |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/layout/`         | Shell components: `AppLayout.vue` wraps sidebar, topbar, footer. Layout state (sidebar visibility, dark mode, etc.) lives in `layout/composables/layout.js` — a composable shared across layout components. |
| `src/views/`          | Page-level components, lazy-loaded via Vue Router. Subdirs: `pages/` (auth, CRUD, landing), `uikit/` (PrimeVue component docs), `utilities/`.                                                               |
| `src/components/`     | Reusable widgets — `dashboard/` for stats/charts/sales widgets, `landing/` for the public landing page sections.                                                                                            |
| `src/router/index.js` | All route definitions with lazy imports. Routes under `/` use `AppLayout`, auth pages are standalone.                                                                                                       |
| `src/service/`        | Mock data services (`ProductService`, `CustomerService`, etc.) — currently demo-only, not connected to a real API.                                                                                          |
| `src/assets/`         | Global styles: `tailwind.css`, `styles.scss`, and per-section SCSS partials under `assets/layout/`.                                                                                                         |

### Theming

- PrimeVue uses the **Aura** theme preset (`@primeuix/themes/aura`) configured in `main.js`
- Dark mode toggled via `.app-dark` CSS class on `<html>` (not a separate stylesheet)
- The `FloatingConfigurator.vue` / `AppConfigurator.vue` let users switch themes and dark mode at runtime

### State management

No Pinia or Vuex. Global UI state (menu active item, sidebar state, layout config) is managed through the `useLayout()` composable in `src/layout/composables/layout.js`.

### Auto-imports

`unplugin-vue-components` is configured in `vite.config.mjs` with PrimeVue's resolver — PrimeVue components do **not** need to be manually imported in `.vue` files.
