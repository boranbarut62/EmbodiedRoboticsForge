import { useEffect, useRef, useState } from 'react';

const CX = 90;
const CY = 90;
const R_OUTER = 60;
const R_INNER = 20;

function wedgePath(startDeg: number, endDeg: number) {
  const toXY = (deg: number, r: number) => {
    const rad = (deg * Math.PI) / 180;
    return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
  };
  const [x1, y1] = toXY(startDeg, R_OUTER);
  const [x2, y2] = toXY(endDeg, R_OUTER);
  const [x3, y3] = toXY(endDeg, R_INNER);
  const [x4, y4] = toXY(startDeg, R_INNER);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${R_OUTER} ${R_OUTER} 0 ${large} 1 ${x2} ${y2} L ${x3} ${y3} A ${R_INNER} ${R_INNER} 0 ${large} 0 ${x4} ${y4} Z`;
}

export function EncoderLab() {
  const [segments, setSegments] = useState(8);
  const [rpm, setRpm] = useState(15);
  const [trueAngle, setTrueAngle] = useState(0);
  const [pulseCount, setPulseCount] = useState(0);

  const angleTotalRef = useRef(0);
  const frame = useRef<number>(0);
  const lastTime = useRef<number | null>(null);

  const segmentWidth = 360 / segments;

  useEffect(() => {
    function tick(t: number) {
      if (lastTime.current === null) lastTime.current = t;
      const dt = (t - lastTime.current) / 1000;
      lastTime.current = t;
      angleTotalRef.current += (rpm / 60) * 360 * dt;
      setTrueAngle(angleTotalRef.current % 360);
      setPulseCount(Math.floor(angleTotalRef.current / segmentWidth));
      frame.current = requestAnimationFrame(tick);
    }
    frame.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame.current);
      lastTime.current = null;
    };
  }, [rpm, segmentWidth]);

  const measuredAngle = (pulseCount * segmentWidth) % 360;
  const error = ((trueAngle - measuredAngle + 540) % 360) - 180;

  const wedges = Array.from({ length: segments }, (_, i) => (
    <path key={i} d={wedgePath(i * segmentWidth, (i + 1) * segmentWidth)} fill={i % 2 === 0 ? '#2f6fed' : 'var(--surface)'} stroke="var(--border)" />
  ));

  return (
    <div className="interactive-body">
      <svg viewBox="0 0 180 200" className="interactive-svg" style={{ maxWidth: 220 }}>
        <g style={{ transform: `rotate(${trueAngle}deg)`, transformOrigin: `${CX}px ${CY}px` }}>{wedges}</g>
        <polygon points={`${CX - 6},${CY - R_OUTER - 12} ${CX + 6},${CY - R_OUTER - 12} ${CX},${CY - R_OUTER - 2}`} fill="#d1453d" />
        <text x={CX} y={CY - R_OUTER - 16} fontSize="10" fill="var(--text-dim)" textAnchor="middle">
          sensor
        </text>
      </svg>

      <div className="interactive-controls-grid">
        <label>
          Rotation speed: {rpm} RPM
          <input type="range" min={1} max={60} value={rpm} onChange={(e) => setRpm(Number(e.target.value))} />
        </label>
        <label>
          Segments (encoder resolution): {segments}
          <input type="range" min={4} max={24} value={segments} onChange={(e) => setSegments(Number(e.target.value))} />
        </label>
      </div>

      <div className="interactive-readout">
        <p>
          Resolution = 360° / {segments} segments = <strong>{segmentWidth.toFixed(1)}°</strong> per pulse
        </p>
        <p>Pulse count (since start): {pulseCount}</p>
        <p>
          True angle: {trueAngle.toFixed(1)}° &nbsp;|&nbsp; Measured angle: {measuredAngle.toFixed(1)}° &nbsp;|&nbsp;
          Quantization error: {error.toFixed(1)}°
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>
          More segments shrink the error but mean more, faster pulses for the electronics to count correctly — a real
          trade-off in encoder design.
        </p>
      </div>
    </div>
  );
}
