import { Link } from 'react-router-dom';
import { lessons } from '../data/lessons';
import { stages } from '../data/stages';
import { useProgress } from '../lib/progress';
import { nextLesson, overallPercent } from '../lib/derived';
import { ProgressBar } from '../components/ProgressBar';

export function Dashboard() {
  const progress = useProgress();
  const percent = overallPercent(progress);
  const upNext = nextLesson(progress);
  const availableStages = stages.filter((stage) => stage.status === 'available');
  const allDone = progress.completedLessons.length === lessons.length;

  return (
    <div className="page">
      <h1>Dashboard</h1>
      <p className="page-subtitle">Your personal robotics engineering curriculum.</p>

      <section className="card">
        <h2>Overall Progress</h2>
        <ProgressBar percent={percent} />
        <p className="progress-caption">
          {progress.completedLessons.length} of {lessons.length} lessons complete ({percent}%)
        </p>
      </section>

      <section className="card">
        <h2>{allDone ? 'All lessons complete' : 'Continue Learning'}</h2>
        {allDone ? (
          <p>You have completed every available lesson. More stages are coming later.</p>
        ) : (
          <>
            <p className="lesson-preview-title">{upNext.title}</p>
            <p className="stage-blurb">{upNext.objectives[0]}</p>
            <Link className="btn btn-primary" to={`/learn/${upNext.id}`}>
              {progress.completedLessons.length === 0 ? 'Start Learning' : 'Continue'}
            </Link>
          </>
        )}
      </section>

      <section className="card">
        <h2>Active Stages</h2>
        <ul className="plain-list">
          {availableStages.map((stage) => (
            <li key={stage.id}>
              <Link to="/roadmap">{stage.title}</Link> — {stage.domain}
            </li>
          ))}
        </ul>
        <Link className="btn btn-ghost" to="/roadmap">
          View Full Roadmap
        </Link>
      </section>
    </div>
  );
}
