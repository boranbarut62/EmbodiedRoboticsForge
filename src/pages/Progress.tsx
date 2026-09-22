import { Link } from 'react-router-dom';
import { lessons } from '../data/lessons';
import { useProgress } from '../lib/progress';
import { overallPercent } from '../lib/derived';
import { ProgressBar } from '../components/ProgressBar';

export function Progress() {
  const progress = useProgress();
  const percent = overallPercent(progress);

  const allExercises = lessons.flatMap((lesson) => lesson.exercises.map((ex) => ({ ...ex, lessonTitle: lesson.title })));
  const attempted = allExercises.filter((ex) => progress.exerciseResults[ex.id]?.attempted);
  const correctCount = attempted.filter((ex) => progress.exerciseResults[ex.id]?.correct).length;

  return (
    <div className="page">
      <h1>Progress</h1>

      <section className="card">
        <h2>Lessons</h2>
        <ProgressBar percent={percent} />
        <p className="progress-caption">
          {progress.completedLessons.length} of {lessons.length} lessons complete ({percent}%)
        </p>
      </section>

      <section className="card">
        <h2>Exercises</h2>
        <p className="progress-caption">
          {attempted.length} of {allExercises.length} attempted · {correctCount} correct
        </p>
        <table className="progress-table">
          <thead>
            <tr>
              <th>Lesson</th>
              <th>Exercise</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {allExercises.map((exercise) => {
              const result = progress.exerciseResults[exercise.id];
              return (
                <tr key={exercise.id}>
                  <td>{exercise.lessonTitle}</td>
                  <td>{exercise.question}</td>
                  <td>
                    {!result?.attempted ? (
                      <span className="badge badge-later">Not attempted</span>
                    ) : result.correct ? (
                      <span className="badge badge-completed">Correct</span>
                    ) : (
                      <span className="badge badge-incorrect">Incorrect</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="card">
        <h2>Completed Lessons</h2>
        {progress.completedLessons.length === 0 ? (
          <p>No lessons completed yet.</p>
        ) : (
          <ul className="plain-list">
            {lessons
              .filter((lesson) => progress.completedLessons.includes(lesson.id))
              .map((lesson) => (
                <li key={lesson.id}>
                  <Link to={`/learn/${lesson.id}`}>{lesson.title}</Link>
                </li>
              ))}
          </ul>
        )}
      </section>
    </div>
  );
}
