# MohallyWala: Prototype Plan (front-end only)

Build brief for a clickable, phone-style web prototype for a class presentation (Civics and Community Engagement).
Written so it can be pasted into an AI coding tool section by section ("vibe coding").

**Goal:** show what the product looks like, which features it has, and how they connect. Not a working product.
**Rule:** if a feature needs a backend, fake it with hard-coded data or mark the button as a dummy that shows a "Coming soon" toast.

---

## 1. Scope

### 1.1 Feature status

| Feature | Status | How it is shown |
|---|---|---|
| Bottom navigation, screen switching | **Live** | Hash routing in JS |
| Home feed of local issues | **Live** | Rendered from `data.js` |
| Category filter chips | **Live** | JS filter |
| Issue detail with status timeline | **Live** | Rendered from data |
| "Me too" support button | **Live** | Increments counter, saved in `localStorage` |
| Report an issue (3-step form) | **Live** | Form with photo preview; submit adds to the feed |
| Duplicate prompt ("2 neighbours reported this") | **Live** | Keyword match on a few seeded issues |
| Anonymous toggle | **Live** | Changes the name shown on the new issue |
| Resident / Authority view switch | **Live** | Switch in header; authority view is a table |
| "Simulate authority update" | **Live** | Advances status, shows toast and a notification |
| Accountability board | **Live** | Numbers calculated from data (recalculate when statuses change) |
| English / Urdu toggle | **Live (partial)** | Dictionary for main labels, `dir="rtl"` |
| WhatsApp share | **Live** | `https://wa.me/?text=` link |
| Map | **Static** | SVG map with clickable pins (no map library) |
| Groups directory, committee page | **Static + light JS** | Cards; "Join" toggles to "Requested" |
| Events with RSVP | **Live (light)** | RSVP button toggles, counter changes |
| Polls | **Live (light)** | Vote once, bars update |
| Login, real notifications, uploads, real GPS | **Dummy** | Button shows toast: "Not in the prototype" |

### 1.2 Out of scope
Backend, database, authentication, real maps, push notifications, payments, security, performance tuning.

---

## 2. Tech stack and constraints

- Plain **HTML + CSS + vanilla JavaScript (ES modules not required)**. No framework, no build step, no npm.
- Opens by double-clicking `index.html`. Works offline. No external requests except an optional font; include a system-font fallback.
- Icons: inline SVG (sprite in `index.html`). No icon CDN.
- State: one `state` object persisted to `localStorage` under key `mw_state_v1`. A hidden **Reset demo** link in Me → Settings clears it.
- Single-page app: one `index.html`, screens are `<section data-screen="home">` elements shown/hidden by the router. Router listens to `hashchange`.
- Layout: mobile first at **390 px** width. On screens wider than 600 px, show the app inside a centred phone frame (390 × 780, rounded corners, soft shadow) on a neutral background.
- Accessibility basics: semantic buttons, `aria-label` on icon buttons, visible focus ring, contrast of at least 4.5:1, tap targets of at least 44 px.

### File structure

```
mohallywala/
  index.html            shell, SVG sprite, all <section> screens, toast container
  css/
    tokens.css          colours, spacing, radius, type scale
    base.css            reset, phone frame, typography
    components.css      buttons, chips, cards, badges, timeline, tabs, form, toast, bars
  js/
    data.js             all hard-coded demo data (section 6)
    state.js            load/save localStorage, reset
    i18n.js             EN/UR dictionary, setLang(), dir switching
    router.js           hash routes, show/hide screens, active tab
    ui.js               toast(), render helpers, formatting
    screens.js          render functions per screen (home, issue, report, community, me, authority, board)
  assets/               logo.svg, favicon
```

---

## 3. Design system

### 3.1 Tokens (`tokens.css`)

```css
:root {
  /* colour */
  --bg: #F6F7F9;
  --surface: #FFFFFF;
  --ink: #16202A;
  --muted: #5F6B76;
  --line: #E4E8EC;
  --brand: #1F6F5C;        /* deep green: trust, neighbourhood */
  --brand-ink: #FFFFFF;
  --brand-soft: #E3F1EC;
  --accent: #F2A33A;       /* warm amber for the Report button / highlights */

  /* status */
  --s-submitted: #6B7A8A;
  --s-verified:  #2F6FB0;
  --s-assigned:  #7B55B8;
  --s-progress:  #D98A1F;
  --s-resolved:  #2E8B57;
  --s-reopened:  #C0392B;

  /* shape */
  --r-sm: 8px; --r-md: 14px; --r-lg: 22px; --r-pill: 999px;
  --shadow: 0 2px 10px rgba(22,32,42,.08);

  /* spacing scale */
  --sp-1: 4px; --sp-2: 8px; --sp-3: 12px; --sp-4: 16px; --sp-5: 24px; --sp-6: 32px;
}
```

### 3.2 Typography
- Latin: system stack (`-apple-system, "Segoe UI", Roboto, sans-serif`).
- Urdu: `"Noto Nastaliq Urdu", "Noto Naskh Arabic", serif` with `line-height: 2` for Urdu text.
- Scale: 12 / 14 / 16 / 20 / 24 px. Body 16. Headings semibold.

### 3.3 Components to build once and reuse

| Component | Notes |
|---|---|
| **App bar** | Area name (dropdown look, not functional), language toggle (EN | اردو), view switch (Resident | Authority), bell icon with unread dot |
| **Bottom tab bar** | Home, Map, **Report (+)** raised amber circle in the centre, Community, Me |
| **Chip** | Category filter; active = brand-soft background and brand text |
| **Issue card** | Category icon, title, location text, status badge, support count with "Me too" button, small photo placeholder (coloured block with icon), anonymous label if relevant |
| **Status badge** | Pill coloured by status token |
| **Timeline** | Vertical steps: Submitted → Verified → Assigned → In progress → Resolved → Confirmed. Done = filled dot, current = ringed dot, future = grey |
| **Stat card** | Large number, small label |
| **Bar row** | Label, horizontal bar, value (used in polls and board) |
| **Toast** | Bottom-centre, auto-hides after 2.5 s |
| **Bottom sheet** | Used for the duplicate prompt and Join confirmation |
| **Empty/Coming-soon state** | Icon plus one line |

---

## 4. Screens and layout

Each screen has a route, a layout and its interactions.

### 4.1 Onboarding (`#/welcome`)
- Logo and tagline: "Your mohalla. Your voice."
- Language buttons: English / اردو.
- Area picker (fake list, preselected "Noor Colony, Block C").
- Primary button **Continue as guest** (goes to Home). Secondary **Sign in** (dummy toast).
- Shown once; flag stored in state.

### 4.2 Home (`#/home`)
1. App bar.
2. **Summary strip** (horizontal scroll): "12 open issues", "5 resolved this month", "Next meeting: Sat 6 pm".
3. **Category chips**: All, Roads, Safety, Water, Sanitation, Electricity.
4. **Issue cards** list, newest first.
5. **Pinned announcement** card at the top (committee notice).
- Tapping a card opens `#/issue/:id`. "Me too" on a card does not navigate.

### 4.3 Issue detail (`#/issue/:id`)
- Back arrow, share icon (WhatsApp link).
- Title, category, location text, posted time, reporter ("Aisha K." or "Anonymous").
- Photo placeholder block.
- Status badge and **"Expected fix: 5 days"** line.
- **Timeline** component.
- Support block: count, **Me too** button, small avatars row ("Bilal and 22 others").
- Updates list (authority replies, resident comments).
- Comment input at the bottom (dummy: adds nothing, toast).
- Resident-only action when status is Resolved: **Confirm fixed** / **Not fixed** (Confirm sets Confirmed; Not fixed sets Reopened).

### 4.3b Simulate authority update
Floating small button on the issue detail, labelled **Demo: next status** (visible only when `state.demoControls` is on; default on). Clicking:
1. Advances status one step.
2. Adds an update line from the authority.
3. Shows a toast: "Update: In progress".
4. Adds a notification (red dot on the bell).

### 4.4 Report flow (`#/report`)
Three steps in one screen with a progress indicator (1 of 3).

| Step | Content |
|---|---|
| 1. What | Category tiles (6 big buttons with icons), title input, description textarea |
| 2. Where and proof | "Use my location" (fake: fills "Near Block C park"), location text input, photo picker (shows preview with `FileReader`, no upload), **Report anonymously** toggle with a helper line: "Neighbours won't see your name. The authority will see it was verified." |
| 3. Review | Summary card, **Submit** button |

- **Duplicate prompt:** after step 1, if title or description contains a seeded keyword (`pothole`, `garbage`, `water`, `light`, `streetlight`), open a bottom sheet: "2 neighbours already reported something like this", showing the matching issue card with two buttons: **Support that issue** (goes to it, adds one support) or **Report anyway**.
- On submit: new issue is added at the top of the feed with status Submitted, success screen "Reported. We'll tell you when it moves.", button to view it.

### 4.5 Map (`#/map`)
- Inline SVG of a simplified neighbourhood (roads as grey lines, a park, a mosque icon, a school icon). No real map tiles.
- 8 coloured pins positioned with CSS (`left/top` in %). Colour = status. Tapping a pin opens a bottom sheet with a compact issue card and **View**.
- Category chips above filter pins.
- Legend row at the bottom.

### 4.6 Community (`#/community`)
Segmented control with 4 tabs, all light.
1. **Groups:** cards (name, type, members, short description, **Join**). Join becomes "Requested" (state saved).
2. **Committee:** the "Noor Colony Residents Committee" page: members with roles, next meeting, agenda items linked to issues, **Suggest an agenda item** (dummy).
3. **Events:** list with date block, place, RSVP count, **RSVP** toggle.
4. **Polls:** one active poll with options; first tap records a vote and shows result bars; second tap does nothing.

### 4.7 Accountability board (`#/board`) (linked from Home summary strip and Me)
- Title "How responsive are they?"
- Table or cards per authority: Water & Sewerage, Roads (KMC), Electricity, Police station. Each shows: issues received, % resolved, median days to respond, and a green/amber/red dot.
- Values are **calculated from `data.js` issues** where possible, plus seeded numbers for the rest.
- Small note: "Demo data".

### 4.8 Authority view (`#/authority`, shown when the view switch is set to Authority)
- Different app-bar tint (dark blue) and label "Authority: Water & Sewerage Corp (demo)".
- Table: ID, issue, location, supports, status, age, **Actions** (Assign, Update status, Add proof). Actions open a bottom sheet with a status dropdown and note box; saving updates state and shows a toast.
- Filter chips by status. Sort by supports (default).
- A bar at the top: "Overdue: 3 issues" highlighted red.
- On desktop width the table can use the full phone frame width with horizontal scroll.

### 4.9 Me (`#/me`)
- Profile card (guest or "Aisha K."), area.
- My reports, Issues I support (lists).
- Notifications list (items created by the demo update button).
- Settings: language, **Demo controls** toggle, **Reset demo**.
- Dummy rows: Sign in, Verify phone (toast).

### 4.10 "About the project" (`#/about`)
One screen reachable from Me. Shows the problem and 4 survey stats (67.9% never attended a meeting, 76.8% feel unheard, 67.9% would use an app, 44.4% want anonymity) as stat cards. Useful as a bridge between slides and demo.

---

## 5. Interaction details

- **Router:** `location.hash` → show matching `<section>`, hide others, update active tab, scroll to top. Unknown route → Home.
- **State shape**

```js
state = {
  lang: "en",            // "en" | "ur"
  view: "resident",      // "resident" | "authority"
  onboarded: false,
  demoControls: true,
  supported: [3, 7],     // issue ids
  rsvps: [],             // event ids
  joined: [],            // group ids (requested)
  votes: { poll1: null },
  confirmed: [],         // issue ids
  notifications: [],     // {id, text, time, read}
  issues: [...]          // copied from data.js on first load, then mutated
}
```

- **Support:** toggles membership in `supported`, adjusts the count by ±1, updates the card and detail without a full re-render.
- **Status order:** `submitted → verified → assigned → in_progress → resolved → confirmed`. `reopened` returns the issue to `assigned`.
- **Language:** `setLang()` sets `<html lang dir>` and replaces text for elements with `data-i18n="key"`. Anything not in the dictionary stays in English. Mirror the layout (tab bar order stays, text aligns right, back arrow flips).
- **Toasts for dummies:** one helper `comingSoon()` → "This is a prototype. Feature coming soon."
- **Performance:** no concern; keep it simple.

---

## 6. Hard-coded demo data (`data.js`)

Use these as seed values. Names are fictional. Dates are relative ("2 days ago") to avoid stale timestamps.

```js
export const AREA = { name: "Noor Colony, Block C", city: "Karachi" };

export const CATEGORIES = [
  { id: "roads",       label: "Roads",       icon: "road" },
  { id: "safety",      label: "Safety",      icon: "shield" },
  { id: "water",       label: "Water",       icon: "drop" },
  { id: "sanitation",  label: "Sanitation",  icon: "trash" },
  { id: "electricity", label: "Electricity", icon: "bolt" },
  { id: "other",       label: "Other",       icon: "dots" }
];

export const AUTHORITIES = {
  water:       { name: "Water & Sewerage Corp", short: "Water" },
  roads:       { name: "Roads Department (KMC)", short: "Roads" },
  electricity: { name: "Electric Utility",       short: "Power" },
  police:      { name: "Local Police Station",   short: "Police" },
  sanitation:  { name: "Solid Waste Management", short: "Waste" }
};

export const ISSUES = [
  { id: 1, cat: "roads", title: "Deep pothole near Block C park gate", place: "Park Road, near gate 2",
    reporter: "Aisha K.", anon: false, supports: 31, age: "2 days ago", status: "assigned", auth: "roads",
    eta: "5 days", pin: { x: 38, y: 52 },
    updates: [
      { who: "Roads Dept", text: "Site inspected. Repair scheduled.", when: "1 day ago" },
      { who: "Bilal R.",   text: "Two bikes slipped here this week.", when: "1 day ago" }
    ]},
  { id: 2, cat: "water", title: "No water supply for 4 days", place: "Lane 5, Block C",
    reporter: "Anonymous", anon: true, supports: 47, age: "4 days ago", status: "in_progress", auth: "water",
    eta: "2 days", pin: { x: 62, y: 30 },
    updates: [{ who: "Water Corp", text: "Valve fault found. Crew on site.", when: "6 hours ago" }]},
  { id: 3, cat: "sanitation", title: "Garbage not collected for a week", place: "Behind the market",
    reporter: "Hamza S.", anon: false, supports: 58, age: "6 days ago", status: "verified", auth: "sanitation",
    eta: "3 days", pin: { x: 22, y: 70 }, updates: [] },
  { id: 4, cat: "safety", title: "Streetlights off on the school road", place: "School Road",
    reporter: "Anonymous", anon: true, supports: 40, age: "3 days ago", status: "submitted", auth: "electricity",
    eta: "Pending", pin: { x: 74, y: 62 }, updates: [] },
  { id: 5, cat: "roads", title: "Broken speed breaker causing accidents", place: "Main Avenue",
    reporter: "Sana M.", anon: false, supports: 19, age: "9 days ago", status: "resolved", auth: "roads",
    eta: "Done", pin: { x: 50, y: 78 },
    updates: [{ who: "Roads Dept", text: "Breaker rebuilt. Please confirm.", when: "1 day ago" }]},
  { id: 6, cat: "water", title: "Sewage overflow at the corner of Lane 2", place: "Lane 2 corner",
    reporter: "Usman T.", anon: false, supports: 36, age: "5 days ago", status: "assigned", auth: "water",
    eta: "4 days", pin: { x: 30, y: 36 }, updates: [] },
  { id: 7, cat: "safety", title: "Mobile snatching reported near the bus stop", place: "Bus stop, Main Avenue",
    reporter: "Anonymous", anon: true, supports: 52, age: "2 days ago", status: "verified", auth: "police",
    eta: "Patrol requested", pin: { x: 84, y: 44 }, updates: [] },
  { id: 8, cat: "electricity", title: "Frequent voltage drops in the evening", place: "Lanes 3 to 6",
    reporter: "Dr. Farhan A.", anon: false, supports: 24, age: "8 days ago", status: "in_progress", auth: "electricity",
    eta: "7 days", pin: { x: 58, y: 18 }, updates: [] },
  { id: 9, cat: "sanitation", title: "Open drain without cover near the playground", place: "Playground side",
    reporter: "Zainab I.", anon: false, supports: 28, age: "12 days ago", status: "confirmed", auth: "sanitation",
    eta: "Done", pin: { x: 14, y: 48 }, updates: [{ who: "Residents", text: "Confirmed fixed by 12 neighbours.", when: "3 days ago" }]},
  { id: 10, cat: "roads", title: "Waterlogging after every rain", place: "Lane 4 entrance",
    reporter: "Imran Q.", anon: false, supports: 33, age: "10 days ago", status: "reopened", auth: "roads",
    eta: "6 days", pin: { x: 68, y: 82 }, updates: [{ who: "Residents", text: "Marked not fixed after the last rain.", when: "1 day ago" }]}
];

export const GROUPS = [
  { id: 1, name: "Noor Colony Residents Committee", type: "Committee", members: 64, desc: "Monthly meetings; works with local offices on roads and water." },
  { id: 2, name: "Clean Block C Volunteers",         type: "Volunteers", members: 41, desc: "Weekend clean-ups and waste awareness." },
  { id: 3, name: "Youth for Safe Streets",           type: "Youth group", members: 88, desc: "Streetlight audits and safety walks." },
  { id: 4, name: "Neighbourhood Watch (Block C)",    type: "Safety", members: 52, desc: "Night patrol coordination with the police station." },
  { id: 5, name: "Local Health Camp Team (NGO)",     type: "NGO", members: 23, desc: "Free check-up camps; looking for volunteers." }
];

export const COMMITTEE = {
  name: "Noor Colony Residents Committee",
  members: [
    { name: "Haji Rashid", role: "Chair" }, { name: "Nazia Parveen", role: "Secretary" },
    { name: "Ali Raza", role: "Treasurer" }, { name: "Sana Malik", role: "Youth lead" }
  ],
  nextMeeting: "Saturday, 6:00 pm, Community Hall",
  agenda: [ { text: "Water supply fault, Lane 5", issueId: 2 },
            { text: "Garbage collection schedule", issueId: 3 },
            { text: "Streetlights on School Road", issueId: 4 } ]
};

export const EVENTS = [
  { id: 1, title: "Monthly mohalla meeting",    when: "Sat, 6:00 pm", place: "Community Hall", going: 27 },
  { id: 2, title: "Block C clean-up drive",     when: "Sun, 9:00 am", place: "Park Road",      going: 35 },
  { id: 3, title: "How to write a complaint (workshop)", when: "Next Fri, 5:00 pm", place: "Online", going: 18 }
];

export const POLL = {
  id: "poll1", question: "What should we fix first?",
  options: [ { id: "a", label: "Water supply", votes: 41 }, { id: "b", label: "Garbage collection", votes: 33 },
             { id: "c", label: "Streetlights", votes: 29 }, { id: "d", label: "Road repair", votes: 22 } ]
};

export const BOARD_SEED = [
  { auth: "water",       received: 38, resolvedPct: 61, medianDays: 3.5, tone: "amber" },
  { auth: "roads",       received: 52, resolvedPct: 38, medianDays: 8.0, tone: "red" },
  { auth: "electricity", received: 29, resolvedPct: 72, medianDays: 2.0, tone: "green" },
  { auth: "police",      received: 17, resolvedPct: 24, medianDays: 6.5, tone: "red" },
  { auth: "sanitation",  received: 44, resolvedPct: 45, medianDays: 5.0, tone: "amber" }
];

export const ANNOUNCEMENT = {
  title: "Committee notice",
  text: "Monthly meeting this Saturday at 6 pm. Bring your top 3 issues. Chai provided."
};

export const SURVEY_STATS = [
  { n: "67.9%", label: "never attended a community meeting in person" },
  { n: "76.8%", label: "feel their voice has little or no impact" },
  { n: "67.9%", label: "would use a mobile reporting app" },
  { n: "44.4%", label: "need an option to report anonymously" }
];

export const I18N = {
  en: { home: "Home", map: "Map", report: "Report", community: "Community", me: "Me",
        meToo: "Me too", submit: "Submit", continue: "Continue", status_submitted: "Submitted",
        status_verified: "Verified", status_assigned: "Assigned", status_in_progress: "In progress",
        status_resolved: "Resolved", status_confirmed: "Confirmed", status_reopened: "Reopened" },
  ur: { home: "ہوم", map: "نقشہ", report: "شکایت", community: "کمیونٹی", me: "میرا",
        meToo: "میں بھی", submit: "جمع کروائیں", continue: "جاری رکھیں", status_submitted: "جمع شدہ",
        status_verified: "تصدیق شدہ", status_assigned: "تفویض", status_in_progress: "کام جاری",
        status_resolved: "حل شدہ", status_confirmed: "تصدیق مکمل", status_reopened: "دوبارہ کھولا گیا" }
};
```

---

## 7. Build order (use these as separate prompts)

1. **Shell:** `index.html` with phone frame, app bar, bottom tab bar (Report button centred), empty sections for every route, toast container, SVG sprite. Add `tokens.css`, `base.css`.
2. **Router and state:** `router.js`, `state.js`, `ui.js` with `toast()` and `comingSoon()`. Tabs switch screens.
3. **Home and issue card:** render the feed from `data.js`, category chips, summary strip, announcement card.
4. **Issue detail:** timeline, support button, updates, share link, "Demo: next status" button, notifications, resolved → Confirm / Not fixed.
5. **Report flow:** 3 steps, photo preview, anonymous toggle, duplicate bottom sheet, success state, new issue appears in feed.
6. **Authority view and board:** view switch, table, status sheet, board numbers computed from state.
7. **Community:** groups (Join toggle), committee page, events (RSVP), poll (vote bars).
8. **Map and About:** SVG map with pins and sheet; About screen with survey stats.
9. **Language:** `i18n.js`, EN/UR toggle, RTL tweaks.
10. **Polish:** empty states, focus styles, 360 px and desktop checks, Reset demo, favicon, final colour and spacing pass.

### Prompt template for each step
> You are building a front-end-only prototype called MohallyWala in plain HTML, CSS and vanilla JS (no frameworks, no build step). Follow the file structure, design tokens, and data in `prototype_plan.md`. Now implement **step N: <name>**. Edit only the files needed. Keep code readable and commented, keep everything working offline, and do not add a backend or dependencies. After finishing, list what works and what is a dummy.

---

## 8. Demo script (5 minutes)

1. **About** screen: show the 4 survey stats, then **Home**: "this is what a neighbourhood sees."
2. **Report:** type "pothole", show the duplicate prompt, support the existing issue; then file a new one anonymously with a photo.
3. **Share** an issue to WhatsApp.
4. Switch to **Authority** view; update the new issue's status.
5. Back to the resident: notification appears, timeline has moved.
6. Open the resolved speed-breaker issue and tap **Confirm fixed**.
7. Open the **Accountability board**: numbers have changed.
8. **Community:** committee page, RSVP to the meeting, vote in the poll.
9. Close: "Reporting tools exist. What's missing is trust, follow-through, and organised neighbours. This is that layer."

If something breaks: **Me → Reset demo**, refresh, continue. Keep a screen recording as a backup.

---

## 9. Presentation notes

- Add one slide before the demo titled **"What already exists"** listing current civic reporting tools (including Karachi Wala once you have checked its features) and the gap you address (trust, follow-through, community structure).
- Be clear on the slide or aloud: "data in this prototype is demo data; names are fictional."
- Don't claim to be first. Claim fit: hyperlocal, resident-run, closes the loop.

---

## 10. Definition of done

- [ ] All routes in section 4 open without console errors.
- [ ] Report → feed → authority update → resident notification → confirm works end to end.
- [ ] Every dummy button shows a toast and nothing breaks.
- [ ] Looks right at 360 px, 390 px and desktop (phone frame).
- [ ] English and Urdu toggle works for navigation labels and statuses; layout flips to RTL.
- [ ] Reset demo restores the original data.
- [ ] Runs offline from `index.html`.
- [ ] Backup screen recording saved.

## 11. After the presentation (optional)

Reuse the same screens and CSS tokens with a real backend. See `plan.md` section 6.3 for the production path (Supabase or FastAPI + PostgreSQL, Next.js PWA, then React Native).
