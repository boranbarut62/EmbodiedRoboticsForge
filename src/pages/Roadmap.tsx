import { stages } from '../data/stages';
import { StageCard } from '../components/StageCard';

export function Roadmap() {
  return (
    <div className="page">
      <h1>Roadmap</h1>
      <p className="page-subtitle">
        The full engineering path toward humanoid robotics and embodied AI. Subjects branch and reconnect rather than
        forming one strict sequence — stages marked "Coming Later" will be filled in as the curriculum grows.
      </p>
      <div className="roadmap-flow">
        {stages.map((stage, i) => (
          <div className="roadmap-flow-item" key={stage.id}>
            <StageCard stage={stage} />
            {i < stages.length - 1 && <div className="roadmap-connector" aria-hidden="true" />}
          </div>
        ))}
      </div>
    </div>
  );
}
