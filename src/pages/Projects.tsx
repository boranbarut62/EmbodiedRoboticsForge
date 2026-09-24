import { Link, Navigate, useParams } from 'react-router-dom';
import { projects } from '../data/projects';
import type { Project, ProjectPart } from '../data/types';
import { lessonById } from '../lib/derived';
import { toggleProjectStep, useProgress, type ProgressState } from '../lib/progress';
import { ProgressBar } from '../components/ProgressBar';

const SOURCE_LABEL: Record<ProjectPart['source'], { text: string; badge: string }> = {
  owned: { text: 'You have it', badge: 'badge-completed' },
  kit: { text: 'Check your kit', badge: 'badge-in-progress' },
  extra: { text: 'Not on your list', badge: 'badge-incorrect' },
};

function stepsDone(project: Project, progress: ProgressState) {
  return project.steps.filter((s) => progress.projectSteps[`${project.id}:${s.id}`]).length;
}

export function ProjectsIndex() {
  const progress = useProgress();
  return (
    <div className="page">
      <h1>Projects</h1>
      <p className="page-subtitle">
        Real builds with the parts you own. Each project turns lessons into hardware: you predict, build, measure, and
        explain. Parts marked "Check your kit" are included in most Arduino starter kits — confirm yours has them
        before starting.
      </p>
      {projects.map((project) => {
        const done = stepsDone(project, progress);
        return (
          <section className="card" key={project.id}>
            <h2>
              <Link to={`/projects/${project.id}`}>{project.title}</Link>
            </h2>
            <p className="stage-domain">
              {project.difficulty} · {project.duration}
            </p>
            <p>{project.summary}</p>
            <ProgressBar percent={(done / project.steps.length) * 100} />
            <p className="progress-caption">
              {done} of {project.steps.length} steps done
            </p>
            <Link className="btn btn-primary" to={`/projects/${project.id}`}>
              {done > 0 ? 'Continue' : 'Open Project'}
            </Link>
          </section>
        );
      })}
    </div>
  );
}

export function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const progress = useProgress();
  const project = projects.find((p) => p.id === projectId);
  if (!project) return <Navigate to="/projects" replace />;

  const done = stepsDone(project, progress);
  const listSection = (heading: string, items: string[]) => (
    <section className="card">
      <h2>{heading}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );

  return (
    <div className="page">
      <p className="lesson-stage-label">
        <Link to="/projects">Projects</Link>
      </p>
      <h1>{project.title}</h1>
      <p className="page-subtitle">
        {project.difficulty} · {project.duration}
      </p>

      <section className="card lesson-hook">
        <p className="section-eyebrow">What You'll Build</p>
        <p>{project.summary}</p>
      </section>

      <section className="card">
        <h2>Before You Start</h2>
        <p>Lessons this project builds on:</p>
        <ul className="plain-list">
          {project.prerequisites.map((id) => {
            const lesson = lessonById(id);
            if (!lesson) return null;
            const complete = progress.completedLessons.includes(id);
            return (
              <li key={id}>
                <span className={'badge ' + (complete ? 'badge-completed' : 'badge-later')}>{complete ? '✓ Done' : 'Not yet'}</span>{' '}
                <Link to={`/learn/${id}`}>{lesson.title}</Link>
              </li>
            );
          })}
        </ul>
      </section>

      {listSection('What You Will Learn', project.goals)}

      <section className="card">
        <h2>Parts</h2>
        <table className="progress-table">
          <thead>
            <tr>
              <th>Part</th>
              <th>Qty</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {project.parts.map((part) => (
              <tr key={part.name}>
                <td>
                  {part.name}
                  {part.note && <div className="exercise-history">{part.note}</div>}
                </td>
                <td>{part.quantity}</td>
                <td>
                  <span className={'badge ' + SOURCE_LABEL[part.source].badge}>{SOURCE_LABEL[part.source].text}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="progress-caption" style={{ marginTop: 10 }}>
          Tools: {project.tools.join(' · ')}
        </p>
      </section>

      <section className="card safety-card">
        <p className="section-eyebrow">Safety — read before building</p>
        <ul>
          {project.safety.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>Build Steps</h2>
        <ProgressBar percent={(done / project.steps.length) * 100} />
        <p className="progress-caption">
          {done} of {project.steps.length} steps done — your checkmarks are saved.
        </p>
      </section>

      {project.steps.map((step, i) => {
        const checked = !!progress.projectSteps[`${project.id}:${step.id}`];
        return (
          <section className={'card' + (checked ? ' step-done' : '')} key={step.id}>
            <p className="section-eyebrow">Step {i + 1}</p>
            <h2>{step.title}</h2>
            {step.body.map((paragraph, k) => (
              <p key={k}>{paragraph}</p>
            ))}
            {step.wiring && (
              <table className="progress-table" style={{ margin: '8px 0 12px' }}>
                <thead>
                  <tr>
                    <th>From</th>
                    <th>To</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {step.wiring.map((w) => (
                    <tr key={w.from + w.to}>
                      <td>{w.from}</td>
                      <td>{w.to}</td>
                      <td>{w.note ?? ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {step.code && (
              <>
                <p className="section-eyebrow" style={{ marginTop: 8 }}>
                  Code · {step.code.language}
                </p>
                <pre className="code-block">
                  <code>{step.code.code}</code>
                </pre>
              </>
            )}
            {step.checkpoint && (
              <div className="checkpoint">
                <strong>Checkpoint:</strong> {step.checkpoint}
              </div>
            )}
            <label className="step-check">
              <input type="checkbox" checked={checked} onChange={() => toggleProjectStep(project.id, step.id)} />
              I've done this step and the checkpoint passed
            </label>
          </section>
        );
      })}

      {listSection('Experiments', project.experiments)}
      {listSection('Reflection Questions', project.reflection)}
      {listSection('Going Further', project.extensions)}
    </div>
  );
}
