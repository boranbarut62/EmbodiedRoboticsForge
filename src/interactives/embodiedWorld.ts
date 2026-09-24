export const W = 520;
export const H = 300;
export const WALL = { x: 240, y: 80, w: 50, h: 140 };
export const RANGE = 240;
const MAX_SPEED = 70;
const MAX_TURN = 2.5;
const PERCEPTION_HZ = 10;
const REACH = 16;
const CORNER_MARGIN = 22;
/** The agent's collision clearance; path checks use the same value so plans match reality. */
const CLEARANCE = 12;
const SCAN_RATE = 1.8;
const TRAVEL_TIMEOUT = 8;

export interface Vec {
  x: number;
  y: number;
}

export interface Params {
  fov: number; // degrees
  noise: number; // px, std dev of detection noise
  gain: number; // world-model update gain K
  memory: boolean;
}

export type Decision = 'approach' | 'scan' | 'relocate';

export interface World {
  agent: Vec & { heading: number };
  target: Vec;
  belief: Vec | null;
  lastSeen: number | null;
  time: number;
  perceptionAcc: number;
  reached: number;
  visible: boolean;
  detection: Vec | null;
  decision: Decision;
  via: Vec | null;
  turn: number;
  speed: number;
  search: { phase: 'scan' | 'relocate'; turned: number; goal: Vec | null; elapsed: number };
  blockedTime: number;
  /** Recent places the agent completed a full scan from, used to pick fresh vantage points. */
  scannedFrom: Vec[];
  /** A committed short-term goal used to get unstuck from the wall. */
  detour: { goal: Vec; until: number } | null;
}

export const dist = (a: Vec, b: Vec) => Math.hypot(a.x - b.x, a.y - b.y);

export function wrapAngle(a: number) {
  while (a > Math.PI) a -= 2 * Math.PI;
  while (a < -Math.PI) a += 2 * Math.PI;
  return a;
}

export function insideWall(p: Vec, pad: number) {
  return p.x > WALL.x - pad && p.x < WALL.x + WALL.w + pad && p.y > WALL.y - pad && p.y < WALL.y + WALL.h + pad;
}

function segmentHitsWall(a: Vec, b: Vec, pad: number) {
  for (let i = 1; i <= 40; i++) {
    const t = i / 40;
    if (insideWall({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t }, pad)) return true;
  }
  return false;
}

function gaussian(rand: () => number) {
  const u = 1 - rand();
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function randomFreePoint(awayFrom: Vec, minDist: number, rand: () => number): Vec {
  for (;;) {
    const p = { x: 30 + rand() * (W - 60), y: 30 + rand() * (H - 60) };
    if (!insideWall(p, 25) && dist(p, awayFrom) > minDist) return p;
  }
}

/** Route around the wall via the corner of an inflated box that best shortens the trip. */
function waypoint(from: Vec, goal: Vec): Vec | null {
  if (!segmentHitsWall(from, goal, CLEARANCE)) return null;
  const m = CORNER_MARGIN;
  const corners = [
    { x: WALL.x - m, y: WALL.y - m },
    { x: WALL.x + WALL.w + m, y: WALL.y - m },
    { x: WALL.x - m, y: WALL.y + WALL.h + m },
    { x: WALL.x + WALL.w + m, y: WALL.y + WALL.h + m },
  ].filter((c) => dist(c, from) > 12 && !segmentHitsWall(from, c, CLEARANCE));
  if (corners.length === 0) return null;
  return corners.reduce((best, c) => (dist(from, c) + dist(c, goal) < dist(from, best) + dist(best, goal) ? c : best));
}

/** Frontier-style exploration: of several candidates, go where we have looked from least. */
function nextVantagePoint(w: World, rand: () => number): Vec {
  let best = randomFreePoint(w.agent, 140, rand);
  let bestScore = -1;
  for (let i = 0; i < 12; i++) {
    const c = randomFreePoint(w.agent, 140, rand);
    const score = Math.min(...w.scannedFrom.map((s) => dist(s, c)));
    if (score > bestScore) {
      best = c;
      bestScore = score;
    }
  }
  return best;
}

function detourCorner(from: Vec, goal: Vec): Vec {
  const m = CORNER_MARGIN;
  const corners = [
    { x: WALL.x - m, y: WALL.y - m },
    { x: WALL.x + WALL.w + m, y: WALL.y - m },
    { x: WALL.x - m, y: WALL.y + WALL.h + m },
    { x: WALL.x + WALL.w + m, y: WALL.y + WALL.h + m },
  ].filter((c) => dist(c, from) > 12);
  return corners.reduce((best, c) => (dist(from, c) + dist(c, goal) < dist(from, best) + dist(best, goal) ? c : best));
}

export function createWorld(): World {
  return {
    agent: { x: 60, y: 150, heading: 0 },
    target: { x: 440, y: 150 },
    belief: null,
    lastSeen: null,
    time: 0,
    perceptionAcc: 0,
    reached: 0,
    visible: false,
    detection: null,
    decision: 'scan',
    via: null,
    turn: 0,
    speed: 0,
    search: { phase: 'scan', turned: 0, goal: null, elapsed: 0 },
    blockedTime: 0,
    scannedFrom: [],
    detour: null,
  };
}

function canSee(w: World, fovDeg: number) {
  const { agent, target } = w;
  if (dist(agent, target) > RANGE) return false;
  const bearing = wrapAngle(Math.atan2(target.y - agent.y, target.x - agent.x) - agent.heading);
  if (Math.abs(bearing) > ((fovDeg / 2) * Math.PI) / 180) return false;
  return !segmentHitsWall(agent, target, 0);
}

function driveToward(w: World, goal: Vec) {
  const via = waypoint(w.agent, goal);
  const aim = via ?? goal;
  const err = wrapAngle(Math.atan2(aim.y - w.agent.y, aim.x - w.agent.x) - w.agent.heading);
  w.via = via;
  w.turn = Math.max(-MAX_TURN, Math.min(MAX_TURN, 3 * err));
  w.speed = MAX_SPEED * Math.max(0, Math.cos(err)) * Math.min(1, dist(w.agent, aim) / 50);
}

/** Advance the whole sense → perceive → model → decide → control → act loop by dt seconds. */
export function stepWorld(w: World, p: Params, dt: number, rand: () => number = Math.random) {
  w.time += dt;

  // SENSE + PERCEIVE at a fixed rate, like a real camera pipeline.
  w.perceptionAcc += dt;
  if (w.perceptionAcc >= 1 / PERCEPTION_HZ) {
    w.perceptionAcc = 0;
    w.visible = canSee(w, p.fov);
    if (w.visible) {
      // The world model knows the room's bounds, so it clamps physically impossible estimates.
      const z = {
        x: Math.max(10, Math.min(W - 10, w.target.x + p.noise * gaussian(rand))),
        y: Math.max(10, Math.min(H - 10, w.target.y + p.noise * gaussian(rand))),
      };
      w.detection = z;
      w.belief = w.belief ? { x: w.belief.x + p.gain * (z.x - w.belief.x), y: w.belief.y + p.gain * (z.y - w.belief.y) } : z;
      w.lastSeen = w.time;
    } else {
      w.detection = null;
      if (!p.memory) w.belief = null;
    }
  }

  // WORLD MODEL: a remembered position that turns out to be empty is discarded.
  if (w.belief && !w.visible && dist(w.agent, w.belief) < REACH) w.belief = null;

  // DECIDE + CONTROL
  w.via = null;
  if (w.belief) {
    w.decision = 'approach';
    w.search = { phase: 'scan', turned: 0, goal: null, elapsed: 0 };
    if (w.detour && w.time > w.detour.until) w.detour = null;
    driveToward(w, w.detour ? w.detour.goal : w.belief);
  } else if (w.search.phase === 'scan') {
    // Active perception, part 1: turn a full circle to look everywhere from here.
    w.decision = 'scan';
    w.turn = SCAN_RATE;
    w.speed = 0;
    w.search.turned += SCAN_RATE * dt;
    if (w.search.turned >= 2 * Math.PI) {
      w.scannedFrom = [...w.scannedFrom, { x: w.agent.x, y: w.agent.y }].slice(-6);
      w.search = { phase: 'relocate', turned: 0, goal: nextVantagePoint(w, rand), elapsed: 0 };
    }
  } else {
    // Active perception, part 2: nothing visible from here, so move to a new vantage point.
    w.decision = 'relocate';
    const goal = w.search.goal!;
    w.search.elapsed += dt;
    driveToward(w, goal);
    if (dist(w.agent, goal) < 15 || w.search.elapsed > TRAVEL_TIMEOUT) {
      w.search = { phase: 'scan', turned: 0, goal: null, elapsed: 0 };
    }
  }

  // ACT
  const a = w.agent;
  a.heading = wrapAngle(a.heading + w.turn * dt);
  const nx = a.x + Math.cos(a.heading) * w.speed * dt;
  const ny = a.y + Math.sin(a.heading) * w.speed * dt;
  const isFree = (p: Vec) => p.x > 15 && p.x < W - 15 && p.y > 15 && p.y < H - 15 && !insideWall(p, CLEARANCE);
  // Collision sliding: if the full step is blocked, try moving along just one axis.
  const move = [{ x: nx, y: ny }, { x: nx, y: a.y }, { x: a.x, y: ny }].find(isFree);
  if (move) {
    a.x = move.x;
    a.y = move.y;
  }

  // Blocked while chasing something: the target is unreachable this way, so replan.
  w.blockedTime = !move && w.speed > 5 ? w.blockedTime + dt : 0;
  if (w.blockedTime > 1) {
    w.blockedTime = 0;
    if (w.decision === 'approach' && w.belief) {
      if (w.visible) w.detour = { goal: detourCorner(a, w.belief), until: w.time + 2.5 };
      else w.belief = null;
    }
    if (w.decision === 'relocate') w.search = { phase: 'scan', turned: 0, goal: null, elapsed: 0 };
  }

  if (dist(a, w.target) < REACH) {
    w.reached++;
    w.target = randomFreePoint(a, 150, rand);
    w.belief = null;
    w.detour = null;
  }
}
