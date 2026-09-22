import { Link } from 'react-router-dom';
import type { Stage } from '../data/types';
import { lessonsForStage, stageProgress } from '../lib/derived';
import { useProgress } from '../lib/progress';

export function StageCard({ stage }: { stage: Stage }) {
  const progress = useProgress();
  const stageLessons = lessonsForStage(stage.id);

  if (stage.status === 'coming-later') {
    return (
      <div className="stage-card stage-card-locked">
        <div className="stage-card-header">
          <span className="stage-title">{stage.title}</span>
          <span className="badge badge-later">Coming Later</span>
        </div>
        <p className="stage-domain">{stage.domain}</p>
        <p className="stage-blurb">{stage.blurb}</p>
      </div>
    );
  }

  const { done, total } = stageProgress(stage.id, progress);
  const status = done === total && total > 0 ? 'completed' : done > 0 ? 'in-progress' : 'available';
  const firstLesson = stageLessons[0];

  return (
    <div className={`stage-card stage-card-${status}`}>
      <div className="stage-card-header">
        <span className="stage-title">{stage.title}</span>
        <span className={`badge badge-${status}`}>
          {status === 'completed' ? 'Completed' : status === 'in-progress' ? 'In Progress' : 'Available'}
        </span>
      </div>
      <p className="stage-domain">{stage.domain}</p>
      <p className="stage-blurb">{stage.blurb}</p>
      <p className="stage-lesson-count">
        {done}/{total} lessons complete
      </p>
      {firstLesson && (
        <Link className="btn btn-primary" to={`/learn/${firstLesson.id}`}>
          {done > 0 ? 'Continue' : 'Start'}
        </Link>
      )}
    </div>
  );
}
