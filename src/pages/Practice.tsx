import { Link } from 'react-router-dom';
import { lessons } from '../data/lessons';
import { ExerciseCard } from '../components/ExerciseCard';

export function Practice() {
  return (
    <div className="page">
      <h1>Practice</h1>
      <p className="page-subtitle">Every exercise from every lesson, in one place — revisit anything, anytime.</p>

      {lessons.map((lesson) => (
        <section className="card" key={lesson.id}>
          <h2>
            <Link to={`/learn/${lesson.id}`}>{lesson.title}</Link>
          </h2>
          {lesson.exercises.map((exercise, i) => (
            <ExerciseCard key={exercise.id} exercise={exercise} index={i} />
          ))}
        </section>
      ))}
    </div>
  );
}
