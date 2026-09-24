# Embodied Robotics Forge

A personal, local-first learning app for progressively building the engineering
background needed for humanoid robotics, embodied AI, and intelligent physical
systems — starting from a software background with little formal robotics,
electronics, or mechanical engineering knowledge.

Lessons are built to be seen and manipulated, not just read: each one walks
through intuition → an interactive lab → a prediction → the mathematics and
its derivation → worked examples → engineering and robotics connections →
practice and a challenge.

## Running it

Requires Node 18 or newer.

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Architecture

- **Vite + React + TypeScript**, client-side routing via `react-router-dom`.
- **No backend, no database.** Learner progress is persisted to
  `localStorage` (`src/lib/progress.ts`).
- **Curriculum as data** (`src/data/`): `stages.ts` defines the roadmap;
  `lessons.ts` defines each lesson as an ordered list of sections (text,
  interactive, code, worked example, inline exercise) plus an exercise bank
  of any length. `types.ts` holds the schema.
- **Interactive labs** (`src/interactives/`): lightweight SVG/canvas
  components with no simulation dependencies, registered by name in
  `registry.tsx` and referenced from lesson data.

## Current scope

The Roadmap shows all 15 planned stages. Stages with lessons so far include
Foundations, Electronics, Embedded Systems, Mechanical Engineering, Robotics
Fundamentals, Control Systems, Sensors & Perception, Computer Vision, Machine
Learning, ROS 2, Simulation, Autonomous Robotics, and Robot Learning; the rest
are marked "Coming Later".
