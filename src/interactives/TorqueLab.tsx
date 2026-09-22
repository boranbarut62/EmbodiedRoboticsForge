import { useState, useRef, type PointerEvent as ReactPointerEvent } from 'react';

const HINGE_X = 50;
const HINGE_Y = 160;
const ARM_PX = 300; // pixel length representing 1.0 m
const ARM_METERS = 1.0;

function round(n: number, d = 2) {
  return Math.round(n * 10 ** d) / 10 ** d;
}

export function TorqueLab() {
  const [r, setR] = useState(0.7); // meters along the arm
  const [force, setForce] = useState(20); // newtons
  const [angle, setAngle] = useState(90); // degrees between force vector and the arm

  const dragging = useRef(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const torque = round(r * force * Math.sin((angle * Math.PI) / 180));
  const doorAngle = Math.max(-40, Math.min(40, torque / 2));

  function updateR(e: ReactPointerEvent) {
    if (!dragging.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 480;
    const meters = Math.max(0, Math.min(ARM_METERS, (px - HINGE_X) / ARM_PX));
    setR(round(meters));
  }

  const handleX = HINGE_X + r * ARM_PX;
  const forceRad = (angle * Math.PI) / 180;
  const forceLen = 20 + force * 1.6;
  // theta measured from the arm's outward direction (+x); "up" is -y in SVG space.
  const fx = handleX + forceLen * Math.cos(forceRad);
  const fy = HINGE_Y - forceLen * Math.sin(forceRad);
  const perpX = handleX;
  const perpY = HINGE_Y - forceLen * Math.sin(forceRad);

  // Robotics connection panel
  const [motorTorque, setMotorTorque] = useState(0.5);
  const [gearRatio, setGearRatio] = useState(20);
  const [armLength, setArmLength] = useState(0.4);
  const [payload, setPayload] = useState(1.5);
  const jointTorque = round(motorTorque * gearRatio);
  const requiredTorque = round(payload * 9.8 * armLength);
  const canLift = jointTorque >= requiredTorque;

  return (
    <div className="interactive-body">
      <svg
        ref={svgRef}
        viewBox="0 0 480 260"
        className="interactive-svg"
        onPointerMove={updateR}
        onPointerUp={() => (dragging.current = false)}
      >
        <g style={{ transform: `rotate(${doorAngle}deg)`, transformOrigin: `${HINGE_X}px ${HINGE_Y}px`, transition: 'transform 0.25s ease' }}>
          <line x1={HINGE_X} y1={HINGE_Y} x2={HINGE_X + ARM_PX} y2={HINGE_Y} stroke="var(--text-dim)" strokeWidth={6} strokeLinecap="round" />
        </g>
        <circle cx={HINGE_X} cy={HINGE_Y} r={7} fill="var(--text-h)" />

        {/* force vector */}
        <line x1={handleX} y1={HINGE_Y} x2={fx} y2={fy} stroke="#d1453d" strokeWidth={3} markerEnd="url(#torque-arrow)" />
        {/* perpendicular component, dashed */}
        <line x1={handleX} y1={HINGE_Y} x2={perpX} y2={perpY} stroke="#1a9d5c" strokeWidth={2} strokeDasharray="5 4" />
        <defs>
          <marker id="torque-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="#d1453d" />
          </marker>
        </defs>

        <circle
          cx={handleX}
          cy={HINGE_Y}
          r={9}
          fill="#2f6fed"
          style={{ cursor: 'ew-resize' }}
          onPointerDown={(e) => {
            dragging.current = true;
            (e.target as Element).setPointerCapture(e.pointerId);
          }}
        />
      </svg>

      <div className="interactive-controls-grid">
        <label>
          Lever arm r: {r.toFixed(2)} m (drag the blue handle)
        </label>
        <label>
          Force: {force} N
          <input type="range" min={0} max={50} value={force} onChange={(e) => setForce(Number(e.target.value))} />
        </label>
        <label>
          Angle θ (force vs. arm): {angle}°
          <input type="range" min={0} max={180} value={angle} onChange={(e) => setAngle(Number(e.target.value))} />
        </label>
      </div>

      <div className="interactive-readout">
        <p>
          τ = r · F · sin(θ) = {r} × {force} × sin({angle}°) = <strong>{torque} N·m</strong>
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>
          Green dashed line: the perpendicular component of the force (F⊥) — only this part contributes to rotation.
        </p>
      </div>

      <div className="interactive-divider" />

      <h3 className="interactive-subheading">Robotics Connection: Can the joint lift the payload?</h3>
      <div className="interactive-controls-grid">
        <label>
          Motor torque: {motorTorque} Nm
          <input type="range" min={0.1} max={5} step={0.1} value={motorTorque} onChange={(e) => setMotorTorque(Number(e.target.value))} />
        </label>
        <label>
          Gear ratio: {gearRatio}:1
          <input type="range" min={1} max={100} value={gearRatio} onChange={(e) => setGearRatio(Number(e.target.value))} />
        </label>
        <label>
          Arm length: {armLength} m
          <input type="range" min={0.1} max={1} step={0.05} value={armLength} onChange={(e) => setArmLength(Number(e.target.value))} />
        </label>
        <label>
          Payload: {payload} kg
          <input type="range" min={0.1} max={10} step={0.1} value={payload} onChange={(e) => setPayload(Number(e.target.value))} />
        </label>
      </div>
      <div className="interactive-readout">
        <p>Available joint torque = motor torque × gear ratio = {jointTorque} Nm</p>
        <p>Required torque = payload weight × arm length = {requiredTorque} Nm</p>
        <p className={canLift ? 'feedback-correct' : 'feedback-incorrect'}>
          {canLift ? 'Yes — the joint can lift this payload.' : 'No — the joint stalls under this payload.'}
        </p>
      </div>
    </div>
  );
}
