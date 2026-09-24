import { useEffect, useRef, useState } from 'react';

const G = 9.81;
const L = 1;
const PIVOT_X = 130;
const PIVOT_Y = 30;
const ROD_PX = 100;
const HISTORY = 200;
const MAX_STEPS_PER_FRAME = 400;

type Method = 'explicit' | 'semi' | 'rk4';

const METHODS: { id: Method; label: string; color: string }[] = [
  { id: 'explicit', label: 'Explicit Euler', color: '#d1453d' },
  { id: 'semi', label: 'Semi-implicit Euler', color: '#2f6fed' },
  { id: 'rk4', label: 'RK4', color: '#1a9d5c' },
];

interface State {
  theta: number;
  omega: number;
}

const accel = (theta: number) => -(G / L) * Math.sin(theta);

function step(method: Method, s: State, dt: number): State {
  if (method === 'explicit') {
    return { theta: s.theta + s.omega * dt, omega: s.omega + accel(s.theta) * dt };
  }
  if (method === 'semi') {
    const omega = s.omega + accel(s.theta) * dt;
    return { theta: s.theta + omega * dt, omega };
  }
  const k1t = s.omega;
  const k1w = accel(s.theta);
  const k2t = s.omega + (k1w * dt) / 2;
  const k2w = accel(s.theta + (k1t * dt) / 2);
  const k3t = s.omega + (k2w * dt) / 2;
  const k3w = accel(s.theta + (k2t * dt) / 2);
  const k4t = s.omega + k3w * dt;
  const k4w = accel(s.theta + k3t * dt);
  return {
    theta: s.theta + (dt / 6) * (k1t + 2 * k2t + 2 * k3t + k4t),
    omega: s.omega + (dt / 6) * (k1w + 2 * k2w + 2 * k3w + k4w),
  };
}

const energy = (s: State) => 0.5 * L * L * s.omega * s.omega + G * L * (1 - Math.cos(s.theta));

function initialStates(angleDeg: number): Record<Method, State> {
  const s = { theta: (angleDeg * Math.PI) / 180, omega: 0 };
  return { explicit: { ...s }, semi: { ...s }, rk4: { ...s } };
}

export function PendulumSimLab() {
  const [dt, setDt] = useState(0.03);
  const [angle, setAngle] = useState(60);
  const [running, setRunning] = useState(true);
  const [, setFrame] = useState(0);

  const statesRef = useRef(initialStates(angle));
  const e0Ref = useRef(energy(statesRef.current.rk4));
  const historyRef = useRef<Record<Method, number[]>>({ explicit: [], semi: [], rk4: [] });
  const simTimeRef = useRef(0);
  const accRef = useRef(0);
  const dtRef = useRef(dt);
  dtRef.current = dt;
  const frame = useRef<number>(0);
  const lastTime = useRef<number | null>(null);

  function reset(nextAngle = angle) {
    statesRef.current = initialStates(nextAngle);
    e0Ref.current = energy(statesRef.current.rk4);
    historyRef.current = { explicit: [], semi: [], rk4: [] };
    simTimeRef.current = 0;
    accRef.current = 0;
    setFrame((f) => f + 1);
  }

  useEffect(() => {
    if (!running) return;
    function tick(now: number) {
      if (lastTime.current === null) lastTime.current = now;
      accRef.current += Math.min(0.1, (now - lastTime.current) / 1000);
      lastTime.current = now;

      // Fixed-timestep accumulator: the simulation always advances in exact
      // steps of dt, independent of the browser's frame rate.
      let steps = 0;
      while (accRef.current >= dtRef.current && steps < MAX_STEPS_PER_FRAME) {
        for (const m of METHODS) statesRef.current[m.id] = step(m.id, statesRef.current[m.id], dtRef.current);
        accRef.current -= dtRef.current;
        simTimeRef.current += dtRef.current;
        steps++;
      }

      for (const m of METHODS) {
        const ratio = energy(statesRef.current[m.id]) / e0Ref.current;
        historyRef.current[m.id] = [...historyRef.current[m.id], ratio].slice(-HISTORY);
      }
      setFrame((f) => f + 1);
      frame.current = requestAnimationFrame(tick);
    }
    frame.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame.current);
      lastTime.current = null;
    };
  }, [running]);

  const ratios = METHODS.map((m) => energy(statesRef.current[m.id]) / e0Ref.current);

  return (
    <div className="interactive-body">
      <div className="interactive-body" style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <svg viewBox="0 0 260 150" className="interactive-svg" style={{ maxWidth: 260, flex: '1 1 200px' }}>
          <circle cx={PIVOT_X} cy={PIVOT_Y} r={4} fill="var(--text-h)" />
          {METHODS.map((m) => {
            const s = statesRef.current[m.id];
            const x = PIVOT_X + ROD_PX * Math.sin(s.theta);
            const y = PIVOT_Y + ROD_PX * Math.cos(s.theta);
            return (
              <g key={m.id} opacity={0.85}>
                <line x1={PIVOT_X} y1={PIVOT_Y} x2={x} y2={y} stroke={m.color} strokeWidth={2} />
                <circle cx={x} cy={y} r={9} fill={m.color} />
              </g>
            );
          })}
        </svg>

        <svg viewBox="0 0 300 150" className="interactive-svg" style={{ maxWidth: 320, flex: '1 1 240px' }}>
          {[0.5, 1, 1.5].map((v) => (
            <g key={v}>
              <line x1={0} y1={150 - v * 75} x2={300} y2={150 - v * 75} stroke="var(--border)" strokeDasharray={v === 1 ? undefined : '3 3'} />
              <text x={4} y={150 - v * 75 - 3} fontSize="9" fill="var(--text-dim)">
                {v * 100}%
              </text>
            </g>
          ))}
          {METHODS.map((m) => (
            <polyline
              key={m.id}
              fill="none"
              stroke={m.color}
              strokeWidth={2}
              points={historyRef.current[m.id]
                .map((r, i) => `${(i / (HISTORY - 1)) * 300},${150 - Math.min(2, Math.max(0, r)) * 75}`)
                .join(' ')}
            />
          ))}
          <text x={296} y={12} fontSize="9" fill="var(--text-dim)" textAnchor="end">
            energy vs. true value
          </text>
          <text x={4} y={10} fontSize="9" fill="var(--text-dim)">
            ≥200% (off the chart)
          </text>
        </svg>
      </div>

      <div className="interactive-controls">
        <button type="button" className="btn btn-primary" onClick={() => setRunning((r) => !r)}>
          {running ? 'Pause' : 'Resume'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => reset()}>
          Reset
        </button>
      </div>

      <div className="interactive-controls-grid">
        <label>
          Time step dt: {dt.toFixed(3)} s ({Math.round(1 / dt)} steps per simulated second)
          <input type="range" min={0.002} max={0.1} step={0.002} value={dt} onChange={(e) => setDt(Number(e.target.value))} />
        </label>
        <label>
          Starting angle: {angle}°
          <input
            type="range"
            min={10}
            max={170}
            value={angle}
            onChange={(e) => {
              const next = Number(e.target.value);
              setAngle(next);
              reset(next);
            }}
          />
        </label>
      </div>

      <div className="interactive-readout">
        {METHODS.map((m, i) => (
          <p key={m.id}>
            <strong style={{ color: m.color }}>{m.label}</strong>: energy {(ratios[i] * 100).toFixed(1)}% of true value
          </p>
        ))}
        <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>
          Simulated time: {simTimeRef.current.toFixed(1)} s. With no friction, a correct simulation keeps energy at
          exactly 100% forever.
        </p>
      </div>
    </div>
  );
}
