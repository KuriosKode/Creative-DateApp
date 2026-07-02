# Creative-DateApp

A romantic, single-page web application that walks someone through a personalized date proposal — collecting their availability, energy level, food preference, and music taste before generating a custom date itinerary they can save or share.

---

## Project Structure

```
Creative-Proposal_App/
├── index.html   — App shell and all step markup
├── script.js    — All state, logic, and DOM interactions
├── style.css    — Design system, animations, and responsive styles
└── README.md    — This file
```

No build tools, no frameworks, no dependencies. Pure HTML, CSS, and vanilla JavaScript. The only external resource is the **Inter** font loaded from Google Fonts.

---

## Architecture

### Pattern

The app is a **linear multi-step wizard** rendered as a single HTML page. All steps exist in the DOM simultaneously as `<section>` elements. Visibility is controlled by toggling a single `.active` CSS class. There is no routing, no page reloads, and no server.

State is held in five plain variables declared at the top of the `DOMContentLoaded` callback:

| Variable        | Type   | Holds                                  |
|-----------------|--------|----------------------------------------|
| `selectedDate`  | string | ISO date string from the date picker   |
| `selectedTime`  | string | Time string from the select dropdown   |
| `selectedMood`  | number | Range slider value, 1–100 (default 50) |
| `selectedFood`  | string | Label of the chosen food card          |
| `selectedMusic` | string | Label of the chosen music card         |

### Step Transition

A single `showStep(stepElement)` utility hides all `.step` elements, then adds `.active` to the target after a 10ms tick (to allow the CSS transition to re-trigger). Each transition plays a `fadeSlideUp` keyframe animation.

---

## Steps / Screens

| ID              | Label            | Step # | Description                                                  |
|-----------------|------------------|--------|--------------------------------------------------------------|
| `step-1`        | Invitation       | 01/07  | "Will you go on a date with me?" with Accept / Decline buttons |
| `step-2`        | Reaction         | 02/07  | Confirmation screen after accepting                          |
| `step-3`        | Parameters       | 03/07  | Date picker + time selector + live terminal log              |
| `step-4`        | Diagnostics      | 04/07  | Energy/mood range slider                                     |
| `step-5`        | Preferences      | 05/07  | Food selection grid (dynamically populated from mood)        |
| `step-6`        | Acoustics        | 06/07  | Music genre selection grid (static, 6 options)               |
| `step-loading`  | Loading          | —      | Animated spinner with cycling log messages (~3.2s)           |
| `step-7`        | Itinerary        | 07/07  | Summary + Download ICS + Copy text + Surprise button         |
| `step-8`        | Gratitude        | ♥/♥   | Animated CSS rose + thank-you message + back button          |

---

## Feature Breakdown

### Step 1 — Runaway "Decline" Button
The `#btn-no` button runs away on `mouseover` (desktop) and `touchstart` (mobile). On the first interaction it is pulled out of document flow via `position: fixed`, then repositioned to a random coordinate within the viewport bounds on every subsequent hover. It uses a spring-like CSS transition (`cubic-bezier(0.34, 1.56, 0.64, 1)`) for a bouncy feel.

### Step 3 — Scheduling & Terminal Log
- The date input enforces `min = today` so past dates cannot be selected.
- A `#overthinking-log` terminal element displays contextual flavor text whenever the date or time changes (timezone-corrected day name for the date, trimmed display string for the time).
- The "Next" button stays disabled until both fields have a value.

### Step 4 — Mood Slider
A styled `range` input (1–100, default 50). The thumb is a custom green SVG heart via `background-image`. The value is stored in `selectedMood` and consumed in the next step.

### Step 5 — Dynamic Food Grid
Food options are generated at runtime based on the mood value:
- **< 50 (low energy):** Kelewele, Beans & Plantain, Bofrot, Indomie & Fried Egg
- **≥ 50 (energetic):** Jollof Rice, Banku & Grilled Tilapia, Waakye, Fried Yam & Chicken

All options are Ghanaian local cuisine. Cards are injected via `createElement` and wired with click listeners on the fly.

### Step 6 — Music Grid
Six static music genre cards: Love Songs, Gospel, Afrobeats, Hip-hop, Reggae, R&B. Selection logic mirrors the food grid (single-select, highlights with green border + inner glow).

### Loading Screen
Cycles through 5 log messages every 600ms using `setInterval`. After 3200ms it clears the interval, formats the summary, and transitions to the itinerary screen.

### Step 7 — Itinerary & Actions

**Download Calendar Invite (`#btn-download`)**
Generates a `.ics` (iCalendar) file in-browser via `generateICS()`. Parses the selected date and AM/PM time string, sets a 2-hour duration, assembles a `VCALENDAR` blob, and triggers a download via a temporary `<a>` tag. Button shows a checkmark for 3 seconds on success.

**Copy Details (`#btn-copy`)**
Formats a plain-text date summary and writes it to the clipboard via the Clipboard API (`navigator.clipboard.writeText`). Shows confirmation text for 3 seconds on success.

**Surprise Button (`#btn-reveal-surprise`)**
Navigates to the Gratitude screen (`step-8`).

### Step 8 — Animated CSS Rose
A fully CSS-animated rose built from layered `<div>` elements:
- **20 petals** split into 4 tiers: outer (6), mid (6), inner (5), core (4)
- Each petal uses CSS custom properties (`--rot`, `--tx`, `--ty`, `--scale`, `--delay`) to position and time the bloom animation independently
- **Stem** grows downward via a `scaleY` keyframe (`stemGrow`)
- **Leaves** (×2) pop in with a spring animation (`leafGrow`)
- **Thorns** (×2) are pure CSS clip-path triangles
- The entire flower gently floats with a looping `roseFloat` keyframe
- All bloom animations fire only when `#step-8` has the `.active` class, so they replay correctly every time the screen is shown

---

## Visual Design System (`style.css`)

### CSS Custom Properties (`:root`)

| Variable               | Value            | Role                           |
|------------------------|------------------|--------------------------------|
| `--bg-color`           | `#0b0b0f`        | Page background                |
| `--card-bg`            | `#121217`        | App card surface               |
| `--text-primary`       | `#ffffff`        | Headings and body text         |
| `--text-secondary`     | `#7d7d8e`        | Labels, descriptions, metadata |
| `--border-color`       | `#22222b`        | Default borders                |
| `--border-hover`       | `#31313d`        | Hover-state borders            |
| `--accent` / `--terminal-green` | `#4ade80` | Green accent, selected states, terminal text |
| `--primary-btn`        | `#f0f0f3`        | Primary button background      |
| `--primary-btn-text`   | `#0b0b0f`        | Primary button label           |

### Background
The `body` uses three stacked CSS backgrounds:
1. A subtle white horizontal grid (40px)
2. A subtle white vertical grid (40px)
3. A soft purple radial glow at the top center

### Key Animations

| Name          | Trigger              | Effect                                  |
|---------------|----------------------|-----------------------------------------|
| `fadeSlideUp` | `.step.active`       | Steps fade in and slide up 8px          |
| `heartPulse`  | `.heart-inline`, selected cards | Gentle scale + green glow     |
| `floatUp`     | `.bg-heart`          | Hearts drift from bottom to top of viewport |
| `burstDrift`  | `.burst-heart`       | Click particles burst outward and fade  |
| `spin`        | `.loader`            | CSS spinner for loading states          |
| `petalBloom`  | `#step-8.active .petal` | Petals scale and rotate into position |
| `stemGrow`    | `#step-8.active .stem`  | Stem scales from 0 to full height     |
| `leafGrow`    | `#step-8.active .leaf`  | Leaves spring into position           |
| `roseFloat`   | `.flower`            | Continuous gentle float + tilt          |
| `coreGlow`    | `.flower::after`     | Pulsing pink aura at the bud center     |

### Responsive Breakpoint
A single breakpoint at `max-width: 480px` reduces padding, font sizes, card padding, and gaps for mobile screens.

---

## Ambient Effects (`script.js`)

### Floating Background Hearts
On load, 15 hearts are pre-seeded at random vertical positions to avoid an empty screen at startup. After that, `setInterval` spawns a new `.bg-heart` every 2500ms. Each heart gets:
- Random horizontal position (0–100vw)
- Random font size (16–36px)
- Random color: dim green, near-white, or dark charcoal (all very low opacity)
- Random animation duration (12–24s)
- Auto-removal from the DOM when its animation ends

### Click Burst Particles
A `click` listener on `document` fires when the target is a `.btn`, `.food-card`, `input`, or `select`. It spawns 6 `.burst-heart` elements at the cursor position, each flying outward at a random angle (25–70px radius) and fading out over 1200ms via CSS custom properties (`--dest-x`, `--dest-y`). Each particle is removed from the DOM after its animation.

---

## How to Run

Open `index.html` in any modern browser. No installation, no build step, no server required.

```
# Windows
start index.html

# macOS
open index.html
```
