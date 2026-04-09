# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint with auto-fix
npm run format    # Prettier format all files
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

| Directory           | Role                                                                                                                                                                                                                                                                                          |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/layout/`       | Shell components: `AppLayout.vue` wraps sidebar, topbar, footer. Layout state (sidebar visibility, dark mode, menu mode) lives in `layout/composables/layout.ts` via the `useLayout()` composable.                                                                                            |
| `src/stores/`       | Pinia stores: `auth.ts` (user session, localStorage persistence), `calendar.ts` (events, month navigation), `import.ts` (CSV imports), `template.ts` (CSV mapping templates).                                                                                                                 |
| `src/api/`          | Axios-based HTTP layer. `http.ts` sets up the instance with Bearer token injection and 401 handling. `auth.ts`, `calendar.ts`, `user.ts`, `csv.ts` export typed endpoint functions.                                                                                                           |
| `src/composable/`   | Feature composables under `calendar/` for component-level state that doesn't belong in Pinia.                                                                                                                                                                                                 |
| `src/views/`        | Page-level components, lazy-loaded via Vue Router. Subdirs: `pages/` (auth, landing), `uikit/` (PrimeVue component docs — only visible when `VITE_ENABLE_DEBUG=true`). Top-level views: `Dashboard.vue`, `CalendarDashboard.vue`, `ImportView.vue`, `ImportRegister.vue`, `TemplateView.vue`. |
| `src/components/`   | Reusable widgets — `calendar/` for calendar UI, `dashboard/` for stats/charts, `landing/` for public landing page sections, `import/` for the CSV import flow, `template/` for template management.                                                                                           |
| `src/router/`       | `index.ts` defines all routes with lazy imports and an auth guard. Sub-route modules: `calendarRouter.ts`, `importRouter.ts`, `templateRouter.ts`, `uiKitRouter.ts`.                                                                                                                          |
| `src/types/`        | TypeScript types. `api.p.ts` contains all API response types (`ResponseAPI<T>`, `CalendarEvent`, `CalendarDay`, `CsvImport`, `ImportRecord`, `TemplateResponse`, `TemplateSavePayload`, etc.).                                                                                                |
| `src/utils/`        | Pure utility functions. `calendar-utils.ts` has date helpers (`addDays`, `parseDate`, `buildMonthGrid`).                                                                                                                                                                                      |
| `src/config/env.ts` | Validates and exports all `VITE_*` env vars. Throws at startup if required vars are missing. Exports `env` (app config) and `features` (feature flags like `googleAuth`).                                                                                                                     |
| `src/service/`      | Legacy mock data services (demo-only, not used in new code).                                                                                                                                                                                                                                  |
| `src/assets/`       | Global styles: `tailwind.css`, `styles.scss`, and per-section SCSS partials under `assets/layout/`.                                                                                                                                                                                           |

### Authentication flow

1. Login (`/auth/login`) supports Google Sign-In and email/password via `src/api/auth.ts`; sign-up at `/auth/signup` via `src/api/user.ts`
2. `useAuthStore` stores `accessToken` + `user` in state and persists to localStorage (`access_token` / `auth_user` keys)
3. `hydrateSession()` re-fetches the current user on app load (`/api/v1/auth/me`) — only when a token exists but no in-memory user
4. Router `beforeEach` guard calls `hydrateSession()` then redirects unauthenticated users to `/auth/login` on protected routes
5. `src/api/http.ts` auto-attaches `Authorization: Bearer <token>` (read from `localStorage.access_token`) on every request and clears auth + redirects to `/auth/login` on 401

### CSV Import flow

The import feature allows users to upload CSV files and map their columns to internal fields using reusable templates.

- **Templates** (`/home/template`, `/home/template/:id`) — create or edit a named column-mapping template via `TemplateView.vue` / `TemplateForm.vue`. Backed by `useTemplateStore` and `src/api/csv.ts` (`getTemplates`, `saveTemplate`, `updateTemplate`).
- **Import** (`/home/import`) — lists pending (non-expired) imports via `ImportView.vue` / `ImportPendingTable.vue`. Backed by `useImportStore`.
- **Import wizard** (`/home/import/register`) — three-step flow managed by `ImportRegister.vue` (PrimeVue `Steps`):
    1. `ImportFile.vue` — upload a CSV with a chosen template
    2. `UpdateRecord.vue` (`/:id/review`) — review and correct parsed records
    3. `ConfirmImportRecords.vue` (`/:id/confirm`) — final confirmation

### Theming

- Theme preset configured via `VITE_THEME_PRESET` (Aura / Lara / Nora; default: Lara)
- Dark mode toggled via `.app-dark` CSS class on `<html>` (not a separate stylesheet); uses View Transition API when available
- Primary color via `VITE_THEME_PRIMARY` (default: green); set `VITE_LOCK_THEME=true` to hide the runtime configurator
- `FloatingConfigurator.vue` / `AppConfigurator.vue` allow runtime theme switching

### State management

- **Pinia** (`src/stores/`) for app-level state (auth, calendar, import, template)
- **`useLayout()`** composable (`src/layout/composables/layout.ts`) for UI shell state (sidebar, dark mode, menu mode)

### Auto-imports

`unplugin-vue-components` is configured in `vite.config.mjs` with PrimeVue's resolver — PrimeVue components do **not** need to be manually imported in `.vue` files.

### Testing

- **Vitest** with `jsdom` environment, globals enabled, setup in `tests/test-setup.ts` (polyfills `matchMedia` and `ResizeObserver`)
- Path alias `@tests/` → `tests/` available in test files
- Test helpers in `tests/test-utils.ts`: `createTestPinia()` and `mountWithPinia()` (uses `shallowMount` with Pinia plugin)
- Tests live under `tests/unit/` mirroring `src/` structure (subdirs: `api/`, `components/`, `composable/`, `layout/`, `stores/`, `utils/`, `views/`), using `.spec.ts` suffix
- `VITE_API_BASE_URL` is set to `http://localhost:3000` in the test environment

### Form validation

`@vee-validate/yup` (yup schema adapter for vee-validate) is available for form validation.

### Environment variables

Required:

- `VITE_API_BASE_URL` — backend API base URL

Optional:

- `VITE_APP_NAME` (default: `Plannance`), `VITE_ENABLE_DEBUG` (shows uikit routes when `true`), `VITE_GOOGLE_CLIENT_ID` (enables Google Sign-In)
- `VITE_THEME_PRESET`, `VITE_THEME_PRIMARY`, `VITE_THEME_SURFACE`, `VITE_MENU_MODE`, `VITE_LOCK_THEME`
