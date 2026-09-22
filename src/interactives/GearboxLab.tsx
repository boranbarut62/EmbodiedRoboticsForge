import { useEffect, useRef, useState } from 'react';

const MOTOR_RPM = 3000; // fixed baseline speed of the bare motor shaft

function Gear({ cx, radius, angle, color, spokes = 8 }: { cx: number; radius: number; angle: number; color: string; spokes?: number }) {
  const lines = Array.from({ length: spokes }, (_, i) => {
    const a = (angle + (360 / spokes) * i) * (Math.PI / 180);
    return (
      <line
        key={i}
        x1={cx}
        y1={70}
        x2={cx + radius * Math.cos(a)}
        y2={70 + radius * Math.sin(a)}
        stroke={color}
        strokeWidth={3}
      />
    );
  });
  return (
    <g>
      <circle cx={cx} cy={70} r={radius} fill="none" stroke={color} strokeWidth={2} />
      {lines}
      <circle cx={cx} cy={70} r={4} fill={color} />
    </g>
  );
}

export function GearboxLab() {
  const [gearRatio, setGearRatio] = useState(10);
  const [motorTorque, setMotorTorque] = useState(0.3);
  const [motorAngle, setMotorAngle] = useState(0);
  const [jointAngle, setJointAngle] = useState(0);
  const frame = useRef<number>(0);
  const lastTime = useRef<number | null>(null);

  const jointRpm = MOTOR_RPM / gearRatio;
  const jointTorque = motorTorque * gearRatio;

  useEffect(() => {
    function tick(t: number) {
      if (lastTime.current === null) lastTime.current = t;
      const dt = (t - lastTime.current) / 1000;
      lastTime.current = t;
      setMotorAngle((a) => (a + (MOTOR_RPM / 60) * 360 * dt) % 360);
      setJointAngle((a) => (a + (jointRpm / 60) * 360 * dt) % 360);
      frame.current = requestAnimationFrame(tick);
    }
    frame.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame.current);
      lastTime.current = null;
    };
  }, [jointRpm]);

  return (
    <div className="interactive-body">
      <svg viewBox="0 0 400 140" className="interactive-svg">
        <text x={70} y={130} fontSize="12" fill="var(--text-dim)" textAnchor="middle">
          Motor (fast, low torque)
        </text>
        <Gear cx={70} radius={26} angle={motorAngle} color="#2f6fed" />

        <line x1={100} y1={70} x2={230} y2={70} stroke="var(--text-dim)" strokeWidth={3} strokeDasharray="6 5" />
        <text x={165} y={58} fontSize="11" fill="var(--text-dim)" textAnchor="middle">
          {gearRatio}:1 gearbox
        </text>

        <text x={300} y={130} fontSize="12" fill="var(--text-dim)" textAnchor="middle">
          Joint (slow, high torque)
        </text>
        <Gear cx={300} radius={Math.min(52, 26 + gearRatio * 0.9)} angle={jointAngle} color="#1a9d5c" spokes={12} />
      </svg>

      <div className="interactive-controls-grid">
        <label>
          Gear ratio: {gearRatio}:1
          <input type="range" min={1} max={50} value={gearRatio} onChange={(e) => setGearRatio(Number(e.target.value))} />
        </label>
        <label>
          Motor torque: {motorTorque.toFixed(2)} Nm
          <input type="range" min={0.05} max={1} step={0.05} value={motorTorque} onChange={(e) => setMotorTorque(Number(e.target.value))} />
        </label>
      </div>

      <div className="interactive-readout">
        <p>Motor speed: {MOTOR_RPM} RPM &nbsp;→&nbsp; Joint speed: {jointRpm.toFixed(0)} RPM</p>
        <p>Motor torque: {motorTorque.toFixed(2)} Nm &nbsp;→&nbsp; Joint torque: {jointTorque.toFixed(2)} Nm</p>
        <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>
          The gearbox divides speed and multiplies torque by the same ratio — that trade-off is exactly what lets a
          small, fast motor move a heavy limb slowly but powerfully.
        </p>
      </div>
    </div>
  );
}
