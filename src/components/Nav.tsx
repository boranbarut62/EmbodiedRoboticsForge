import { NavLink } from 'react-router-dom';
import { useProgress } from '../lib/progress';
import { overallPercent } from '../lib/derived';

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/roadmap', label: 'Roadmap' },
  { to: '/learn', label: 'Learn' },
  { to: '/practice', label: 'Practice' },
  { to: '/projects', label: 'Projects' },
  { to: '/progress', label: 'Progress' },
];

export function Nav() {
  const progress = useProgress();
  const percent = overallPercent(progress);

  return (
    <header className="nav">
      <div className="nav-brand">Embodied Robotics Forge</div>
      <nav className="nav-links">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => 'nav-link' + (isActive ? ' nav-link-active' : '')}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="nav-progress" title={`${percent}% of lessons complete`}>
        {percent}%
      </div>
    </header>
  );
}
