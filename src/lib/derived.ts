import { lessons } from '../data/lessons';
import { stages } from '../data/stages';
import type { ProgressState } from './progress';

export function overallPercent(progress: ProgressState): number {
  if (lessons.length === 0) return 0;
  return Math.round((progress.completedLessons.length / lessons.length) * 100);
}

export function nextLesson(progress: ProgressState) {
  return lessons.find((lesson) => !progress.completedLessons.includes(lesson.id)) ?? lessons[0];
}

export function lessonsForStage(stageId: string) {
  return lessons.filter((lesson) => lesson.stageId === stageId);
}

export function stageProgress(stageId: string, progress: ProgressState): { done: number; total: number } {
  const stageLessons = lessonsForStage(stageId);
  const done = stageLessons.filter((lesson) => progress.completedLessons.includes(lesson.id)).length;
  return { done, total: stageLessons.length };
}

export function stageById(stageId: string) {
  return stages.find((stage) => stage.id === stageId);
}

export function lessonById(lessonId: string) {
  return lessons.find((lesson) => lesson.id === lessonId);
}
