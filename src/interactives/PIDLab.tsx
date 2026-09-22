import { useEffect, useRef, useState } from 'react';

const DAMPING = 1.2;
const HISTORY_LENGTH = 160;
const GRAPH_W = 360;
const GRAPH_H = 120;

export function PIDLab() {
  const [target, setTarget] = useState(120);
  const [kp, setKp] = useState(2);
  const [renderPosition, setRenderPosition] = useState(0);
  const [history, setHistory] = useState<number[]>([]);

  const positionRef = useRef(0);
  const velocityRef = useRef(0);
  const historyRef = useRef<number[]>([]);
  const frame = useRef<number>(0);
  const lastTime = useRef<number | null>(null);
  const targetRef = useRef(target);
  const kpRef = useRef(kp);

  targetRef.current = target;
  kpRef.current = kp;

  function reset() {
    positionRef.current = 0;
    velocityRef.current = 0;
    historyRef.current = [];
    setRenderPosition(0);
    setHistory([]);
  }

  useEffect(() => {
    reset();
  }, [target, kp]);

  useEffect(() => {
    function tick(t: number) {
      if (lastTime.current === null) lastTime.current = t;
      const dt = Math.min(0.05, (t - lastTime.current) / 1000);
      lastTime.current = t;

      const error = targetRef.current - positionRef.current;
      const accel = kpRef.current * error - DAMPING * velocityRef.current;
      velocityRef.current += accel * dt;
      positionRef.current += velocityRef.current * dt;

      historyRef.current = [...historyRef.current, positionRef.current].slice(-HISTORY_LENGTH);
      setRenderPosition(positionRef.current);
      setHistory(historyRef.current);

      frame.current = requestAnimationFrame(tick);
    }
    frame.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame.current);
      lastTime.current = null;
    };
  }, []);

  const clampedPos = Math.max(-20, Math.min(200, renderPosition));
  const barX = 20 + (clampedPos / 180) * 340;
  const targetX = 20 + (target / 180) * 340;

  const points = history
    .map((p, i) => {
      const x = (i / HISTORY_LENGTH) * GRAPH_W;
      const y = GRAPH_H - (Math.max(-20, Math.min(200, p)) / 200) * GRAPH_H;
      return `${x},${y}`;
    })
    .join(' ');
  const targetY = GRAPH_H - (target / 200) * GRAPH_H;

  let verdict = 'Converging smoothly';
  const overshoot = Math.max(0, ...history) - target;
  if (kp < 0.8) verdict = 'Sluggish — too little Kp reacts too weakly to error';
  else if (overshoot > 25) verdict = 'Oscillating — too much Kp overreacts to error and overshoots';
  else if (overshoot > 5) verdict = 'Slight overshoot, then settling';

  return (
    <div className="interactive-body">
      <svg viewBox="0 0 380 40" className="interactive-svg" style={{ maxWidth: 380 }}>
        <line x1={20} y1={20} x2={360} y2={20} stroke="var(--border)" strokeWidth={6} strokeLinecap="round" />
        <line x1={targetX} y1={6} x2={targetX} y2={34} stroke="#1a9d5c" strokeWidth={3} />
        <circle cx={barX} cy={20} r={9} fill="#2f6fed" />
      </svg>

      <svg viewBox={`0 0 ${GRAPH_W} ${GRAPH_H}`} className="interactive-svg" style={{ maxWidth: GRAPH_W }}>
        <line x1={0} y1={targetY} x2={GRAPH_W} y2={targetY} stroke="#1a9d5c" strokeWidth={1.5} strokeDasharray="5 4" />
        <polyline points={points} fill="none" stroke="#2f6fed" strokeWidth={2.5} />
      </svg>

      <div className="interactive-controls-grid">
        <label>
          Target angle: {target}°
          <input type="range" min={0} max={180} value={target} onChange={(e) => setTarget(Number(e.target.value))} />
        </label>
        <label>
          Kp: {kp.toFixed(1)}
          <input type="range" min={0.1} max={10} step={0.1} value={kp} onChange={(e) => setKp(Number(e.target.value))} />
        </label>
      </div>

      <div className="interactive-readout">
        <p>
          Current angle: {renderPosition.toFixed(1)}° &nbsp;|&nbsp; Target: {target}° &nbsp;|&nbsp; Error:{' '}
          {(target - renderPosition).toFixed(1)}°
        </p>
        <p>{verdict}</p>
        <button type="button" className="btn btn-ghost" onClick={reset}>
          Replay
        </button>
      </div>
    </div>
  );
}
