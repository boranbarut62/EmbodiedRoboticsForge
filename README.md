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

All 15 roadmap stages have a lesson with its own interactive lab, from
Foundations and Electronics through Control, Computer Vision, ROS 2,
Simulation, Robot Learning, Embodied AI, and Humanoid Robotics.

The **Projects** section (`src/data/projects.ts`) holds hands-on hardware builds
with parts lists, safety notes, wiring tables, Arduino code, and per-step
checkpoints whose completion is saved:

1. **ESP32 Voltmeter** — ADC vs. multimeter: dividers, noise, calibration error,
   and loading.
2. **Light-Seeking Robot Head** — two LDRs, a servo, and a closed-loop
   controller tuned on real hardware.
