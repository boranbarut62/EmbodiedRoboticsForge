import { useState, useRef, type PointerEvent as ReactPointerEvent } from 'react';

const SIZE = 360;
const CENTER = SIZE / 2;
const UNIT = 36; // px per unit
const RANGE = 4; // units from center to edge

type Mode = 'single' | 'add' | 'scale';

function toUnits(px: number, py: number) {
  return { x: (px - CENTER) / UNIT, y: (CENTER - py) / UNIT };
}

function toPixels(x: number, y: number) {
  return { px: CENTER + x * UNIT, py: CENTER - y * UNIT };
}

function clampUnits(x: number, y: number) {
  return { x: Math.max(-RANGE, Math.min(RANGE, x)), y: Math.max(-RANGE, Math.min(RANGE, y)) };
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}

function Arrow({ x, y, color, dashed }: { x: number; y: number; color: string; dashed?: boolean }) {
  const { px, py } = toPixels(x, y);
  const id = `arrow-${color.replace('#', '')}`;
  return (
    <g>
      <defs>
        <marker id={id} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={color} />
        </marker>
      </defs>
      <line
        x1={CENTER}
        y1={CENTER}
        x2={px}
        y2={py}
        stroke={color}
        strokeWidth={2.5}
        strokeDasharray={dashed ? '6 4' : undefined}
        markerEnd={`url(#${id})`}
      />
    </g>
  );
}

export function VectorPlayground() {
  const [mode, setMode] = useState<Mode>('single');
  const [a, setA] = useState({ x: 2, y: 1.5 });
  const [b, setB] = useState({ x: -1.5, y: 1 });
  const [k, setK] = useState(1.5);
  const dragging = useRef<'a' | 'b' | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  function updateFromEvent(e: ReactPointerEvent) {
    if (!dragging.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * SIZE;
    const py = ((e.clientY - rect.top) / rect.height) * SIZE;
    const raw = toUnits(px, py);
    const units = clampUnits(raw.x, raw.y);
    if (dragging.current === 'a') setA(units);
    else setB(units);
  }

  function startDrag(which: 'a' | 'b') {
    return (e: ReactPointerEvent) => {
      dragging.current = which;
      (e.target as Element).setPointerCapture(e.pointerId);
    };
  }

  const sum = { x: a.x + b.x, y: a.y + b.y };
  const scaled = { x: a.x * k, y: a.y * k };
  const magnitude = Math.sqrt(a.x ** 2 + a.y ** 2);
  const angleDeg = (Math.atan2(a.y, a.x) * 180) / Math.PI;

  const handleA = toPixels(a.x, a.y);
  const handleB = toPixels(b.x, b.y);

  return (
    <div className="interactive-body">
      <div className="interactive-controls">
        {(['single', 'add', 'scale'] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            className={'btn btn-toggle' + (mode === m ? ' btn-toggle-active' : '')}
            onClick={() => setMode(m)}
          >
            {m === 'single' ? 'Single Vector' : m === 'add' ? 'Addition A + B' : 'Scalar Multiply k·A'}
          </button>
        ))}
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="interactive-svg"
        onPointerMove={updateFromEvent}
        onPointerUp={() => (dragging.current = null)}
      >
        {Array.from({ length: RANGE * 2 + 1 }, (_, i) => i - RANGE).map((i) => (
          <g key={i} className="vp-grid">
            <line x1={CENTER + i * UNIT} y1={0} x2={CENTER + i * UNIT} y2={SIZE} />
            <line x1={0} y1={CENTER + i * UNIT} x2={SIZE} y2={CENTER + i * UNIT} />
          </g>
        ))}
        <line x1={0} y1={CENTER} x2={SIZE} y2={CENTER} stroke="var(--text-dim)" strokeWidth={1.5} />
        <line x1={CENTER} y1={0} x2={CENTER} y2={SIZE} stroke="var(--text-dim)" strokeWidth={1.5} />

        <Arrow x={a.x} y={a.y} color="#2f6fed" />
        {mode === 'add' && (
          <>
            <Arrow x={b.x} y={b.y} color="#d1453d" />
            <Arrow x={sum.x} y={sum.y} color="#1a9d5c" dashed />
          </>
        )}
        {mode === 'scale' && <Arrow x={scaled.x} y={scaled.y} color="#1a9d5c" dashed />}

        <circle
          cx={handleA.px}
          cy={handleA.py}
          r={9}
          fill="#2f6fed"
          style={{ cursor: 'grab' }}
          onPointerDown={startDrag('a')}
        />
        {mode === 'add' && (
          <circle
            cx={handleB.px}
            cy={handleB.py}
            r={9}
            fill="#d1453d"
            style={{ cursor: 'grab' }}
            onPointerDown={startDrag('b')}
          />
        )}
      </svg>

      <div className="interactive-readout">
        <p>
          <strong style={{ color: '#2f6fed' }}>A</strong> = ({round(a.x)}, {round(a.y)}) &nbsp;|&nbsp; |A| ={' '}
          {round(magnitude)} &nbsp;|&nbsp; angle = {round(angleDeg)}°
        </p>
        {mode === 'add' && (
          <p>
            <strong style={{ color: '#d1453d' }}>B</strong> = ({round(b.x)}, {round(b.y)}) &nbsp;|&nbsp;{' '}
            <strong style={{ color: '#1a9d5c' }}>A + B</strong> = ({round(sum.x)}, {round(sum.y)})
          </p>
        )}
        {mode === 'scale' && (
          <div>
            <label>
              k = {round(k)}
              <input
                type="range"
                min={-2}
                max={2}
                step={0.1}
                value={k}
                onChange={(e) => setK(Number.parseFloat(e.target.value))}
              />
            </label>
            <p>
              <strong style={{ color: '#1a9d5c' }}>k·A</strong> = ({round(scaled.x)}, {round(scaled.y)})
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
