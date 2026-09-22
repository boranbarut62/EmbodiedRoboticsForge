import { useEffect, useRef, useState } from 'react';

const LEFT_WALL = 30;
const RIGHT_WALL = 370;
const SENSOR_RANGE = 45;
const SPEED = 90; // px per second

type Mode = 'open' | 'closed';

export function SenseThinkActDemo() {
  const [mode, setMode] = useState<Mode>('open');
  const [running, setRunning] = useState(true);
  const [renderX, setRenderX] = useState(LEFT_WALL + 10);
  const [crashed, setCrashed] = useState(false);
  const [activeStage, setActiveStage] = useState<'sense' | 'think' | 'act'>('sense');

  const xRef = useRef(LEFT_WALL + 10);
  const dirRef = useRef(1);
  const crashedRef = useRef(false);
  const lastTime = useRef<number | null>(null);
  const frame = useRef<number>(0);

  useEffect(() => {
    if (!running) return;

    function tick(t: number) {
      if (lastTime.current === null) lastTime.current = t;
      const dt = (t - lastTime.current) / 1000;
      lastTime.current = t;

      if (mode === 'open') {
        if (!crashedRef.current) {
          xRef.current += SPEED * dt;
          if (xRef.current >= RIGHT_WALL) {
            xRef.current = RIGHT_WALL;
            crashedRef.current = true;
            setCrashed(true);
          }
        }
      } else {
        const distRight = RIGHT_WALL - xRef.current;
        const distLeft = xRef.current - LEFT_WALL;
        if (dirRef.current > 0 && distRight < SENSOR_RANGE) {
          dirRef.current = -1;
          setActiveStage('think');
        }
        if (dirRef.current < 0 && distLeft < SENSOR_RANGE) {
          dirRef.current = 1;
          setActiveStage('think');
        }
        xRef.current += SPEED * dirRef.current * dt;
      }

      setRenderX(xRef.current);
      frame.current = requestAnimationFrame(tick);
    }

    frame.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame.current);
      lastTime.current = null;
    };
  }, [running, mode]);

  useEffect(() => {
    if (mode !== 'closed') return;
    const id = setInterval(() => setActiveStage((s) => (s === 'sense' ? 'act' : 'sense')), 500);
    return () => clearInterval(id);
  }, [mode]);

  function reset(nextMode: Mode) {
    xRef.current = LEFT_WALL + 10;
    dirRef.current = 1;
    crashedRef.current = false;
    setMode(nextMode);
    setRenderX(xRef.current);
    setCrashed(false);
    setRunning(true);
  }

  const distToRight = Math.max(0, RIGHT_WALL - renderX);
  const dir = dirRef.current;

  return (
    <div className="interactive-body">
      <div className="interactive-controls">
        <button type="button" className={'btn btn-toggle' + (mode === 'open' ? ' btn-toggle-active' : '')} onClick={() => reset('open')}>
          Open-Loop (No Sensor)
        </button>
        <button type="button" className={'btn btn-toggle' + (mode === 'closed' ? ' btn-toggle-active' : '')} onClick={() => reset('closed')}>
          Closed-Loop (Sense → Think → Act)
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => setRunning((r) => !r)}>
          {running ? 'Pause' : 'Resume'}
        </button>
      </div>

      <svg viewBox="0 0 400 100" className="interactive-svg">
        <line x1={LEFT_WALL} y1={20} x2={LEFT_WALL} y2={80} stroke="var(--text-dim)" strokeWidth={4} />
        <line x1={RIGHT_WALL} y1={20} x2={RIGHT_WALL} y2={80} stroke="var(--text-dim)" strokeWidth={4} />
        {mode === 'closed' && (
          <line
            x1={renderX}
            y1={50}
            x2={dir > 0 ? Math.min(RIGHT_WALL, renderX + SENSOR_RANGE) : Math.max(LEFT_WALL, renderX - SENSOR_RANGE)}
            y2={50}
            stroke="#1a9d5c"
            strokeWidth={2}
            strokeDasharray="4 3"
          />
        )}
        <circle cx={renderX} cy={50} r={12} fill={crashed ? '#d1453d' : '#2f6fed'} />
      </svg>

      <div className="interactive-readout">
        {mode === 'open' ? (
          <p className={crashed ? 'feedback-incorrect' : undefined}>
            {crashed
              ? 'Crashed — no sensor means no feedback, so the "robot" never knew the wall was there.'
              : 'Moving forward on a fixed plan, blind to the wall ahead.'}
          </p>
        ) : (
          <>
            <p>Sensor reading: {distToRight.toFixed(0)} px to the nearest wall ahead</p>
            <p>
              Loop stage: <strong>{activeStage.toUpperCase()}</strong> — continuously sensing distance, deciding whether
              to turn, and acting by continuing or reversing direction.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
