export type StageStatus = 'available' | 'coming-later';

export interface Stage {
  id: string;
  title: string;
  domain: string;
  status: StageStatus;
  blurb: string;
}

interface ExerciseBase {
  id: string;
  question: string;
  explanation: string;
  /** Omitted = ordinary practice. 'challenge' renders in a separate, later group. */
  role?: 'challenge';
}

export interface MultipleChoiceExercise extends ExerciseBase {
  kind: 'multiple-choice';
  choices: string[];
  correctIndex: number;
}

export interface NumericExercise extends ExerciseBase {
  kind: 'numeric';
  unit?: string;
  answer: number;
  tolerance: number;
}

export type Exercise = MultipleChoiceExercise | NumericExercise;

interface SectionBase {
  heading: string;
}

/** A block of narrative prose. `kind` is just a label for the CSS/eyebrow, not behavior. */
export interface TextSection extends SectionBase {
  type: 'text';
  kind: 'intuition' | 'math' | 'derivation' | 'engineering' | 'robotics';
  body: string[];
}

export interface KeyConceptsSection extends SectionBase {
  type: 'key-concepts';
  items: string[];
}

export interface WorkedExampleSection extends SectionBase {
  type: 'worked-example';
  body: string;
}

/** Renders a named component from the interactives registry. */
export interface InteractiveSection extends SectionBase {
  type: 'interactive';
  component: string;
  caption: string;
}

/** Embeds one exercise from the lesson's exercise bank at this point in the narrative
 *  (used for "predict before you see it" moments). The exercise still counts toward
 *  the exercise bank and is not repeated in the trailing Practice/Challenge groups. */
export interface ExerciseRefSection extends SectionBase {
  type: 'exercise';
  exerciseId: string;
}

export type LessonSection =
  | TextSection
  | KeyConceptsSection
  | WorkedExampleSection
  | InteractiveSection
  | ExerciseRefSection;

export interface Lesson {
  id: string;
  stageId: string;
  title: string;
  /** Why this concept matters, shown before anything else. */
  hook: string;
  objectives: string[];
  sections: LessonSection[];
  /** The full exercise bank for this lesson — any length. Sections may reference
   *  a subset inline; the rest render as Guided Practice / Challenge at the end. */
  exercises: Exercise[];
}
