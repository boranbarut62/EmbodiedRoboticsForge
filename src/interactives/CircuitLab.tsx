import { useState } from 'react';

function formatCurrent(amps: number) {
  return amps < 1 ? `${(amps * 1000).toFixed(1)} mA` : `${amps.toFixed(2)} A`;
}

function formatPower(watts: number) {
  return watts < 1 ? `${(watts * 1000).toFixed(1)} mW` : `${watts.toFixed(2)} W`;
}

const LOOP_PATH = 'M 60 40 H 340 V 160 H 60 Z';

export function CircuitLab() {
  const [voltage, setVoltage] = useState(6);
  const [resistance, setResistance] = useState(200);

  const current = voltage / resistance;
  const power = voltage * current;
  // More current -> faster dash movement. Clamp so it never goes to 0 or absurdly fast.
  const period = Math.max(0.15, Math.min(6, 3 / (current * 1000 + 0.05)));

  return (
    <div className="interactive-body">
      <svg viewBox="0 0 400 220" className="interactive-svg">
        <path d={LOOP_PATH} fill="none" stroke="var(--border)" strokeWidth={4} />
        <path
          d={LOOP_PATH}
          fill="none"
          stroke="#2f6fed"
          strokeWidth={4}
          strokeLinecap="round"
          strokeDasharray="10 16"
          style={{
            animation: `erf-dash ${period}s linear infinite`,
            animationPlayState: current > 0.0001 ? 'running' : 'paused',
          }}
        />

        {/* battery symbol on the left wire */}
        <line x1={50} y1={85} x2={70} y2={85} stroke="var(--text-h)" strokeWidth={3} />
        <line x1={55} y1={70} x2={55} y2={100} stroke="var(--text-h)" strokeWidth={3} />
        <line x1={65} y1={78} x2={65} y2={92} stroke="var(--text-h)" strokeWidth={3} />
        <text x={30} y="88" fontSize="12" fill="var(--text-dim)">
          +
        </text>

        {/* resistor zigzag on the top wire */}
        <polyline
          points="150,40 160,28 170,52 180,28 190,52 200,28 210,40"
          fill="none"
          stroke="var(--text-h)"
          strokeWidth={3}
        />
        <text x={155} y="20" fontSize="12" fill="var(--text-dim)">
          R
        </text>
      </svg>

      <div className="interactive-controls-grid">
        <label>
          Voltage: {voltage.toFixed(1)} V
          <input type="range" min={1} max={12} step={0.5} value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} />
        </label>
        <label>
          Resistance: {resistance} Ω
          <input type="range" min={10} max={1000} step={10} value={resistance} onChange={(e) => setResistance(Number(e.target.value))} />
        </label>
      </div>

      <div className="interactive-readout">
        <p>
          Current = V / R = {voltage.toFixed(1)} / {resistance} = <strong>{formatCurrent(current)}</strong>
        </p>
        <p>
          Power = V × I = <strong>{formatPower(power)}</strong>
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>
          The blue dashes flow faster as current increases — that is the same "flow rate" from the water-pipe analogy.
        </p>
      </div>
    </div>
  );
}
