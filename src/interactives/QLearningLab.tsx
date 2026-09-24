import { useEffect, useRef, useState } from 'react';

const COLS = 7;
const ROWS = 5;
const CELL = 60;
const START = 4 * COLS + 0;
const GOAL = 0 * COLS + 6;
const PITS = new Set([4 * COLS + 2, 4 * COLS + 3, 4 * COLS + 4, 2 * COLS + 5]);
const WALLS = new Set([1 * COLS + 2, 2 * COLS + 2, 1 * COLS + 4]);
const MAX_STEPS = 60;
const HISTORY = 300;
const ACTIONS = [
  { dx: 0, dy: -1 },
  { dx: 1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: -1, dy: 0 },
];

function envStep(s: number, a: number): { next: number; reward: number; done: boolean } {
  const x = (s % COLS) + ACTIONS[a].dx;
  const y = Math.floor(s / COLS) + ACTIONS[a].dy;
  let next = s;
  if (x >= 0 && x < COLS && y >= 0 && y < ROWS && !WALLS.has(y * COLS + x)) next = y * COLS + x;
  if (next === GOAL) return { next, reward: 10, done: true };
  if (PITS.has(next)) return { next, reward: -10, done: true };
  return { next, reward: -1, done: false };
}

const qMax = (q: Float64Array, s: number) => Math.max(q[s * 4], q[s * 4 + 1], q[s * 4 + 2], q[s * 4 + 3]);

function bestAction(q: Float64Array, s: number, randomTies: boolean) {
  const m = qMax(q, s);
  const ties = [0, 1, 2, 3].filter((a) => q[s * 4 + a] === m);
  return randomTies ? ties[Math.floor(Math.random() * ties.length)] : ties[0];
}

function runEpisode(q: Float64Array, alpha: number, gamma: number, epsilon: number) {
  let s = START;
  let total = 0;
  for (let t = 0; t < MAX_STEPS; t++) {
    const a = Math.random() < epsilon ? Math.floor(Math.random() * 4) : bestAction(q, s, true);
    const { next, reward, done } = envStep(s, a);
    const target = done ? reward : reward + gamma * qMax(q, next);
    q[s * 4 + a] += alpha * (target - q[s * 4 + a]);
    total += reward;
    s = next;
    if (done) break;
  }
  return total;
}

function greedyRollout(q: Float64Array) {
  const path = [START];
  let s = START;
  for (let t = 0; t < 30; t++) {
    const { next, done } = envStep(s, bestAction(q, s, false));
    path.push(next);
    s = next;
    if (done) break;
  }
  return path;
}

export function QLearningLab() {
  const [alpha, setAlpha] = useState(0.5);
  const [gamma, setGamma] = useState(0.95);
  const [epsilon, setEpsilon] = useState(0.2);
  const [returns, setReturns] = useState<number[]>([]);
  const [episodes, setEpisodes] = useState(0);
  const [autoTrain, setAutoTrain] = useState(false);
  const [rollout, setRollout] = useState<{ path: number[]; k: number } | null>(null);

  const qRef = useRef(new Float64Array(COLS * ROWS * 4));
  const paramsRef = useRef({ alpha, gamma, epsilon });
  paramsRef.current = { alpha, gamma, epsilon };

  function train(n: number) {
    const { alpha: a, gamma: g, epsilon: e } = paramsRef.current;
    const batch: number[] = [];
    for (let i = 0; i < n; i++) batch.push(runEpisode(qRef.current, a, g, e));
    setReturns((r) => [...r, ...batch].slice(-HISTORY));
    setEpisodes((c) => c + n);
  }

  function reset() {
    qRef.current = new Float64Array(COLS * ROWS * 4);
    setAutoTrain(false);
    setRollout(null);
    setReturns([]);
    setEpisodes(0);
  }

  useEffect(() => {
    if (!autoTrain) return;
    // train() reads hyperparameters from a ref, so the interval never sees stale values.
    const id = setInterval(() => train(3), 50);
    return () => clearInterval(id);
  }, [autoTrain]);

  useEffect(() => {
    if (!rollout || rollout.k >= rollout.path.length - 1) return;
    const id = setTimeout(() => setRollout((r) => r && { ...r, k: r.k + 1 }), 280);
    return () => clearTimeout(id);
  }, [rollout]);

  const q = qRef.current;
  const recent = returns.slice(-20);
  const avgRecent = recent.length ? recent.reduce((a, b) => a + b, 0) / recent.length : null;

  const smoothed = returns.map((_, i) => {
    const w = returns.slice(Math.max(0, i - 19), i + 1);
    return w.reduce((a, b) => a + b, 0) / w.length;
  });
  const toY = (v: number) => 80 - ((Math.max(-70, Math.min(10, v)) + 70) / 80) * 76;
  const line = (vals: number[]) => vals.map((v, i) => `${(i / (HISTORY - 1)) * 300},${toY(v)}`).join(' ');

  const agentCell = rollout ? rollout.path[rollout.k] : null;

  return (
    <div className="interactive-body">
      <svg viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`} className="interactive-svg" style={{ maxWidth: 440 }}>
        <defs>
          <marker id="q-arrow" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--text-h)" />
          </marker>
        </defs>
        {Array.from({ length: COLS * ROWS }, (_, s) => {
          const x = (s % COLS) * CELL;
          const y = Math.floor(s / COLS) * CELL;
          const cx = x + CELL / 2;
          const cy = y + CELL / 2;

          if (WALLS.has(s)) return <rect key={s} x={x} y={y} width={CELL} height={CELL} fill="var(--text-h)" />;
          if (s === GOAL || PITS.has(s)) {
            const goal = s === GOAL;
            return (
              <g key={s}>
                <rect x={x} y={y} width={CELL} height={CELL} fill={goal ? '#1a9d5c' : '#d1453d'} stroke="var(--border)" />
                <text x={cx} y={cy + 5} fontSize="14" fontWeight={700} fill="white" textAnchor="middle">
                  {goal ? '+10' : '−10'}
                </text>
              </g>
            );
          }

          const v = qMax(q, s);
          const visited = [0, 1, 2, 3].some((a) => q[s * 4 + a] !== 0);
          const a = bestAction(q, s, false);
          return (
            <g key={s}>
              <rect x={x} y={y} width={CELL} height={CELL} fill="var(--surface)" stroke="var(--border)" />
              {visited && (
                <>
                  <rect x={x} y={y} width={CELL} height={CELL} fill={v >= 0 ? '#1a9d5c' : '#d1453d'} opacity={Math.min(1, Math.abs(v) / 10) * 0.55} />
                  <line
                    x1={cx - ACTIONS[a].dx * 9}
                    y1={cy - ACTIONS[a].dy * 9}
                    x2={cx + ACTIONS[a].dx * 12}
                    y2={cy + ACTIONS[a].dy * 12}
                    stroke="var(--text-h)"
                    strokeWidth={2}
                    markerEnd="url(#q-arrow)"
                  />
                  <text x={x + CELL - 4} y={y + CELL - 5} fontSize="9" fill="var(--text-dim)" textAnchor="end">
                    {v.toFixed(1)}
                  </text>
                </>
              )}
              {s === START && (
                <text x={x + 4} y={y + 12} fontSize="9" fontWeight={700} fill="var(--text-dim)">
                  START
                </text>
              )}
            </g>
          );
        })}
        {agentCell !== null && (
          <circle cx={(agentCell % COLS) * CELL + CELL / 2} cy={Math.floor(agentCell / COLS) * CELL + CELL / 2} r={13} fill="#2f6fed" stroke="white" strokeWidth={2} />
        )}
      </svg>

      <div className="interactive-controls">
        <button type="button" className="btn btn-ghost" onClick={() => train(1)} disabled={autoTrain}>
          Train 1 Episode
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => train(100)} disabled={autoTrain}>
          Train 100
        </button>
        <button type="button" className="btn btn-primary" onClick={() => setAutoTrain((t) => !t)}>
          {autoTrain ? 'Pause Training' : 'Auto-Train'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => setRollout({ path: greedyRollout(q), k: 0 })}>
          Watch Policy
        </button>
        <button type="button" className="btn btn-ghost" onClick={reset}>
          Reset
        </button>
      </div>

      <div className="interactive-controls-grid">
        <label>
          Exploration ε: {epsilon.toFixed(2)}
          <input type="range" min={0} max={1} step={0.05} value={epsilon} onChange={(e) => setEpsilon(Number(e.target.value))} />
        </label>
        <label>
          Learning rate α: {alpha.toFixed(2)}
          <input type="range" min={0.05} max={1} step={0.05} value={alpha} onChange={(e) => setAlpha(Number(e.target.value))} />
        </label>
        <label>
          Discount γ: {gamma.toFixed(2)}
          <input type="range" min={0.5} max={0.99} step={0.01} value={gamma} onChange={(e) => setGamma(Number(e.target.value))} />
        </label>
      </div>

      <svg viewBox="0 0 300 84" className="interactive-svg" style={{ maxWidth: 440 }}>
        <line x1={0} y1={toY(0)} x2={300} y2={toY(0)} stroke="var(--border)" strokeDasharray="3 3" />
        <polyline points={line(returns)} fill="none" stroke="#2f6fed" strokeWidth={1} opacity={0.35} />
        <polyline points={line(smoothed)} fill="none" stroke="#2f6fed" strokeWidth={2.5} />
        <text x={4} y={11} fontSize="9" fill="var(--text-dim)">
          return per episode (thick line: 20-episode average)
        </text>
      </svg>

      <div className="interactive-readout">
        <p>
          Episodes trained: <strong>{episodes}</strong> &nbsp;|&nbsp; Average return (last 20):{' '}
          <strong>{avgRecent === null ? '—' : avgRecent.toFixed(1)}</strong>
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>
          Rewards: −1 per move, −10 for a pit (episode ends), +10 for reaching the goal (episode ends). Cell shading and
          the number in each corner show the learned value max Q(s, a); arrows show the current best action.
        </p>
      </div>
    </div>
  );
}
