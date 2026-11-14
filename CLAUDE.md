# Small Steps — Project Context for Claude Code

You are pair-programming with me on **Small Steps**, an MVP web app that helps beginners build healthy habits one small step at a time. This repo (`eddiecarrascobuilds/healthy-habits-app`) is empty except for a README. Your first job is to scaffold the project, then we build screens together.

## About me (the developer)
- Strong backend experience; I read code well.
- Limited front-end experience. Explain React/Tailwind patterns briefly when you introduce them, and keep components small and readable.
- I own: data model, repository interfaces, domain logic + tests, CI. You lead: React screens, components, styling, charts, accessibility.

## Product background (from the approved PRD)
User interviews produced three personas:
- **Lesslie** — new mom, never worked out, overwhelmed by calories/steps/workouts all at once. Needs ONE simple habit at a time, plain language, encouraging feedback.
- **Masha** — office professional turning 35, early high blood pressure. Juggles 3 apps; none tracks sodium. Needs steps + low-sodium nutrition + workouts in one place, and a weekly summary for her doctor.
- **Brandon** — personal trainer. Repeats basics with every client, can't see their habits. (Trainer features are **Phase 2, out of MVP scope**.)

Design principles: **Start small · Keep it in one place · Encourage, never punish** (no red, no failure language).

## MVP scope — four screens
1. **Onboarding** (`/#/onboarding`) — one plain-language question per screen (3–5 total), progress "Question 2 of 4" with bar segments, large radio-style answer cards, Back + Continue. Never ask for calorie/macro/weight targets. Example Q: "How much free time do you usually have in a day?" (Less than 10 min / 10–20 / 20–40 / 40+).
2. **Your first habit** (`/#/first-habit`) — single card: "Your first habit: A 10-minute walk", two-sentence reason, tags ("10 minutes a day", "Bring the stroller along"), seven empty day circles (Mon–Sun), note "That's all for this week…", button "Start my first week".
3. **Today** (`/#/today`) — sidebar nav (Today, My habits, Learn, Progress). Greeting "Good evening, Lesslie". Habit card with toggle button ("Mark today's walk" / "Walked today"), message ("3 of 4 days. Nice start, pick it back up tomorrow."), seven day circles: completed = filled green with check, missed = plain gray outline (NEVER red), upcoming = dashed. Longest-streak card. Dashed "Coming up: Add a vegetable to dinner" card with "Unlocks after week 2" badge.
4. **Weekly summary** (`/#/summary`) — Masha's week (Nov 2–8). Highlight card ("You stayed under your sodium goal 5 of 7 days"), two line charts (daily steps, goal 8,000; daily sodium, goal under 2,300 mg) with dashed goal lines; over-goal sodium days marked with an **orange** hollow dot, not red. Workouts card "3 of 3 completed" (Mon full body, Thu legs — moved from Wed, Sat upper body). Focus card ("Lunches were your highest-sodium meals…"). "Save as report" button → browser print-to-PDF with a print stylesheet.

Sample data (Masha, Mon→Sun): steps 7200, 8100, 12000, 6900, 8800, 9400, 7600 (avg 8,571); sodium mg 1900, 2100, 2600, 1800, 2200, 2500, 2000 (avg 2,157).

## Design tokens (match the mockups)
- Font: **Plus Jakarta Sans** (400/500/600/700) — self-host via `@fontsource/plus-jakarta-sans`.
- Colors: background `#F5F6F2`, surface `#FFFFFF`, border `#E2E5DE`, ink `#1C2620`, muted text `#5B665F`, primary green `#2E7D57`, deep green `#1F5C3F`, soft green `#E4F2EA`, darkest green `#16432E`, outline gray `#C9CFC6`, dashed `#DCE0D8`, warm orange (over-goal) `#A85A12`.
- Rounded cards (radius 24px), pill buttons (radius 26px, min-height 48–52px), uppercase small labels with letter-spacing.
- Accessibility: WCAG 2.2 AA, real `<button>`/`<a>`/`<input>`, labeled charts (`role="img"` + `aria-label`), touch targets ≥ 44px, status never by color alone.
- Layout: sidebar + content that stacks at phone widths.

## Tech stack (from the TRD)
| Layer | Choice |
|---|---|
| Build | Vite |
| UI | React 19 + TypeScript (strict) |
| Styling | Tailwind CSS (put the tokens above in the theme) |
| Routing | React Router with **HashRouter** (GitHub Pages has no SPA fallback) |
| Charts | Recharts |
| Storage | browser `localStorage` with seed data |
| Step sync | simulated with seed data |
| Reports | print-to-PDF + print stylesheet |
| Testing | Vitest (+ Testing Library); Playwright for one e2e flow per screen |
| Lint | ESLint |
| Deploy | GitHub Actions → GitHub Pages on push to `main`; Vite `base: '/healthy-habits-app/'` |

## Architecture — three layers (only the data layer changes when we scale)
1. **UI** — `src/screens/`, `src/components/`
2. **Domain** — pure TS functions, no React, no storage: `src/domain/`
3. **Data** — repository interfaces + localStorage implementation: `src/data/`

```
src/
  screens/      Onboarding, FirstHabit, Today, WeeklySummary
  components/   HabitCard, DayCircles, StatCard, TrendChart, Sidebar
  domain/       streaks.ts, nextHabit.ts, weeklySummary.ts, reschedule.ts, config.ts
  data/         repositories.ts (interfaces), localStorageRepo.ts, seed.ts
  styles/       index.css, print.css
tests/          unit (Vitest) + e2e (Playwright)
```

## Data model
- **User**: id, name, healthFocus (`none` | `sodium`), onboardingAnswers
- **Habit**: id, userId, type (`walk` | `vegetable` | `workout`), title, reason, status (`active` | `upcoming` | `done`), startedOn
- **HabitLog**: habitId, date, completed
- **StepEntry**: userId, date, steps
- **MealLog**: userId, date, mealType, name, calories, sodiumMg
- **Workout**: userId, scheduledDate, type, completed, movedFrom?
- **WeeklySummary**: userId, weekStart, highlight, focus, totals — computed, not stored

## Domain rules (thresholds live in `domain/config.ts`)
- **Streaks**: consecutive completed days; a miss ends the streak but is never shown as failure.
- **Next habit**: offer after 14 days with ≥ 10 completed; user may accept early.
- **Sodium flag**: meal > 800 mg flagged with a lower-sodium suggestion; daily goal < 2,300 mg.
- **Workout reschedule**: steps > 11,000 on a strength day → suggest moving the workout to the next day.
- **Weekly summary**: highlight = strongest metric vs goal; focus = weakest.

## Out of scope for MVP
Backend, auth, real wearable/nutrition APIs, trainer features, native mobile, social features, macro tracking, medical advice. Add a "Reset demo" button that clears localStorage.

## First task — scaffold the project
1. Create a branch `setup/scaffold`.
2. Scaffold Vite + React + TypeScript (strict) in the repo root; keep the existing README.md.
3. Add Tailwind with the design tokens, the self-hosted font, React Router (HashRouter) with the four routes and placeholder screens, Recharts, ESLint, Vitest + Testing Library, Playwright config.
4. Create the folder structure above, `data/repositories.ts` interfaces, a `localStorageRepo.ts` stub, and `seed.ts` with Lesslie's and Masha's sample data.
5. Add `domain/config.ts` with the thresholds and one example unit test for `streaks.ts`.
6. Add `.github/workflows/deploy.yml` to build and deploy to GitHub Pages on push to `main`.
7. Make sure `npm run dev`, `npm run build`, `npm test` and `npm run lint` all pass.
8. Summarize what you created, explain anything front-end specific I should understand, and **ask before committing or pushing**.

After scaffolding, we'll build the screens in order: Onboarding → First habit → Today → Weekly summary.
