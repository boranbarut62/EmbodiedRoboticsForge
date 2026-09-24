import { useEffect, useMemo, useRef, useState } from 'react';
import { mulberry32 } from '../lib/random';

interface Point {
  x1: number; // terrain slope, normalized 0–1
  x2: number; // terrain roughness, normalized 0–1
  y: 0 | 1; // 1 = unsafe to drive
}

interface Weights {
  w1: number;
  w2: number;
  b: number;
}

const INITIAL: Weights = { w1: -2, w2: 3, b: 0 };
const PLOT = 280;
const PAD = 20;
const GRID = 20;

function sigmoid(z: number) {
  return 1 / (1 + Math.exp(-z));
}

function predict(w: Weights, x1: number, x2: number) {
  return sigmoid(w.w1 * x1 + w.w2 * x2 + w.b);
}

function lossOf(w: Weights, points: Point[]) {
  let total = 0;
  for (const p of points) {
    const prob = Math.min(1 - 1e-7, Math.max(1e-7, predict(w, p.x1, p.x2)));
    total += -(p.y * Math.log(prob) + (1 - p.y) * Math.log(1 - prob));
  }
  return total / points.length;
}

function gradientStep(w: Weights, points: Point[], lr: number): Weights {
  let g1 = 0;
  let g2 = 0;
  let gb = 0;
  for (const p of points) {
    const err = predict(w, p.x1, p.x2) - p.y;
    g1 += err * p.x1;
    g2 += err * p.x2;
    gb += err;
  }
  const n = points.length;
  return { w1: w.w1 - (lr * g1) / n, w2: w.w2 - (lr * g2) / n, b: w.b - (lr * gb) / n };
}

const toX = (x1: number) => PAD + x1 * PLOT;
const toY = (x2: number) => PAD + (1 - x2) * PLOT;

export function NeuronLab() {
  const points = useMemo<Point[]>(() => {
    const rand = mulberry32(7);
    return Array.from({ length: 44 }, () => {
      const x1 = rand();
      const x2 = rand();
      const score = x1 + 0.8 * x2 + (rand() - 0.5) * 0.25;
      return { x1, x2, y: score > 0.9 ? 1 : 0 };
    });
  }, []);

  const [weights, setWeightsState] = useState<Weights>(INITIAL);
  const [lr, setLr] = useState(3);
  const [running, setRunning] = useState(false);
  const [lossHistory, setLossHistory] = useState<number[]>(() => [lossOf(INITIAL, points)]);
  const weightsRef = useRef(INITIAL);
  const lrRef = useRef(lr);
  lrRef.current = lr;

  function setWeights(next: Weights) {
    weightsRef.current = next;
    setWeightsState(next);
    setLossHistory((h) => [...h, lossOf(next, points)].slice(-150));
  }

  function trainStep() {
    setWeights(gradientStep(weightsRef.current, points, lrRef.current));
  }

  function reset() {
    setRunning(false);
    weightsRef.current = INITIAL;
    setWeightsState(INITIAL);
    setLossHistory([lossOf(INITIAL, points)]);
  }

  useEffect(() => {
    if (!running) return;
    // trainStep reads weights/lr from refs, so the interval never sees stale values.
    const id = setInterval(trainStep, 60);
    return () => clearInterval(id);
  }, [running]);

  const loss = lossOf(weights, points);
  const accuracy = points.filter((p) => (predict(weights, p.x1, p.x2) > 0.5 ? 1 : 0) === p.y).length / points.length;

  const cells = [];
  for (let i = 0; i < GRID; i++) {
    for (let j = 0; j < GRID; j++) {
      const cx1 = (i + 0.5) / GRID;
      const cx2 = (j + 0.5) / GRID;
      const prob = predict(weights, cx1, cx2);
      const unsafe = prob > 0.5;
      cells.push(
        <rect
          key={`${i}-${j}`}
          x={toX(i / GRID)}
          y={toY((j + 1) / GRID)}
          width={PLOT / GRID + 0.5}
          height={PLOT / GRID + 0.5}
          fill={unsafe ? '#d1453d' : '#1a9d5c'}
          opacity={Math.abs(prob - 0.5) * 0.7}
        />
      );
    }
  }

  let boundary = null;
  if (Math.abs(weights.w2) > 1e-6) {
    const x2At = (x1: number) => -(weights.w1 * x1 + weights.b) / weights.w2;
    boundary = <line x1={toX(0)} y1={toY(x2At(0))} x2={toX(1)} y2={toY(x2At(1))} stroke="var(--text-h)" strokeWidth={2.5} />;
  } else if (Math.abs(weights.w1) > 1e-6) {
    const x1 = -weights.b / weights.w1;
    boundary = <line x1={toX(x1)} y1={toY(0)} x2={toX(x1)} y2={toY(1)} stroke="var(--text-h)" strokeWidth={2.5} />;
  }

  const maxLoss = Math.max(1, ...lossHistory);
  const lossPoints = lossHistory.map((l, i) => `${(i / 149) * 300},${70 - (l / maxLoss) * 64}`).join(' ');

  const slider = (key: keyof Weights, label: string) => (
    <label>
      {label}: {weights[key].toFixed(2)}
      <input
        type="range"
        min={-30}
        max={30}
        step={0.1}
        value={weights[key]}
        onChange={(e) => setWeights({ ...weightsRef.current, [key]: Number(e.target.value) })}
      />
    </label>
  );

  return (
    <div className="interactive-body">
      <svg viewBox={`0 0 ${PLOT + 2 * PAD} ${PLOT + 2 * PAD}`} className="interactive-svg" style={{ maxWidth: 360 }}>
        <defs>
          <clipPath id="neuron-plot-clip">
            <rect x={PAD} y={PAD} width={PLOT} height={PLOT} />
          </clipPath>
        </defs>
        <g clipPath="url(#neuron-plot-clip)">
          {cells}
          {boundary}
        </g>
        <rect x={PAD} y={PAD} width={PLOT} height={PLOT} fill="none" stroke="var(--border)" />
        {points.map((p, i) => (
          <circle key={i} cx={toX(p.x1)} cy={toY(p.x2)} r={5} fill={p.y ? '#d1453d' : '#1a9d5c'} stroke="var(--surface)" strokeWidth={1.5} />
        ))}
        <text x={PAD + PLOT / 2} y={PLOT + 2 * PAD - 4} fontSize="11" fill="var(--text-dim)" textAnchor="middle">
          slope →
        </text>
        <text x={10} y={PAD + PLOT / 2} fontSize="11" fill="var(--text-dim)" textAnchor="middle" transform={`rotate(-90 10 ${PAD + PLOT / 2})`}>
          roughness →
        </text>
      </svg>

      <div className="interactive-controls">
        <button type="button" className="btn btn-primary" onClick={() => setRunning((r) => !r)}>
          {running ? 'Pause Training' : 'Train (Gradient Descent)'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={trainStep} disabled={running}>
          One Step
        </button>
        <button type="button" className="btn btn-ghost" onClick={reset}>
          Reset
        </button>
      </div>

      <div className="interactive-controls-grid">
        {slider('w1', 'Weight w₁ (slope)')}
        {slider('w2', 'Weight w₂ (roughness)')}
        {slider('b', 'Bias b')}
        <label>
          Learning rate: {lr.toFixed(1)}
          <input type="range" min={0.1} max={40} step={0.1} value={lr} onChange={(e) => setLr(Number(e.target.value))} />
        </label>
      </div>

      <svg viewBox="0 0 300 72" className="interactive-svg" style={{ maxWidth: 360 }}>
        <polyline points={lossPoints} fill="none" stroke="#2f6fed" strokeWidth={2} />
        <text x={4} y={12} fontSize="10" fill="var(--text-dim)">
          loss over time
        </text>
      </svg>

      <div className="interactive-readout">
        <p>
          z = {weights.w1.toFixed(2)}·slope + {weights.w2.toFixed(2)}·roughness + {weights.b.toFixed(2)} &nbsp;→&nbsp; p(unsafe) = σ(z)
        </p>
        <p>
          Loss: <strong>{loss.toFixed(3)}</strong> &nbsp;|&nbsp; Accuracy: <strong>{(accuracy * 100).toFixed(0)}%</strong>
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>
          Red = unsafe terrain, green = safe. The black line is the decision boundary, where σ(z) = 0.5.
        </p>
      </div>
    </div>
  );
}
