# Embodied Robotics Forge

A personal, local-first learning app for progressively building the engineering
background needed for humanoid robotics, embodied AI, and intelligent physical
systems — starting from a software background with little formal robotics,
electronics, or mechanical engineering knowledge.

## Running it

This machine's default `node` on PATH is an old v16 install; use the Homebrew
Node 22 install explicitly:

```bash
export PATH="/usr/local/Cellar/node/22.2.0/bin:/usr/local/Cellar/node/22.2.0/libexec/bin:$PATH"
npm install
npm run dev
```

Then open http://localhost:5173.

## Architecture

- **Vite + React + TypeScript**, client-side routing via `react-router-dom`.
- **No backend, no database.** Curriculum content (`src/data/`) is static
  typed data. Learner progress (completed lessons, exercise results) is
  persisted to `localStorage` (`src/lib/progress.ts`) so it survives restarts.
- **Pages** (`src/pages/`): Dashboard, Roadmap, Learn, Practice, Progress.
- **Curriculum** is represented as data, not hardcoded pages, so new stages
  and lessons can be added by editing `src/data/stages.ts` and
  `src/data/lessons.ts` without touching UI code.

## Current scope (MVP)

5 lessons across Foundations, Electronics, and Robotics Fundamentals. The
Roadmap shows all 15 planned stages of the curriculum; stages without lessons
yet are marked "Coming Later". See the project's build notes for the full
long-term curriculum this is designed to grow into (ROS 2, simulation,
computer vision, robot learning, embodied AI, humanoid robotics, etc.).
