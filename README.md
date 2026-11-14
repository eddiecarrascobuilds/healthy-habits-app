# Small Steps

**Build healthy habits one small step at a time.**

Small Steps is a web app that helps beginners start and keep healthy habits without feeling overwhelmed. This repository holds the MVP demo, a static React app hosted on GitHub Pages.

> **Live demo:** `https://<your-github-username>.github.io/<repo-name>/`

---

## Executive Summary

**The problem.** Most health apps ask for everything at once: calorie targets, macros, step goals and long workout plans. In our user interviews:

- **Lesslie**, a new mom, felt overwhelmed and didn't know where to start.
- **Masha**, an office professional with early signs of high blood pressure, juggled three apps that didn't share data or track sodium.
- **Brandon**, a personal trainer, repeated the same basics with every client and couldn't see their habits between sessions.

**The solution.** Small Steps:

- starts every user with **one simple habit** and adds more only when they're ready
- brings **steps, nutrition (including sodium) and workouts** into one place
- gives **encouraging feedback**: missed days are never shown in red
- turns each week into a **one-page summary** with one highlight and one focus area

**The MVP.** This demo delivers four core screens, built from our approved Product Requirements Document:

| Screen | What it does |
| --- | --- |
| Onboarding | One plain-language question per screen; no calorie or macro targets |
| Your first habit | A single habit card (for example, a 10-minute walk) with a short reason why |
| Today | Weekly progress as day circles, a streak counter and encouraging messages |
| Weekly summary | Step and sodium charts with goal lines, workouts completed, and next week's focus |

The demo uses **sample data stored in your browser**. No account is needed, and nothing is sent to a server.

---

## Tech Stack

| Layer | Choice |
| --- | --- |
| Build | Vite |
| UI | React + TypeScript |
| Styling | Tailwind CSS |
| Routing | React Router (HashRouter, for GitHub Pages) |
| Charts | Recharts |
| Storage | Browser localStorage with seed data |
| Testing | Vitest and Playwright |
| Deploy | GitHub Actions → GitHub Pages |

All data access goes through a repository layer (`src/data/`), so a real backend can replace browser storage when the project scales without changing the screens.

---

## Getting Started

```bash
git clone https://github.com/<your-github-username>/<repo-name>.git
cd <repo-name>
npm install
npm run dev        # start the local dev server
npm test           # run unit tests
npm run build      # build static files into dist/
```

Every push to `main` builds and deploys the app to GitHub Pages automatically.

## Project Structure

```
src/
  screens/      Onboarding, FirstHabit, Today, WeeklySummary
  components/   HabitCard, DayCircles, StatCard, TrendChart, Sidebar
  domain/       Streaks, next-habit rules, weekly summary, workout rescheduling
  data/         Repository interfaces, localStorage implementation, seed data
tests/          Unit and end-to-end tests
```

---

## Roadmap

- [x] User interviews, scenarios and design mockups
- [x] Product Requirements Document approved
- [x] Technical Requirements Document
- [ ] **Phase 1: MVP demo** (this repository)
- [ ] Product Committee review
- [ ] Phase 2: backend, accounts and trainer features
- [ ] Phase 3: native mobile apps and wearable integrations

---

## Disclaimer

Small Steps is a demo for habit building. It does not provide medical advice. Talk to a healthcare professional about your health needs.
