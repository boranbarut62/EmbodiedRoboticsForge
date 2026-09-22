import type { LessonSection, Exercise } from '../data/types';
import { interactives } from '../interactives/registry';
import { ExerciseCard } from './ExerciseCard';

const kindLabel: Record<string, string> = {
  intuition: 'Intuition',
  math: 'The Mathematics',
  derivation: 'Derivation',
  engineering: 'Engineering Application',
  robotics: 'Robotics Connection',
};

export function LessonSectionView({
  section,
  exerciseById,
  exerciseIndex,
}: {
  section: LessonSection;
  exerciseById: Map<string, Exercise>;
  exerciseIndex: Map<string, number>;
}) {
  switch (section.type) {
    case 'text':
      return (
        <section className="card">
          <p className="section-eyebrow">{kindLabel[section.kind] ?? section.kind}</p>
          <h2>{section.heading}</h2>
          {section.body.map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </section>
      );

    case 'key-concepts':
      return (
        <section className="card">
          <h2>{section.heading}</h2>
          <ul>
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      );

    case 'worked-example':
      return (
        <section className="card">
          <h2>{section.heading}</h2>
          <p>{section.body}</p>
        </section>
      );

    case 'interactive': {
      const Component = interactives[section.component];
      return (
        <section className="card">
          <p className="section-eyebrow">Interactive</p>
          <h2>{section.heading}</h2>
          {Component ? <Component /> : <p>Unknown interactive: {section.component}</p>}
          <p className="interactive-caption">{section.caption}</p>
        </section>
      );
    }

    case 'exercise': {
      const exercise = exerciseById.get(section.exerciseId);
      if (!exercise) return null;
      return (
        <section className="card">
          <p className="section-eyebrow">Predict First</p>
          <ExerciseCard exercise={exercise} index={exerciseIndex.get(exercise.id) ?? 0} />
        </section>
      );
    }

    default:
      return null;
  }
}
