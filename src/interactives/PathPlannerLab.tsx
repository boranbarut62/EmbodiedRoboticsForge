import { useEffect, useMemo, useState, type PointerEvent as ReactPointerEvent } from 'react';

const COLS = 22;
const ROWS = 13;
const CELL = 24;
const START = 6 * COLS + 1;
const GOAL = 6 * COLS + 20;
const MUD_COST = 5;
const MARKERS = [
  { cell: START, label: 'S', color: '#1a9d5c' },
  { cell: GOAL, label: 'G', color: '#d1453d' },
];

type Cell = 'free' | 'wall' | 'mud';
type Algorithm = 'bfs' | 'dijkstra' | 'astar';
type Tool = 'wall' | 'mud' | 'free';

const ALGORITHMS: { id: Algorithm; label: string }[] = [
  { id: 'bfs', label: 'BFS' },
  { id: 'dijkstra', label: 'Dijkstra' },
  { id: 'astar', label: 'A*' },
];

interface SearchResult {
  order: number[];
  path: number[] | null;
  cost: number;
}

function defaultGrid(): Cell[] {
  const grid: Cell[] = Array(COLS * ROWS).fill('free');
  for (let y = 3; y <= 9; y++) grid[y * COLS + 5] = 'wall';
  for (let y = 8; y <= 12; y++) grid[y * COLS + 16] = 'wall';
  for (let y = 2; y <= 10; y++) for (let x = 9; x <= 12; x++) grid[y * COLS + x] = 'mud';
  return grid;
}

const costOf = (c: Cell) => (c === 'mud' ? MUD_COST : 1);

function neighbors(i: number, grid: Cell[]) {
  const x = i % COLS;
  const y = Math.floor(i / COLS);
  const out: number[] = [];
  if (x < COLS - 1) out.push(i + 1);
  if (y < ROWS - 1) out.push(i + COLS);
  if (x > 0) out.push(i - 1);
  if (y > 0) out.push(i - COLS);
  return out.filter((n) => grid[n] !== 'wall');
}

const manhattan = (i: number) => Math.abs((i % COLS) - (GOAL % COLS)) + Math.abs(Math.floor(i / COLS) - Math.floor(GOAL / COLS));

function tracePath(prev: Int32Array, grid: Cell[]): { path: number[]; cost: number } {
  const path: number[] = [];
  let cost = 0;
  for (let c = GOAL; c !== -1; c = prev[c]) {
    path.push(c);
    if (c !== START) cost += costOf(grid[c]);
  }
  return { path: path.reverse(), cost };
}

function search(algorithm: Algorithm, grid: Cell[]): SearchResult {
  const prev = new Int32Array(COLS * ROWS).fill(-1);
  const order: number[] = [];

  if (algorithm === 'bfs') {
    const seen = new Uint8Array(COLS * ROWS);
    const queue = [START];
    seen[START] = 1;
    while (queue.length) {
      const cur = queue.shift()!;
      order.push(cur);
      if (cur === GOAL) return { order, ...tracePath(prev, grid) };
      for (const n of neighbors(cur, grid)) {
        if (!seen[n]) {
          seen[n] = 1;
          prev[n] = cur;
          queue.push(n);
        }
      }
    }
    return { order, path: null, cost: Infinity };
  }

  const g = new Float64Array(COLS * ROWS).fill(Infinity);
  const closed = new Uint8Array(COLS * ROWS);
  g[START] = 0;
  const open = [START];
  const priority = (i: number) => (algorithm === 'astar' ? g[i] + manhattan(i) : g[i]);

  while (open.length) {
    let best = 0;
    for (let k = 1; k < open.length; k++) {
      const a = open[k];
      const b = open[best];
      if (priority(a) < priority(b) || (priority(a) === priority(b) && manhattan(a) < manhattan(b))) best = k;
    }
    const cur = open.splice(best, 1)[0];
    if (closed[cur]) continue;
    closed[cur] = 1;
    order.push(cur);
    if (cur === GOAL) return { order, ...tracePath(prev, grid) };
    for (const n of neighbors(cur, grid)) {
      const ng = g[cur] + costOf(grid[n]);
      if (ng < g[n]) {
        g[n] = ng;
        prev[n] = cur;
        open.push(n);
      }
    }
  }
  return { order, path: null, cost: Infinity };
}

export function PathPlannerLab() {
  const [grid, setGrid] = useState<Cell[]>(defaultGrid);
  const [algorithm, setAlgorithm] = useState<Algorithm>('astar');
  const [tool, setTool] = useState<Tool>('wall');
  const [shown, setShown] = useState(0);
  const [running, setRunning] = useState(true);

  const results = useMemo(
    () => Object.fromEntries(ALGORITHMS.map((a) => [a.id, search(a.id, grid)])) as Record<Algorithm, SearchResult>,
    [grid]
  );
  const result = results[algorithm];
  const done = shown >= result.order.length;

  useEffect(() => {
    setShown(0);
    setRunning(true);
  }, [grid, algorithm]);

  useEffect(() => {
    if (!running || done) return;
    const id = setInterval(() => setShown((s) => s + 2), 30);
    return () => clearInterval(id);
  }, [running, done]);

  const expandedAt = useMemo(() => {
    const map = new Map<number, number>();
    result.order.forEach((cell, k) => map.set(cell, k));
    return map;
  }, [result]);
  const pathSet = new Set(done && result.path ? result.path : []);

  function paint(i: number) {
    if (i === START || i === GOAL || grid[i] === tool) return;
    setGrid((g) => g.map((c, k) => (k === i ? tool : c)));
  }

  const cellProps = (i: number) => ({
    onPointerDown: (e: ReactPointerEvent) => {
      (e.target as Element).releasePointerCapture?.(e.pointerId);
      paint(i);
    },
    onPointerEnter: (e: ReactPointerEvent) => {
      if (e.buttons === 1) paint(i);
    },
  });

  return (
    <div className="interactive-body">
      <div className="interactive-controls">
        {ALGORITHMS.map((a) => (
          <button key={a.id} type="button" className={'btn btn-toggle' + (algorithm === a.id ? ' btn-toggle-active' : '')} onClick={() => setAlgorithm(a.id)}>
            {a.label}
          </button>
        ))}
        <button type="button" className="btn btn-ghost" onClick={() => (done ? setShown(0) : setRunning((r) => !r))}>
          {done ? 'Replay Search' : running ? 'Pause' : 'Resume'}
        </button>
        <button type="button" className="btn btn-ghost" disabled={running || done} onClick={() => setShown((s) => s + 1)}>
          Step
        </button>
      </div>

      <svg viewBox={`0 0 ${COLS * CELL} ${ROWS * CELL}`} className="interactive-svg" style={{ maxWidth: 560 }}>
        {grid.map((cell, i) => {
          const x = (i % COLS) * CELL;
          const y = Math.floor(i / COLS) * CELL;
          const k = expandedAt.get(i);
          const explored = k !== undefined && k < shown;
          let fill = 'var(--surface)';
          if (cell === 'wall') fill = 'var(--text-h)';
          else if (cell === 'mud') fill = '#a0763f';
          return (
            <g key={i} {...cellProps(i)} style={{ cursor: 'crosshair' }}>
              <rect x={x} y={y} width={CELL} height={CELL} fill={fill} opacity={cell === 'mud' ? 0.55 : 1} stroke="var(--border)" strokeWidth={0.5} />
              {explored && cell !== 'wall' && <rect x={x + 3} y={y + 3} width={CELL - 6} height={CELL - 6} rx={3} fill="#2f6fed" opacity={0.22} />}
              {pathSet.has(i) && <circle cx={x + CELL / 2} cy={y + CELL / 2} r={5} fill="#2f6fed" />}
            </g>
          );
        })}
        {MARKERS.map(({ cell, label, color }) => {
          const cx = (cell % COLS) * CELL + CELL / 2;
          const cy = Math.floor(cell / COLS) * CELL + CELL / 2;
          return (
            <g key={label} pointerEvents="none">
              <circle cx={cx} cy={cy} r={10} fill={color} />
              <text x={cx} y={cy + 4} fontSize="11" fontWeight={700} fill="white" textAnchor="middle">
                {label}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="interactive-controls">
        <span style={{ fontSize: 13, color: 'var(--text-dim)', alignSelf: 'center' }}>Paint:</span>
        {(['wall', 'mud', 'free'] as Tool[]).map((t) => (
          <button key={t} type="button" className={'btn btn-toggle' + (tool === t ? ' btn-toggle-active' : '')} onClick={() => setTool(t)}>
            {t === 'wall' ? 'Wall' : t === 'mud' ? `Mud (cost ${MUD_COST})` : 'Erase'}
          </button>
        ))}
        <button type="button" className="btn btn-ghost" onClick={() => setGrid(defaultGrid())}>
          Reset Map
        </button>
      </div>

      <div className="interactive-readout">
        <table className="progress-table">
          <thead>
            <tr>
              <th>Algorithm</th>
              <th>Cells expanded</th>
              <th>Path steps</th>
              <th>Path cost</th>
            </tr>
          </thead>
          <tbody>
            {ALGORITHMS.map((a) => {
              const r = results[a.id];
              return (
                <tr key={a.id} style={a.id === algorithm ? { fontWeight: 700 } : undefined}>
                  <td>{a.label}</td>
                  <td>{r.order.length}</td>
                  <td>{r.path ? r.path.length - 1 : '—'}</td>
                  <td>{r.path ? r.cost : 'no path'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
