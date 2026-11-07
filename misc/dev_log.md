# MohallyWala development log

## Project overview

MohallyWala is an offline, front-end-only prototype for a civics and community-engagement presentation. It lets residents view and support local issues, submit a demo report, follow status updates, participate in community activity, and view a simulated authority workflow. The project deliberately uses hard-coded demo data and `localStorage`; it has no backend, authentication, live map, or external dependency.

The functional brief, seed data, feature boundaries, and demo script are recorded in [prototype_plan.md](prototype_plan.md). All people, groups, events, and issues in the prototype are fictional unless explicitly marked otherwise.

## History

| Date | Milestone | Notes |
| --- | --- | --- |
| 2026-11-07 | Initial homework | The initial project context and presentation research were established. |
| 2026-11-07 | Initial Build | Built the first working offline single-page prototype: vanilla HTML, CSS, and JavaScript; hash routing; hard-coded demo data; and `localStorage` state. The original interface used a mobile phone-frame layout. |
| 2026-11-07 | Desktop-friendly conversion | Reworked the initial build into the current desktop-oriented dashboard UI, while retaining the original prototype features and seed data. |
| 2026-11-07 | Asset consolidation | Merged the three CSS files (`tokens.css`, `base.css`, `components.css`) into `style.css` and the six JS modules (`data.js`, `state.js`, `i18n.js`, `ui.js`, `screens.js`, `router.js`) into `app.js`. The `css/` and `js/` directories were removed. `index.html` updated to reference only `style.css` and `app.js`. |
| 2026-11-07 | Encoding fix | PowerShell's `Get-Content` read the UTF-8 source files using the system's Windows-1252 default code page, corrupting all multi-byte characters (emoji, Urdu text, special symbols) in `app.js`. Fixed by rewriting `app.js` directly with correct UTF-8 content. `node --check` and manual character inspection confirm all characters are now intact. |

## Initial Build baseline

The Initial Build established the following implementation decisions:

- Plain HTML, CSS, and vanilla JavaScript only — no framework, package manager, build step, backend, or network dependency.
- `index.html` is the offline entry point. The app uses hash routes and renders the active screen into sections in the single-page shell.
- `js/data.js` contains the original fictional issue, authority, group, event, poll, accountability-board, and language seed data.
- `js/state.js` persists demo interaction state under the `mw_state_v1` local-storage key. Reset demo restores the seeded state.
- The resident workflows include issue filtering, issue details, support toggling, report submission, duplicate prompting, status confirmation, notifications, map pins, group joining, event RSVP, and poll voting.
- The authority workflow provides a sortable issue table and simulated status/note updates.
- Dummy or unavailable functions deliberately show a prototype toast rather than attempt real authentication, uploads, GPS, notifications, or API calls.

### Initial Build file map

| Path | Responsibility |
| --- | --- |
| `index.html` | Application shell, route sections, toast and modal containers, script loading |
| `css/tokens.css` | Theme colour, radius, shadow, and spacing tokens *(merged → `style.css`)* |
| `css/base.css` | Global reset, shell layout, type, and responsive/RTL rules *(merged → `style.css`)* |
| `css/components.css` | Reusable UI components and screen-layout styling *(merged → `style.css`)* |
| `js/data.js` | Seeded fictional demo content and translations *(merged → `app.js`)* |
| `js/state.js` | Demo state loading, persistence, and reset *(merged → `app.js`)* |
| `js/i18n.js` | English/Urdu labels and document direction switching *(merged → `app.js`)* |
| `js/ui.js` | Shared UI helpers, toasts, modal handling, and issue-card helpers *(merged → `app.js`)* |
| `js/screens.js` | Route-level rendering and feature interactions *(merged → `app.js`)* |
| `js/router.js` | Hash-route resolution and active-screen rendering *(merged → `app.js`)* |

### Current file map (post-consolidation)

| Path | Responsibility |
| --- | --- |
| `index.html` | Application shell, route sections, toast and modal containers, script loading |
| `style.css` | All styles: tokens, reset/layout, and component rules |
| `app.js` | All JavaScript: data, state, i18n, UI helpers, screens, and router |

## 2026-11-07 — Desktop SaaS-style conversion

Starting from the restored Initial Build Stage.

### Scope

- Convert the offline vanilla HTML/CSS/JS prototype from a phone layout to a clean desktop dashboard.
- Preserve existing feature flows and seed data, adding only registered-mohalla selection data/state.
- Maintain this log with implementation and verification notes.

### Design intent

- Replace the original mobile-only presentation with a calm, desktop SaaS-style interface suitable for a browser window from 1024 px wide upward.
- Keep the visual language restrained: one deep-green brand colour, light neutral surfaces, soft borders and shadows, compact controls, and ordinary web-app typography.
- Preserve the class-demo flow and existing data rather than turning the prototype into a production system.

### Implemented

- Replaced the phone frame and bottom tab bar with a 64 px desktop top bar, fixed 232 px sidebar, and fluid content area.
- Applied the requested restrained visual system: neutral background, soft borders/shadows, 16 px base type and compact controls.
- Added registered-mohalla data, first-run chooser, search, selector modal, per-mohalla issue filtering and placeholder empty state.
- Converted sheets to keyboard-dismissible, focus-contained centred dialogs and updated toast behaviour to three seconds.

### Current desktop structure

- **Top bar:** MohallyWala identity, active-mohalla selector, language toggle, Resident/Authority switch, notification entry point, and profile entry point.
- **Sidebar:** Report action plus Home, Map, Community, Accountability, My Activity, and About navigation.
- **Main content:** A centred `1200px` content column with route-specific desktop grids. The home screen uses a 2:1 feed/sidebar arrangement; map and issue screens use primary-content and supporting-panel layouts.
- **Responsive threshold:** Desktop is the target. At narrower desktop/tablet widths, multi-column screen layouts stack while the shell remains a desktop interface.

### Mohalla-selection behaviour

- `REGISTERED_MOHALLAS` is the sole data addition to the original seed file. Noor Colony, Block C is the first and populated option; the other two entries are intentionally named editable placeholders.
- A missing `state.mohallaId` routes a fresh/reset installation to **Choose your mohalla**.
- Seed records without a `mohallaId` are treated as Noor Colony data. New reports carry the currently selected `mohallaId`.
- Placeholder mohallas open with a friendly empty state until a report is made there.

### Verification

- Ran `node --check` successfully against every JavaScript file.
- Confirmed the phone-frame selector is absent and that the desktop shell, sidebar, mohalla data, selection route, modal Escape handling and development log are present.
- A browser-render visual check remains for the presentation machine: this environment blocks local `file://` pages in its controlled browser.

### Known limits / handoff checks

- This remains a demonstrator, not a production civic-reporting service. It has no authentication, back-office backend, data isolation, real location, or real upload pipeline.
- Before presenting, open `index.html` in the intended browser, use **Reset demo**, choose Noor Colony, and run the report → authority update → resident notification path once.
- Check the browser at 125% and 150% zoom on the projector/display that will be used. This is the remaining visual QA step after the static checks recorded above.
- Update this log whenever functionality, seed data, intended demo behaviour, or validation status changes.
