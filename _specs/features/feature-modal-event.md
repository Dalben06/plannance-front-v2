---
name: 'Modal-Event'
description: Modal event will add and update any event in system related from the user
model: sonnet
tools: Read, Glob, Grep, Bash, Write
---

## Introduction

This feature introduces a modal/dialog for creating and editing `CalendarEvent` records. The modal is accessible from the app topbar, the `CalendarSummary` stats panel, and by clicking any existing event chip in the calendar grid.

---

## Requirements

**Input (create):**
- `title` — string, required, 1–255 chars
- `start` — date, required
- `amount` — number, required, > 0
- `type` — enum `'debit' | 'credit'`, required

**Input (edit):**
- Same fields as create, pre-filled from the selected `CalendarEvent`

**Output:**
- On success: calendar data reloads via `calendarStore.getEventsFromMonth()`, success toast shown, modal closes
- On API 422: field-level validation errors mapped to form inputs
- On other API error: generic error toast shown

---

## Accepted Criteria

- [ ] "Add Event" button in topbar opens modal in create mode (empty form)
- [ ] "Add Event" button in `CalendarSummary` opens modal in create mode
- [ ] Clicking an event chip in the calendar grid opens modal in edit mode (pre-filled)
- [ ] Submitting an empty form shows field-level validation errors (no API call made)
- [ ] Successful create → success toast + calendar reloads + modal closes
- [ ] Successful update → success toast + calendar reloads + modal closes
- [ ] API 422 response → backend field errors appear below the relevant inputs
- [ ] API 5xx response → error toast shown
- [ ] Submit button is disabled and shows a spinner while the request is in flight
- [ ] Closing modal with dirty (modified) fields shows a "Discard changes?" confirmation dialog
- [ ] Confirming discard closes the modal; rejecting returns to the form

---

## Design

### Architecture

Global singleton composable (`useCalendarEventModal`) holds modal visibility and the event being edited as module-level refs. This avoids prop-drilling through the deep calendar component tree and lets any component open the modal directly.

The modal (`CalendarEventModal.vue`) is mounted once inside `AppLayout.vue` so it is available from any dashboard page.

### Component tree entry points

```
AppTopbar       → openForCreate()
CalendarSummary → openForCreate()
CalendarEventDay chip → openForEdit(event)
```

---

## Implementation

### Files created

#### `src/composable/calendar/useCalendarEventModal.ts`
Module-level reactive singleton:
- `visible: Ref<boolean>`
- `editingEvent: Ref<CalendarEvent | null>`
- `openForCreate()` — clears `editingEvent`, sets `visible = true`
- `openForEdit(event)` — sets `editingEvent`, sets `visible = true`
- `close()` — sets both back to initial state

#### `src/components/calendar/CalendarEventModal.vue`
PrimeVue `<Dialog>` wrapping a vee-validate + Yup form:

**Fields:** title (InputText), start (DatePicker), amount (InputNumber), type (Select)

**Validation schema (Yup):**
```ts
yup.object({
  title: yup.string().required().min(1).max(255),
  start: yup.date().required().typeError('Start date is required'),
  amount: yup.number().required().min(0.01),
  type: yup.string().oneOf(['debit', 'credit']).required(),
})
```

**Behaviour:**
- Modal title: `editingEvent ? 'Edit Event' : 'Add Event'`
- On `visible` change: `resetForm()` with pre-filled values (edit) or empty (create)
- Submit calls `createCalendarEvent` or `updateCalendarEvent` depending on `editingEvent`
- 422 response: maps `err.response.data.errors` to `setFieldError`
- Other errors: `useToast()` error toast
- `@hide`: if `meta.dirty`, shows PrimeVue `<ConfirmDialog>` ("Discard changes?") before calling `close()`

### Files modified

#### `src/api/calendar.ts`
Added:
```ts
createCalendarEvent(payload: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent>
// POST /api/v1/calendar-events → 201

updateCalendarEvent(id, payload: Omit<CalendarEvent, 'id'>): Promise<CalendarEvent>
// PUT /api/v1/calendar-events/:id → 200
```

#### `src/layout/AppLayout.vue`
- Imports `CalendarEventModal`
- Mounts `<CalendarEventModal />` alongside `<Toast />`

#### `src/layout/AppTopbar.vue`
- Imports `useCalendarEventModal`, destructures `openForCreate`
- Adds button in `.layout-topbar-menu-content`:
  ```html
  <button type="button" class="layout-topbar-action" title="Add Event" @click="openForCreate">
    <i class="pi pi-plus"></i>
    <span>Add Event</span>
  </button>
  ```

#### `src/components/calendar/CalendarSummary.vue`
- Imports `useCalendarEventModal`, destructures `openForCreate`
- Wraps existing `<BaseStatsWidget>` in a `<div>` and adds:
  ```html
  <Button label="Add Event" icon="pi pi-plus" @click="openForCreate" />
  ```

#### `src/components/calendar/CalendarEventDay.vue`
- Imports `useCalendarEventModal`, destructures `openForEdit`
- Event chips changed from `<div>` to `<button type="button">` with `@click="openForEdit(eventDay)"`

---

## Tests

> No test framework is configured in this project. Test scenarios are documented for future implementation.

### `CalendarEventModal.spec.ts`
- [ ] Component renders (shallowMount)
- [ ] Submitting empty form shows field-level validation errors
- [ ] API error (500) → error toast shown
- [ ] API validation error (422) → field errors shown below inputs
- [ ] Happy path: fills all fields, submits, success toast shown
- [ ] Submit button is disabled and shows spinner during request
- [ ] Closing with dirty fields shows discard confirmation

### `AppTopbar.spec.ts`
- [ ] "Add Event" button exists
- [ ] Clicking "Add Event" calls `openForCreate()`

### `CalendarSummary.spec.ts`
- [ ] "Add Event" button exists
- [ ] Clicking it calls `openForCreate()`

### `CalendarEventDay.spec.ts`
- [ ] Each event chip is a `<button>` element
- [ ] Clicking calls `openForEdit` with the correct event

---

## Rules

- The modal is mounted **once** in `AppLayout.vue` — do not mount it inside calendar sub-components
- `useCalendarEventModal` uses **module-level** refs (singleton pattern) — do not wrap refs inside the exported function
- Always call `resetForm()` when `visible` becomes `true` to prevent stale state between open/close cycles
- API 422 field names from the backend must match vee-validate field names exactly for `setFieldError` to work
- `ConfirmationService` is already registered globally in `main.ts` — do not re-register it
