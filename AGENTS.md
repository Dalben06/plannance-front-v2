# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint with auto-fix
npm run test      # Run all Vitest tests
npm run test:coverage  # Tests with V8 coverage (90% threshold on branches/functions/lines/statements)
npx vitest run tests/unit/path/to/file.spec.ts  # Run a single test file
```

## Code Style

- **Language**: TypeScript (strict mode) — all source files under `src/` are `.ts` / `.vue`
- **Formatting**: Prettier — 4-space indent, single quotes, no trailing commas, 250-char line width (see `.prettierrc.json`)
- **Linting**: ESLint with `vue3-essential` + Prettier integration (see `.eslintrc.cjs`)
- **Component order**: `<script setup>` → `<template>` → `<style>` (enforced by `vue/component-tags-order` ESLint rule)
- **Path alias**: `@/` → `src/`

## Architecture

Vue 3 SPA admin dashboard built on the **Sakai** template with **PrimeVue 4**, **Tailwind CSS 4**, and **Pinia**.

### Key layers

| Directory             | Role |
| --------------------- | ---- |
| `src/layout/`         | Shell components: `AppLayout.vue` wraps sidebar, topbar, footer. Layout state (sidebar visibility, dark mode, menu mode) lives in `layout/composables/layout.ts` via the `useLayout()` composable. |
| `src/stores/`         | Pinia stores: `auth.ts` (user session, localStorage persistence) and `calendar.ts` (events, month navigation). |
| `src/api/`            | Axios-based HTTP layer. `http.ts` sets up the instance with Bearer token injection and 401 handling. `auth.ts`, `calendar.ts`, `user.ts` export typed endpoint functions. |
| `src/composable/`     | Feature composables (e.g. `calendar/`) for component-level state that doesn't belong in Pinia. |
| `src/views/`          | Page-level components, lazy-loaded via Vue Router. Subdirs: `pages/` (auth, landing), `uikit/` (PrimeVue component docs — only visible when `VITE_ENABLE_DEBUG=true`). |
| `src/components/`     | Reusable widgets — `calendar/` for calendar UI, `dashboard/` for stats/charts, `landing/` for public landing page sections. |
| `src/router/`         | `index.ts` defines all routes with lazy imports and an auth guard. `calendarRouter.ts` and `uiKitRouter.ts` are sub-route modules. |
| `src/types/`          | TypeScript types. `api.p.ts` contains API response types (`ResponseAPI<T>`, `CalendarEvent`, `CalendarDay`, etc.). |
| `src/utils/`          | Pure utility functions. `calendar-utils.ts` has date helpers (`addDays`, `parseDate`, `buildMonthGrid`). |
| `src/config/env.ts`   | Validates and exports all `VITE_*` env vars. Throws at startup if required vars are missing. |
| `src/service/`        | Legacy mock data services (demo-only, not used in new code). |
| `src/assets/`         | Global styles: `tailwind.css`, `styles.scss`, and per-section SCSS partials under `assets/layout/`. |

### Authentication flow

1. Login (`/auth/login`) supports Google Sign-In and email/password via `src/api/auth.ts`
2. `useAuthStore` stores `accessToken` + `user` in state and persists to localStorage
3. `hydrateSession()` re-fetches the current user on app load (`/api/v1/auth/me`)
4. Router `beforeEach` guard redirects unauthenticated users to `/auth/login` on protected routes
5. `src/api/http.ts` auto-attaches `Authorization: Bearer <token>` on every request and clears auth on 401

### Theming

- Theme preset configured via `VITE_THEME_PRESET` (Aura / Lara / Nora; default: Lara)
- Dark mode toggled via `.app-dark` CSS class on `<html>` (not a separate stylesheet); uses View Transition API when available
- Primary color via `VITE_THEME_PRIMARY` (default: green); set `VITE_LOCK_THEME=true` to hide the runtime configurator
- `FloatingConfigurator.vue` / `AppConfigurator.vue` allow runtime theme switching

### State management

- **Pinia** (`src/stores/`) for app-level state (auth, calendar)
- **`useLayout()`** composable (`src/layout/composables/layout.ts`) for UI shell state (sidebar, dark mode, menu mode)

### Auto-imports

`unplugin-vue-components` is configured in `vite.config.mjs` with PrimeVue's resolver — PrimeVue components do **not** need to be manually imported in `.vue` files.

### Testing

- **Vitest** with `jsdom` environment, globals enabled, setup in `tests/test-setup.ts` (polyfills `matchMedia` and `ResizeObserver`)
- Path alias `@tests/` → `tests/` available in test files
- Test helpers in `tests/test-utils.ts`: `createTestPinia()` and `mountWithPinia()` (uses `shallowMount` with Pinia plugin)
- Tests live under `tests/unit/` mirroring `src/` structure, using `.spec.ts` suffix
- `VITE_API_BASE_URL` is set to `http://localhost:3000` in the test environment

### Form validation

`vee-validate` with `yup` schemas is available for form validation.

### Environment variables

Required:
- `VITE_API_BASE_URL` — backend API base URL

Optional:
- `VITE_APP_NAME`, `VITE_ENABLE_DEBUG`, `VITE_GOOGLE_CLIENT_ID`, `VITE_GOOGLE_API_KEY`
- `VITE_THEME_PRESET`, `VITE_THEME_PRIMARY`, `VITE_THEME_SURFACE`, `VITE_MENU_MODE`, `VITE_LOCK_THEME`
