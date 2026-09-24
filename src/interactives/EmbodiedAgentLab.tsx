import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { H, RANGE, W, WALL, createWorld, insideWall, stepWorld, type Vec } from './embodiedWorld';

const DECISION_TEXT = {
  approach: 'APPROACH the believed position',
  scan: 'SEARCH: turn in place to look around (active perception)',
  relocate: 'SEARCH: move to a new vantage point (active perception)',
};

export function EmbodiedAgentLab() {
  const [fov, setFov] = useState(70);
  const [noise, setNoise] = useState(8);
  const [gain, setGain] = useState(0.4);
  const [memory, setMemory] = useState(true);
  const [running, setRunning] = useState(true);
  const [, setFrame] = useState(0);

  const params = useRef({ fov, noise, gain, memory });
  params.current = { fov, noise, gain, memory };
  const worldRef = useRef(createWorld());
  const dragging = useRef(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const frame = useRef<number>(0);
  const lastTime = useRef<number | null>(null);

  useEffect(() => {
    if (!running) return;
    function tick(now: number) {
      if (lastTime.current === null) lastTime.current = now;
      const dt = Math.min(0.05, (now - lastTime.current) / 1000);
      lastTime.current = now;
      stepWorld(worldRef.current, params.current, dt);
      setFrame((f) => f + 1);
      frame.current = requestAnimationFrame(tick);
    }
    frame.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame.current);
      lastTime.current = null;
    };
  }, [running]);

  function dragTo(e: ReactPointerEvent) {
    if (!dragging.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const p = { x: ((e.clientX - rect.left) / rect.width) * W, y: ((e.clientY - rect.top) / rect.height) * H };
    if (p.x > 10 && p.x < W - 10 && p.y > 10 && p.y < H - 10 && !insideWall(p, 8)) worldRef.current.target = p;
  }

  const w = worldRef.current;
  const { agent, target } = w;
  const half = ((fov / 2) * Math.PI) / 180;
  const cone = [
    `M ${agent.x} ${agent.y}`,
    `L ${agent.x + RANGE * Math.cos(agent.heading - half)} ${agent.y + RANGE * Math.sin(agent.heading - half)}`,
    `A ${RANGE} ${RANGE} 0 0 1 ${agent.x + RANGE * Math.cos(agent.heading + half)} ${agent.y + RANGE * Math.sin(agent.heading + half)}`,
    'Z',
  ].join(' ');
  const fmt = (v: Vec) => `(${v.x.toFixed(0)}, ${v.y.toFixed(0)})`;
  const sinceSeen = w.lastSeen === null ? null : w.time - w.lastSeen;
  const aim = w.via ?? (w.decision === 'relocate' ? w.search.goal : w.belief);

  const stages = [
    { title: '1 · Sense', text: w.visible ? 'Ball is in the camera view' : 'Ball not in view', active: w.visible },
    { title: '2 · Perceive', text: w.detection ? `Detected at ${fmt(w.detection)} (noisy)` : 'No detection', active: !!w.detection },
    {
      title: '3 · World model',
      text: w.belief
        ? `Believes ball at ${fmt(w.belief)}${sinceSeen !== null && sinceSeen > 0.2 ? `, last seen ${sinceSeen.toFixed(1)} s ago` : ''}`
        : 'No belief: ball location unknown',
      active: !!w.belief,
    },
    { title: '4 · Decide', text: DECISION_TEXT[w.decision] + (w.via ? ', routing around the wall' : ''), active: true },
    { title: '5 · Control', text: `Turn ${w.turn.toFixed(2)} rad/s, speed ${w.speed.toFixed(0)} px/s`, active: true },
    { title: '6 · Act', text: `Pose ${fmt(agent)}, heading ${((agent.heading * 180) / Math.PI).toFixed(0)}°`, active: true },
  ];

  return (
    <div className="interactive-body">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="interactive-svg"
        style={{ maxWidth: 560 }}
        onPointerMove={dragTo}
        onPointerUp={() => (dragging.current = false)}
      >
        <rect x={0} y={0} width={W} height={H} fill="none" stroke="var(--border)" strokeWidth={2} />
        <path d={cone} fill="#2f6fed" opacity={0.08} />
        <rect x={WALL.x} y={WALL.y} width={WALL.w} height={WALL.h} fill="var(--text-dim)" opacity={0.6} />
        {w.belief && <circle cx={w.belief.x} cy={w.belief.y} r={13} fill="none" stroke="#2f6fed" strokeWidth={2} strokeDasharray="4 3" />}
        {aim && <line x1={agent.x} y1={agent.y} x2={aim.x} y2={aim.y} stroke="#2f6fed" strokeWidth={1} strokeDasharray="2 4" />}
        {w.via && <circle cx={w.via.x} cy={w.via.y} r={4} fill="#2f6fed" />}
        {w.detection && <circle cx={w.detection.x} cy={w.detection.y} r={3} fill="#2f6fed" />}
        <circle
          cx={target.x}
          cy={target.y}
          r={10}
          fill="#e8872b"
          style={{ cursor: 'grab' }}
          onPointerDown={(e) => {
            dragging.current = true;
            (e.target as Element).setPointerCapture(e.pointerId);
          }}
        />
        <circle cx={agent.x} cy={agent.y} r={11} fill="var(--surface)" stroke="var(--text-h)" strokeWidth={2} />
        <line x1={agent.x} y1={agent.y} x2={agent.x + 14 * Math.cos(agent.heading)} y2={agent.y + 14 * Math.sin(agent.heading)} stroke="var(--text-h)" strokeWidth={2.5} />
      </svg>

      <div className="pipeline">
        {stages.map((s) => (
          <div key={s.title} className={'pipeline-stage' + (s.active ? ' pipeline-stage-active' : '')}>
            <div className="pipeline-stage-title">{s.title}</div>
            <div>{s.text}</div>
          </div>
        ))}
      </div>

      <div className="interactive-controls">
        <button type="button" className={'btn btn-toggle' + (memory ? ' btn-toggle-active' : '')} onClick={() => setMemory((m) => !m)}>
          World-model memory: {memory ? 'ON' : 'OFF'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => setRunning((r) => !r)}>
          {running ? 'Pause' : 'Resume'}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            worldRef.current = createWorld();
            setFrame((f) => f + 1);
          }}
        >
          Reset
        </button>
      </div>

      <div className="interactive-controls-grid">
        <label>
          Camera field of view: {fov}°
          <input type="range" min={30} max={180} value={fov} onChange={(e) => setFov(Number(e.target.value))} />
        </label>
        <label>
          Detection noise σ: {noise} px
          <input type="range" min={0} max={30} value={noise} onChange={(e) => setNoise(Number(e.target.value))} />
        </label>
        <label>
          World-model update gain K: {gain.toFixed(2)}
          <input type="range" min={0.05} max={1} step={0.05} value={gain} onChange={(e) => setGain(Number(e.target.value))} />
        </label>
      </div>

      <div className="interactive-readout">
        <p>
          Balls reached: <strong>{w.reached}</strong> in {w.time.toFixed(0)} s
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>
          Orange = the real ball (drag it). Small blue dot = the latest noisy detection. Dashed blue ring = where the
          agent believes the ball is. Shaded wedge = the camera's field of view.
        </p>
      </div>
    </div>
  );
}
