import { Navigate, Link, useParams } from 'react-router-dom';
import { lessons } from '../data/lessons';
import { lessonById, stageById } from '../lib/derived';
import { markLessonComplete, useProgress } from '../lib/progress';
import { ExerciseCard } from '../components/ExerciseCard';
import { LessonSectionView } from '../components/LessonSectionView';

export function Learn() {
  const { lessonId } = useParams<{ lessonId?: string }>();
  const progress = useProgress();

  if (!lessonId) {
    return <Navigate to={`/learn/${lessons[0].id}`} replace />;
  }

  const lesson = lessonById(lessonId);
  if (!lesson) {
    return <Navigate to={`/learn/${lessons[0].id}`} replace />;
  }

  const isComplete = progress.completedLessons.includes(lesson.id);
  const stage = stageById(lesson.stageId);
  const currentIndex = lessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = lessons[currentIndex - 1];
  const nextLessonInList = lessons[currentIndex + 1];

  const exerciseById = new Map(lesson.exercises.map((ex) => [ex.id, ex]));
  const exerciseIndex = new Map(lesson.exercises.map((ex, i) => [ex.id, i]));
  const inlineIds = new Set(
    lesson.sections.filter((s) => s.type === 'exercise').map((s) => (s.type === 'exercise' ? s.exerciseId : ''))
  );
  const trailingExercises = lesson.exercises.filter((ex) => !inlineIds.has(ex.id));
  const guidedPractice = trailingExercises.filter((ex) => ex.role !== 'challenge');
  const challenges = trailingExercises.filter((ex) => ex.role === 'challenge');

  return (
    <div className="page page-learn">
      <aside className="lesson-sidebar">
        <h2 className="lesson-sidebar-title">Lessons</h2>
        <ul className="lesson-list">
          {lessons.map((l) => {
            const done = progress.completedLessons.includes(l.id);
            return (
              <li key={l.id}>
                <Link
                  to={`/learn/${l.id}`}
                  className={'lesson-list-link' + (l.id === lesson.id ? ' lesson-list-link-active' : '')}
                >
                  <span className={'lesson-check' + (done ? ' lesson-check-done' : '')}>{done ? '✓' : ''}</span>
                  {l.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </aside>

      <div className="lesson-content">
        {stage && <p className="lesson-stage-label">{stage.title}</p>}
        <h1>{lesson.title}</h1>

        <section className="card lesson-hook">
          <p className="section-eyebrow">Why This Matters</p>
          <p>{lesson.hook}</p>
        </section>

        <section className="card">
          <h2>Learning Objectives</h2>
          <ul>
            {lesson.objectives.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
        </section>

        {lesson.sections.map((section, i) => (
          <LessonSectionView key={i} section={section} exerciseById={exerciseById} exerciseIndex={exerciseIndex} />
        ))}

        {guidedPractice.length > 0 && (
          <section className="card">
            <h2>Guided Practice</h2>
            {guidedPractice.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} index={exerciseIndex.get(exercise.id) ?? 0} />
            ))}
          </section>
        )}

        {challenges.length > 0 && (
          <section className="card">
            <h2>Challenge</h2>
            {challenges.map((exercise) => (
              <ExerciseCard key={exercise.id} exercise={exercise} index={exerciseIndex.get(exercise.id) ?? 0} />
            ))}
          </section>
        )}

        <section className="card lesson-complete-card">
          {isComplete ? (
            <p className="feedback-correct">Lesson complete.</p>
          ) : (
            <button type="button" className="btn btn-primary" onClick={() => markLessonComplete(lesson.id)}>
              Mark Lesson Complete
            </button>
          )}
        </section>

        <nav className="lesson-nav">
          {prevLesson ? (
            <Link className="btn btn-ghost" to={`/learn/${prevLesson.id}`}>
              ← {prevLesson.title}
            </Link>
          ) : (
            <span />
          )}
          {nextLessonInList && (
            <Link className="btn btn-ghost" to={`/learn/${nextLessonInList.id}`}>
              {nextLessonInList.title} →
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
}
