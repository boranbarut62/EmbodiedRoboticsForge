import { useEffect, useRef, useState } from 'react';

const DRIVER_RPM = 30;
const PX_PER_TOOTH = 1.6;
const BASE_RADIUS = 14;

function Gear({ cx, cy, radius, angle, color, teeth }: { cx: number; cy: number; radius: number; angle: number; color: string; teeth: number }) {
  const spokes = Math.max(6, Math.round(teeth / 2));
  const lines = Array.from({ length: spokes }, (_, i) => {
    const a = (angle + (360 / spokes) * i) * (Math.PI / 180);
    return (
      <line key={i} x1={cx} y1={cy} x2={cx + radius * Math.cos(a)} y2={cy + radius * Math.sin(a)} stroke={color} strokeWidth={2.5} />
    );
  });
  return (
    <g>
      <circle cx={cx} cy={cy} r={radius} fill="none" stroke={color} strokeWidth={2} />
      {lines}
      <circle cx={cx} cy={cy} r={4} fill={color} />
    </g>
  );
}

export function GearTrainLab() {
  const [teeth1, setTeeth1] = useState(12);
  const [teeth2, setTeeth2] = useState(24);
  const [angle1, setAngle1] = useState(0);
  const [angle2, setAngle2] = useState(0);
  const frame = useRef<number>(0);
  const lastTime = useRef<number | null>(null);

  const r1 = BASE_RADIUS + teeth1 * PX_PER_TOOTH;
  const r2 = BASE_RADIUS + teeth2 * PX_PER_TOOTH;
  const cx1 = 100;
  const cy = 90;
  const cx2 = cx1 + r1 + r2;

  const driven_rpm = DRIVER_RPM * (teeth1 / teeth2);
  const gearRatio = teeth2 / teeth1;

  useEffect(() => {
    function tick(t: number) {
      if (lastTime.current === null) lastTime.current = t;
      const dt = (t - lastTime.current) / 1000;
      lastTime.current = t;
      setAngle1((a) => (a + (DRIVER_RPM / 60) * 360 * dt) % 360);
      setAngle2((a) => (a - (driven_rpm / 60) * 360 * dt + 360) % 360);
      frame.current = requestAnimationFrame(tick);
    }
    frame.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame.current);
      lastTime.current = null;
    };
  }, [driven_rpm]);

  return (
    <div className="interactive-body">
      <svg viewBox="0 0 400 180" className="interactive-svg">
        <Gear cx={cx1} cy={cy} radius={r1} angle={angle1} color="#2f6fed" teeth={teeth1} />
        <Gear cx={cx2} cy={cy} radius={r2} angle={angle2} color="#1a9d5c" teeth={teeth2} />
        <text x={cx1} y={cy + r1 + 18} fontSize="11" fill="var(--text-dim)" textAnchor="middle">
          Driver: {teeth1} teeth
        </text>
        <text x={cx2} y={cy + r2 + 18} fontSize="11" fill="var(--text-dim)" textAnchor="middle">
          Driven: {teeth2} teeth
        </text>
      </svg>

      <div className="interactive-controls-grid">
        <label>
          Driver gear teeth: {teeth1}
          <input type="range" min={8} max={30} value={teeth1} onChange={(e) => setTeeth1(Number(e.target.value))} />
        </label>
        <label>
          Driven gear teeth: {teeth2}
          <input type="range" min={8} max={40} value={teeth2} onChange={(e) => setTeeth2(Number(e.target.value))} />
        </label>
      </div>

      <div className="interactive-readout">
        <p>Driver spins at a fixed {DRIVER_RPM} RPM. Notice the two gears always turn in opposite directions.</p>
        <p>
          Gear ratio = driven teeth / driver teeth = {teeth2} / {teeth1} = <strong>{gearRatio.toFixed(2)}</strong>
        </p>
        <p>
          Driven speed = {DRIVER_RPM} / {gearRatio.toFixed(2)} = <strong>{driven_rpm.toFixed(1)} RPM</strong> &nbsp;|&nbsp;
          Torque multiplier: <strong>{gearRatio.toFixed(2)}×</strong>
        </p>
      </div>
    </div>
  );
}
