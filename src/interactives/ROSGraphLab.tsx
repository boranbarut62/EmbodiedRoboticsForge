import { useEffect, useRef, useState } from 'react';

type NodeId = 'camera_driver' | 'encoder_driver' | 'perception' | 'logger' | 'controller' | 'motor_driver';

const NODES: Record<NodeId, { x: number; y: number }> = {
  camera_driver: { x: 80, y: 60 },
  perception: { x: 270, y: 60 },
  logger: { x: 270, y: 150 },
  encoder_driver: { x: 80, y: 235 },
  controller: { x: 450, y: 150 },
  motor_driver: { x: 630, y: 150 },
};

const TOPICS: { name: string; publisher: NodeId; subscribers: NodeId[] }[] = [
  { name: '/image_raw', publisher: 'camera_driver', subscribers: ['perception', 'logger'] },
  { name: '/target_pose', publisher: 'perception', subscribers: ['controller'] },
  { name: '/joint_states', publisher: 'encoder_driver', subscribers: ['controller'] },
  { name: '/cmd_torque', publisher: 'controller', subscribers: ['motor_driver'] },
];

const TRAVEL_SECONDS = 0.5;
const STALE_SECONDS = 1.0;
const ENCODER_HZ = 8;

interface Message {
  topic: string;
  from: NodeId;
  to: NodeId;
  progress: number;
}

const ALL_ALIVE: Record<NodeId, boolean> = {
  camera_driver: true,
  encoder_driver: true,
  perception: true,
  logger: true,
  controller: true,
  motor_driver: true,
};

export function ROSGraphLab() {
  const [alive, setAlive] = useState(ALL_ALIVE);
  const [cameraHz, setCameraHz] = useState(4);
  const [, setFrame] = useState(0);

  const aliveRef = useRef(alive);
  aliveRef.current = alive;
  const cameraHzRef = useRef(cameraHz);
  cameraHzRef.current = cameraHz;

  const timeRef = useRef(0);
  const messagesRef = useRef<Message[]>([]);
  const lastRxRef = useRef<Partial<Record<NodeId, Record<string, number>>>>({});
  const lastPubRef = useRef<Partial<Record<NodeId, number>>>({});
  const pubTimesRef = useRef<Record<string, number[]>>({});
  const loggedRef = useRef(0);
  const frame = useRef<number>(0);
  const lastTime = useRef<number | null>(null);

  useEffect(() => {
    function publish(topicName: string) {
      const topic = TOPICS.find((tp) => tp.name === topicName)!;
      const t = timeRef.current;
      const times = pubTimesRef.current[topicName] ?? [];
      pubTimesRef.current[topicName] = [...times.filter((x) => t - x < 2), t];
      for (const to of topic.subscribers) {
        if (aliveRef.current[to]) messagesRef.current.push({ topic: topicName, from: topic.publisher, to, progress: 0 });
      }
    }

    function received(node: NodeId, topic: string) {
      const rx = lastRxRef.current[node];
      return rx?.[topic] !== undefined && timeRef.current - rx[topic] < STALE_SECONDS;
    }

    function deliver(msg: Message) {
      if (!aliveRef.current[msg.to]) return;
      lastRxRef.current[msg.to] = { ...(lastRxRef.current[msg.to] ?? {}), [msg.topic]: timeRef.current };
      if (msg.to === 'perception' && msg.topic === '/image_raw') publish('/target_pose');
      if (msg.to === 'logger') loggedRef.current++;
      if (msg.to === 'controller' && msg.topic === '/joint_states' && received('controller', '/target_pose')) publish('/cmd_torque');
    }

    function tick(now: number) {
      if (lastTime.current === null) lastTime.current = now;
      const dt = Math.min(0.05, (now - lastTime.current) / 1000);
      lastTime.current = now;
      timeRef.current += dt;
      const t = timeRef.current;

      const sources: [NodeId, string, number][] = [
        ['camera_driver', '/image_raw', cameraHzRef.current],
        ['encoder_driver', '/joint_states', ENCODER_HZ],
      ];
      for (const [node, topic, hz] of sources) {
        if (aliveRef.current[node] && t - (lastPubRef.current[node] ?? -Infinity) >= 1 / hz) {
          lastPubRef.current[node] = t;
          publish(topic);
        }
      }

      const stillFlying: Message[] = [];
      for (const msg of messagesRef.current) {
        msg.progress += dt / TRAVEL_SECONDS;
        if (msg.progress >= 1) deliver(msg);
        else stillFlying.push(msg);
      }
      messagesRef.current = stillFlying;

      setFrame((f) => f + 1);
      frame.current = requestAnimationFrame(tick);
    }

    frame.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame.current);
      lastTime.current = null;
    };
  }, []);

  function toggle(node: NodeId) {
    setAlive((a) => ({ ...a, [node]: !a[node] }));
  }

  const t = timeRef.current;
  const fresh = (node: NodeId, topic: string) => {
    const rx = lastRxRef.current[node]?.[topic];
    return rx !== undefined && t - rx < STALE_SECONDS;
  };

  function status(node: NodeId): { text: string; tone: 'ok' | 'warn' | 'dead' } {
    if (!alive[node]) return { text: 'stopped', tone: 'dead' };
    switch (node) {
      case 'camera_driver':
      case 'encoder_driver':
        return { text: 'publishing', tone: 'ok' };
      case 'perception':
      case 'logger':
        return fresh(node, '/image_raw') ? { text: 'receiving /image_raw', tone: 'ok' } : { text: 'starved: no /image_raw', tone: 'warn' };
      case 'controller': {
        const missing = ['/joint_states', '/target_pose'].filter((tp) => !fresh('controller', tp));
        return missing.length === 0 ? { text: 'publishing /cmd_torque', tone: 'ok' } : { text: `starved: no ${missing.join(', ')}`, tone: 'warn' };
      }
      case 'motor_driver':
        return fresh('motor_driver', '/cmd_torque')
          ? { text: 'driving motor', tone: 'ok' }
          : { text: 'no commands → safety stop', tone: 'warn' };
    }
  }

  const toneColor = { ok: '#1a9d5c', warn: '#e0a100', dead: 'var(--text-dim)' };

  return (
    <div className="interactive-body">
      <svg viewBox="0 0 700 280" className="interactive-svg" style={{ maxWidth: 700 }}>
        {TOPICS.flatMap((topic) =>
          topic.subscribers.map((sub) => {
            const a = NODES[topic.publisher];
            const b = NODES[sub];
            return (
              <g key={`${topic.name}-${sub}`}>
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="var(--border)" strokeWidth={2} />
                <text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 - 6} fontSize="10" fill="var(--text-dim)" textAnchor="middle">
                  {topic.name}
                </text>
              </g>
            );
          })
        )}

        {messagesRef.current.map((msg, i) => {
          const a = NODES[msg.from];
          const b = NODES[msg.to];
          return <circle key={i} cx={a.x + (b.x - a.x) * msg.progress} cy={a.y + (b.y - a.y) * msg.progress} r={4} fill="#2f6fed" />;
        })}

        {(Object.keys(NODES) as NodeId[]).map((id) => {
          const { x, y } = NODES[id];
          const s = status(id);
          return (
            <g key={id} onClick={() => toggle(id)} style={{ cursor: 'pointer' }}>
              <rect x={x - 62} y={y - 20} width={124} height={40} rx={8} fill="var(--surface)" stroke={toneColor[s.tone]} strokeWidth={2.5} />
              <text x={x} y={y - 3} fontSize="11" fontWeight={600} fill={alive[id] ? 'var(--text-h)' : 'var(--text-dim)'} textAnchor="middle">
                {id}
              </text>
              <text x={x} y={y + 12} fontSize="8.5" fill={toneColor[s.tone]} textAnchor="middle">
                {s.text}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="interactive-controls">
        {(Object.keys(NODES) as NodeId[]).map((id) => (
          <button key={id} type="button" className={'btn btn-toggle' + (alive[id] ? ' btn-toggle-active' : '')} onClick={() => toggle(id)}>
            {alive[id] ? 'Kill' : 'Restart'} {id}
          </button>
        ))}
      </div>

      <div className="interactive-controls-grid">
        <label>
          Camera publish rate: {cameraHz} Hz
          <input type="range" min={1} max={10} value={cameraHz} onChange={(e) => setCameraHz(Number(e.target.value))} />
        </label>
      </div>

      <div className="interactive-readout">
        {TOPICS.map((topic) => {
          const recent = (pubTimesRef.current[topic.name] ?? []).filter((x) => t - x < 2).length;
          return (
            <p key={topic.name}>
              <strong>{topic.name}</strong> ({topic.publisher} → {topic.subscribers.join(', ')}): {(recent / 2).toFixed(1)} Hz
            </p>
          );
        })}
        <p>Messages recorded by logger: {loggedRef.current}</p>
      </div>
    </div>
  );
}
