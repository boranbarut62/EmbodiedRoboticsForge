import { useEffect, useRef, useState } from 'react';

const G = 9.81;
const PX_PER_M = 160;
const VIEW_W = 600;
const GROUND_Y = 250;
const SIM_DT = 1 / 240;
const K_CP = 2; // ZMP placed at foot + K_CP·(ξ − foot): drives the capture point back to the foot when K_CP > 1
const STEP_TIME = 0.3;

type Phase = 'stand' | 'swing' | 'fallen';

interface Sim {
  x: number; // CoM horizontal position, m
  v: number; // CoM velocity, m/s
  foot: number; // stance-foot center (ankle), m
  zmp: number;
  phase: Phase;
  swingTimer: number;
  steps: number;
  saturated: boolean;
  camera: number;
}

const initialSim = (): Sim => ({ x: 0, v: 0, foot: 0, zmp: 0, phase: 'stand', swingTimer: 0, steps: 0, saturated: false, camera: 0 });

export function HumanoidBalanceLab() {
  const [footLength, setFootLength] = useState(0.2);
  const [comHeight, setComHeight] = useState(0.9);
  const [push, setPush] = useState(0.4);
  const [stepping, setStepping] = useState(true);
  const [, setFrame] = useState(0);

  const simRef = useRef<Sim>(initialSim());
  const params = useRef({ footLength, comHeight, stepping });
  params.current = { footLength, comHeight, stepping };
  const acc = useRef(0);
  const frame = useRef<number>(0);
  const lastTime = useRef<number | null>(null);

  useEffect(() => {
    function physicsStep(s: Sim) {
      if (s.phase === 'fallen') return;
      const { footLength: len, comHeight: z, stepping: canStep } = params.current;
      const omega = Math.sqrt(G / z);
      const xi = s.x + s.v / omega;
      const lo = s.foot - len / 2;
      const hi = s.foot + len / 2;

      const zmpWanted = s.foot + K_CP * (xi - s.foot);
      s.zmp = Math.min(hi, Math.max(lo, zmpWanted));
      s.saturated = Math.abs(zmpWanted - s.zmp) > 1e-9;

      if (s.phase === 'stand' && canStep && (xi < lo || xi > hi)) {
        s.phase = 'swing';
        s.swingTimer = 0;
      }
      if (s.phase === 'swing') {
        s.swingTimer += SIM_DT;
        if (s.swingTimer >= STEP_TIME) {
          s.foot = xi; // land the new foot on the capture point
          s.steps++;
          s.phase = 'stand';
        }
      }

      // Linear inverted pendulum: gravity accelerates the CoM away from the ZMP.
      s.v += omega * omega * (s.x - s.zmp) * SIM_DT;
      s.x += s.v * SIM_DT;

      if (Math.abs(s.x - s.foot) > 0.5 * z) s.phase = 'fallen';
    }

    function tick(now: number) {
      if (lastTime.current === null) lastTime.current = now;
      const dt = Math.min(0.05, (now - lastTime.current) / 1000);
      lastTime.current = now;
      acc.current += dt;
      const s = simRef.current;
      while (acc.current >= SIM_DT) {
        physicsStep(s);
        acc.current -= SIM_DT;
      }
      s.camera += (s.foot - s.camera) * Math.min(1, dt * 4);
      setFrame((f) => f + 1);
      frame.current = requestAnimationFrame(tick);
    }
    frame.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame.current);
      lastTime.current = null;
    };
  }, []);

  function applyPush(direction: 1 | -1) {
    if (simRef.current.phase !== 'fallen') simRef.current.v += direction * push;
  }

  const s = simRef.current;
  const omega = Math.sqrt(G / comHeight);
  const xi = s.x + s.v / omega;
  const half = footLength / 2;
  const sx = (wx: number) => VIEW_W / 2 + (wx - s.camera) * PX_PER_M;
  const clampX = (px: number) => Math.max(8, Math.min(VIEW_W - 8, px));

  const comX = sx(s.x);
  const comY = GROUND_Y - comHeight * PX_PER_M;
  const ankleX = sx(s.foot);
  const fallen = s.phase === 'fallen';
  const bodyColor = fallen ? '#d1453d' : 'var(--text-h)';

  let status = 'Balanced: the capture point is inside the foot.';
  if (fallen) status = 'Fell: the capture point left the support polygon and no step was taken.';
  else if (s.phase === 'swing') status = 'Stepping: swinging the foot to land on the capture point.';
  else if (s.saturated) status = 'Ankle torque saturated: the ZMP is pinned at the edge of the foot.';

  const ticks = [];
  for (let m = Math.floor((s.camera - 2) * 4) / 4; m < s.camera + 2; m += 0.25) {
    ticks.push(<line key={m} x1={sx(m)} y1={GROUND_Y} x2={sx(m)} y2={GROUND_Y + 6} stroke="var(--border)" />);
  }

  return (
    <div className="interactive-body">
      <svg viewBox={`0 0 ${VIEW_W} 280`} className="interactive-svg" style={{ maxWidth: VIEW_W }}>
        <line x1={0} y1={GROUND_Y} x2={VIEW_W} y2={GROUND_Y} stroke="var(--text-dim)" strokeWidth={2} />
        {ticks}
        <rect x={sx(s.foot - half)} y={GROUND_Y - 3} width={footLength * PX_PER_M} height={6} fill="#1a9d5c" opacity={0.25} />
        <rect x={sx(s.foot - half)} y={GROUND_Y - 8} width={footLength * PX_PER_M} height={6} rx={2} fill={bodyColor} />
        {s.phase === 'swing' && (
          <rect x={sx(xi - half)} y={GROUND_Y - 8} width={footLength * PX_PER_M} height={6} rx={2} fill="none" stroke="#e8872b" strokeDasharray="3 2" />
        )}

        <line x1={ankleX} y1={GROUND_Y - 8} x2={comX} y2={comY} stroke={bodyColor} strokeWidth={4} strokeLinecap="round" />
        <line x1={comX} y1={comY} x2={comX} y2={comY - 38} stroke={bodyColor} strokeWidth={4} strokeLinecap="round" />
        <circle cx={comX} cy={comY - 50} r={11} fill="none" stroke={bodyColor} strokeWidth={3} />
        <circle cx={comX} cy={comY} r={9} fill={bodyColor} />
        <line x1={comX} y1={comY} x2={comX} y2={GROUND_Y} stroke="var(--border)" strokeDasharray="3 3" />

        <polygon points={`${clampX(sx(s.zmp))},${GROUND_Y + 2} ${clampX(sx(s.zmp)) - 6},${GROUND_Y + 12} ${clampX(sx(s.zmp)) + 6},${GROUND_Y + 12}`} fill="#2f6fed" />
        <g transform={`translate(${clampX(sx(xi))} ${GROUND_Y + 20})`} stroke="#e8872b" strokeWidth={3}>
          <line x1={-6} y1={-6} x2={6} y2={6} />
          <line x1={-6} y1={6} x2={6} y2={-6} />
        </g>
        <text x={8} y={16} fontSize="11" fill="var(--text-dim)">
          ▲ ZMP (blue) · × capture point (orange) · green band = support polygon
        </text>
      </svg>

      <div className="interactive-controls">
        <button type="button" className="btn btn-primary" onClick={() => applyPush(-1)}>
          ← Push
        </button>
        <button type="button" className="btn btn-primary" onClick={() => applyPush(1)}>
          Push →
        </button>
        <button type="button" className={'btn btn-toggle' + (stepping ? ' btn-toggle-active' : '')} onClick={() => setStepping((v) => !v)}>
          Stepping: {stepping ? 'ON' : 'OFF'}
        </button>
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            simRef.current = initialSim();
            setFrame((f) => f + 1);
          }}
        >
          Reset
        </button>
      </div>

      <div className="interactive-controls-grid">
        <label>
          Push strength: {push.toFixed(2)} m/s
          <input type="range" min={0.05} max={1.2} step={0.05} value={push} onChange={(e) => setPush(Number(e.target.value))} />
        </label>
        <label>
          Foot length: {(footLength * 100).toFixed(0)} cm (toe {(half * 100).toFixed(0)} cm ahead of ankle)
          <input type="range" min={0.1} max={0.3} step={0.01} value={footLength} onChange={(e) => setFootLength(Number(e.target.value))} />
        </label>
        <label>
          Center-of-mass height: {comHeight.toFixed(2)} m
          <input type="range" min={0.5} max={1.2} step={0.05} value={comHeight} onChange={(e) => setComHeight(Number(e.target.value))} />
        </label>
      </div>

      <div className="interactive-readout">
        <p className={fallen ? 'feedback-incorrect' : s.phase === 'swing' || s.saturated ? undefined : 'feedback-correct'}>{status}</p>
        <p>
          ω = √(g / z_c) = {omega.toFixed(2)} s⁻¹ &nbsp;|&nbsp; capture point ξ − ankle = <strong>{((xi - s.foot) * 100).toFixed(1)} cm</strong>{' '}
          (the foot reaches ±{(half * 100).toFixed(0)} cm) &nbsp;|&nbsp; steps taken: {s.steps}
        </p>
      </div>
    </div>
  );
}
