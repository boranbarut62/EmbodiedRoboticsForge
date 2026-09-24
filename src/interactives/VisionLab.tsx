import { useEffect, useMemo, useRef, useState } from 'react';
import { mulberry32 } from '../lib/random';

const W = 160;
const H = 100;

type Stage = 'original' | 'blur' | 'threshold' | 'edges';

const STAGE_LABELS: Record<Stage, string> = {
  original: '1. Grayscale (noisy)',
  blur: '2. Blur',
  threshold: '3a. Threshold',
  edges: '3b. Sobel Edges',
};

function makeScene(noise: number) {
  const img = new Float32Array(W * H);
  const rand = mulberry32(42);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let v = 40 + 50 * (x / W);
      if (x >= 20 && x < 60 && y >= 18 && y < 68) v = 200;
      const dx = x - 108;
      const dy = y - 45;
      if (dx * dx + dy * dy < 22 * 22) v = 15;
      if (y >= 84 && y < 88) v = 230;
      v += (rand() - 0.5) * 2 * noise;
      img[y * W + x] = v;
    }
  }
  return img;
}

function at(src: Float32Array, x: number, y: number) {
  const cx = Math.max(0, Math.min(W - 1, x));
  const cy = Math.max(0, Math.min(H - 1, y));
  return src[cy * W + cx];
}

function boxBlur(src: Float32Array, r: number) {
  if (r === 0) return src;
  const size = 2 * r + 1;
  const horiz = new Float32Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let sum = 0;
      for (let k = -r; k <= r; k++) sum += at(src, x + k, y);
      horiz[y * W + x] = sum / size;
    }
  }
  const out = new Float32Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let sum = 0;
      for (let k = -r; k <= r; k++) sum += at(horiz, x, y + k);
      out[y * W + x] = sum / size;
    }
  }
  return out;
}

function sobelMagnitude(src: Float32Array) {
  const out = new Float32Array(W * H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const gx =
        -at(src, x - 1, y - 1) + at(src, x + 1, y - 1) - 2 * at(src, x - 1, y) + 2 * at(src, x + 1, y) - at(src, x - 1, y + 1) + at(src, x + 1, y + 1);
      const gy =
        -at(src, x - 1, y - 1) - 2 * at(src, x, y - 1) - at(src, x + 1, y - 1) + at(src, x - 1, y + 1) + 2 * at(src, x, y + 1) + at(src, x + 1, y + 1);
      out[y * W + x] = Math.sqrt(gx * gx + gy * gy);
    }
  }
  return out;
}

export function VisionLab() {
  const [stage, setStage] = useState<Stage>('edges');
  const [noise, setNoise] = useState(30);
  const [blurRadius, setBlurRadius] = useState(0);
  const [threshold, setThreshold] = useState(120);
  const [edgeThreshold, setEdgeThreshold] = useState(150);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const scene = useMemo(() => makeScene(noise), [noise]);
  const blurred = useMemo(() => boxBlur(scene, blurRadius), [scene, blurRadius]);
  const edges = useMemo(() => sobelMagnitude(blurred), [blurred]);

  const { pixels, stat } = useMemo(() => {
    const out = new Uint8ClampedArray(W * H);
    let count = 0;
    for (let i = 0; i < W * H; i++) {
      let v: number;
      if (stage === 'original') v = scene[i];
      else if (stage === 'blur') v = blurred[i];
      else if (stage === 'threshold') v = blurred[i] > threshold ? 255 : 0;
      else v = edges[i] > edgeThreshold ? 255 : 0;
      if (v === 255) count++;
      out[i] = v;
    }
    let statText = '';
    if (stage === 'threshold') statText = `${((count / (W * H)) * 100).toFixed(1)}% of pixels classified as foreground`;
    if (stage === 'edges') statText = `${count} edge pixels detected`;
    return { pixels: out, stat: statText };
  }, [stage, scene, blurred, edges, threshold, edgeThreshold]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const image = ctx.createImageData(W, H);
    for (let i = 0; i < W * H; i++) {
      image.data[i * 4] = pixels[i];
      image.data[i * 4 + 1] = pixels[i];
      image.data[i * 4 + 2] = pixels[i];
      image.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);
  }, [pixels]);

  return (
    <div className="interactive-body">
      <div className="interactive-controls">
        {(Object.keys(STAGE_LABELS) as Stage[]).map((s) => (
          <button key={s} type="button" className={'btn btn-toggle' + (stage === s ? ' btn-toggle-active' : '')} onClick={() => setStage(s)}>
            {STAGE_LABELS[s]}
          </button>
        ))}
      </div>

      <canvas ref={canvasRef} width={W} height={H} className="pixel-canvas" />

      <div className="interactive-controls-grid">
        <label>
          Sensor noise: ±{noise}
          <input type="range" min={0} max={80} value={noise} onChange={(e) => setNoise(Number(e.target.value))} />
        </label>
        <label>
          Blur radius: {blurRadius} px ({2 * blurRadius + 1}×{2 * blurRadius + 1} kernel)
          <input type="range" min={0} max={3} value={blurRadius} onChange={(e) => setBlurRadius(Number(e.target.value))} />
        </label>
        <label>
          Brightness threshold: {threshold} (used by 3a)
          <input type="range" min={0} max={255} value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} />
        </label>
        <label>
          Edge threshold: {edgeThreshold} (used by 3b)
          <input type="range" min={20} max={400} value={edgeThreshold} onChange={(e) => setEdgeThreshold(Number(e.target.value))} />
        </label>
      </div>

      <div className="interactive-readout">
        <p>
          Scene: a bright box, a dark ball, and a bright floor line (the kind a line-following robot tracks), on a
          gradient background.
        </p>
        {stat && <p>{stat}</p>}
      </div>
    </div>
  );
}
