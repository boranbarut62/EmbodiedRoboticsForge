import { useEffect, useRef, useState } from 'react';

const GRAPH_W = 360;
const GRAPH_H = 90;
const SUPPLY_VOLTAGE = 5;

export function PWMLab() {
  const [duty, setDuty] = useState(50);
  const [frequency, setFrequency] = useState(4);
  const [samples, setSamples] = useState<number[]>([]);
  const [avgDisplay, setAvgDisplay] = useState(0);

  const timeRef = useRef(0);
  const avgRef = useRef(0);
  const frame = useRef<number>(0);
  const lastTime = useRef<number | null>(null);

  useEffect(() => {
    function tick(t: number) {
      if (lastTime.current === null) lastTime.current = t;
      const dt = Math.min(0.05, (t - lastTime.current) / 1000);
      lastTime.current = t;

      timeRef.current += dt;
      const phase = (timeRef.current * frequency) % 1;
      const signal = phase < duty / 100 ? 1 : 0;

      // Exponential moving average simulates a motor/LED's physical inertia
      // smoothing out the rapid switching into an apparent steady brightness.
      // The time constant is tied to the PWM period (3 full cycles) so the
      // average always converges to the true duty cycle, at any frequency.
      const timeConstant = 3 / frequency;
      avgRef.current += (signal - avgRef.current) * Math.min(1, dt / timeConstant);
      setAvgDisplay(avgRef.current);

      setSamples((prev) => {
        const next = [...prev, signal];
        const maxSamples = 200;
        return next.length > maxSamples ? next.slice(-maxSamples) : next;
      });

      frame.current = requestAnimationFrame(tick);
    }
    frame.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame.current);
      lastTime.current = null;
    };
  }, [duty, frequency]);

  const points = samples
    .map((s, i) => {
      const x = (i / 200) * GRAPH_W;
      const y = s ? 10 : GRAPH_H - 10;
      return `${x},${y}`;
    })
    .join(' ');

  const avgVoltage = avgDisplay * SUPPLY_VOLTAGE;
  const targetVoltage = (duty / 100) * SUPPLY_VOLTAGE;

  return (
    <div className="interactive-body">
      <svg viewBox={`0 0 ${GRAPH_W} ${GRAPH_H}`} className="interactive-svg" style={{ maxWidth: GRAPH_W }}>
        <line x1={0} y1={10} x2={GRAPH_W} y2={10} stroke="var(--border)" strokeWidth={1} strokeDasharray="3 3" />
        <line x1={0} y1={GRAPH_H - 10} x2={GRAPH_W} y2={GRAPH_H - 10} stroke="var(--border)" strokeWidth={1} strokeDasharray="3 3" />
        <polyline points={points} fill="none" stroke="#2f6fed" strokeWidth={2} />
      </svg>

      <div className="interactive-controls-grid">
        <label>
          Duty cycle: {duty}%
          <input type="range" min={0} max={100} value={duty} onChange={(e) => setDuty(Number(e.target.value))} />
        </label>
        <label>
          Switching frequency: {frequency} Hz (slowed down for visibility — real PWM runs in the kHz range)
          <input type="range" min={1} max={10} value={frequency} onChange={(e) => setFrequency(Number(e.target.value))} />
        </label>
      </div>

      <div className="interactive-body" style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
        <svg viewBox="0 0 80 80" style={{ width: 80, height: 80, flexShrink: 0 }}>
          <circle cx={40} cy={40} r={30} fill="#f2c744" opacity={Math.max(0.05, avgDisplay)} />
          <circle cx={40} cy={40} r={30} fill="none" stroke="var(--border)" strokeWidth={2} />
        </svg>
        <div className="interactive-readout" style={{ flex: 1 }}>
          <p>
            Average voltage = duty × supply = {(duty / 100).toFixed(2)} × {SUPPLY_VOLTAGE}V ={' '}
            <strong>{targetVoltage.toFixed(2)} V</strong>
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>
            Live smoothed average: {avgVoltage.toFixed(2)} V — the LED brightness above tracks this smoothed value, not
            the raw on/off signal in the graph.
          </p>
        </div>
      </div>
    </div>
  );
}
