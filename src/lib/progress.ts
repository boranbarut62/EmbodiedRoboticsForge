import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'erf-progress-v1';

export interface ExerciseResult {
  attempted: boolean;
  correct: boolean;
}

export interface ProgressState {
  completedLessons: string[];
  exerciseResults: Record<string, ExerciseResult>;
  /** Keyed `${projectId}:${stepId}`. */
  projectSteps: Record<string, boolean>;
}

const defaultState: ProgressState = {
  completedLessons: [],
  exerciseResults: {},
  projectSteps: {},
};

function readFromStorage(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    return {
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
      exerciseResults:
        parsed.exerciseResults && typeof parsed.exerciseResults === 'object' ? parsed.exerciseResults : {},
      projectSteps: parsed.projectSteps && typeof parsed.projectSteps === 'object' ? parsed.projectSteps : {},
    };
  } catch {
    return defaultState;
  }
}

let state: ProgressState = readFromStorage();
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage may be unavailable (private browsing, quota) — progress just
    // won't persist across a restart in that case.
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

export function markLessonComplete(lessonId: string) {
  if (state.completedLessons.includes(lessonId)) return;
  state = { ...state, completedLessons: [...state.completedLessons, lessonId] };
  persist();
  emit();
}

export function recordExerciseAttempt(exerciseId: string, correct: boolean) {
  state = {
    ...state,
    exerciseResults: { ...state.exerciseResults, [exerciseId]: { attempted: true, correct } },
  };
  persist();
  emit();
}

export function toggleProjectStep(projectId: string, stepId: string) {
  const key = `${projectId}:${stepId}`;
  state = { ...state, projectSteps: { ...state.projectSteps, [key]: !state.projectSteps[key] } };
  persist();
  emit();
}

export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, getSnapshot);
}
