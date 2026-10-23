// Each generator fills a Float32Array of `count * 3` positions. The particle
// system morphs between these targets, one per page section.

const TAU = Math.PI * 2;

export function sphere(count, radius = 2.1) {
  const out = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    // A thin shell with a few particles floating inside reads as volume.
    const shell = Math.random() < 0.85 ? 1 + (Math.random() - 0.5) * 0.05 : Math.random() * 0.9;
    out.set([Math.cos(theta) * r * radius * shell, y * radius * shell, Math.sin(theta) * r * radius * shell], i * 3);
  }
  return out;
}

export function torusKnot(count, p = 2, q = 3, scale = 0.72, tube = 0.32) {
  const out = new Float32Array(count * 3);
  const point = (t) => {
    const r = 2 + Math.cos(q * t);
    return [r * Math.cos(p * t), r * Math.sin(p * t), -Math.sin(q * t)];
  };
  for (let i = 0; i < count; i++) {
    const t = Math.random() * TAU;
    const a = point(t);
    const b = point(t + 0.001);
    // Build a frame around the curve tangent and offset into the tube.
    const tx = b[0] - a[0], ty = b[1] - a[1], tz = b[2] - a[2];
    const tl = Math.hypot(tx, ty, tz);
    const T = [tx / tl, ty / tl, tz / tl];
    let N = [-T[1], T[0], 0];
    const nl = Math.hypot(N[0], N[1], N[2]) || 1;
    N = [N[0] / nl, N[1] / nl, N[2] / nl];
    const B = [T[1] * N[2] - T[2] * N[1], T[2] * N[0] - T[0] * N[2], T[0] * N[1] - T[1] * N[0]];
    const ang = Math.random() * TAU;
    const rr = tube * Math.sqrt(Math.random());
    out.set([
      (a[0] + (N[0] * Math.cos(ang) + B[0] * Math.sin(ang)) * rr) * scale,
      (a[1] + (N[1] * Math.cos(ang) + B[1] * Math.sin(ang)) * rr) * scale,
      (a[2] + (N[2] * Math.cos(ang) + B[2] * Math.sin(ang)) * rr) * scale,
    ], i * 3);
  }
  return out;
}

export function waveField(count, width = 16, depth = 9) {
  const out = new Float32Array(count * 3);
  const cols = Math.ceil(Math.sqrt(count * (width / depth)));
  const rows = Math.ceil(count / cols);
  for (let i = 0; i < count; i++) {
    const cx = (i % cols) / (cols - 1) - 0.5;
    const cz = Math.floor(i / cols) / (rows - 1) - 0.5;
    const x = cx * width;
    const z = cz * depth;
    const y = Math.sin(x * 0.55) * 0.45 + Math.cos(z * 0.8 + x * 0.2) * 0.35 - 1.6;
    out.set([x, y, z - 1], i * 3);
  }
  return out;
}

export function helix(count, height = 6.4, radius = 1.15, turns = 3.2) {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = Math.random();
    const t = Math.random();
    const ang = t * turns * TAU;
    const y = (t - 0.5) * height;
    if (r < 0.8) {
      // The two strands.
      const strand = r < 0.4 ? 0 : Math.PI;
      const j = () => (Math.random() - 0.5) * 0.12;
      out.set([Math.cos(ang + strand) * radius + j(), y + j(), Math.sin(ang + strand) * radius + j()], i * 3);
    } else {
      // Rungs between strands, snapped to evenly spaced steps.
      const step = Math.round(t * 44) / 44;
      const a = step * turns * TAU;
      const s = Math.random() * 2 - 1;
      out.set([Math.cos(a) * radius * s, (step - 0.5) * height, Math.sin(a) * radius * s], i * 3);
    }
  }
  return out;
}

export function galaxy(count, radius = 4.6, arms = 4) {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = Math.pow(Math.random(), 1.6) * radius;
    const arm = ((i % arms) / arms) * TAU;
    const spin = r * 1.1;
    const spread = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5 * (1 + r * 0.3);
    const spreadY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.35;
    const spreadZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.5 * (1 + r * 0.3);
    out.set([Math.cos(arm + spin) * r + spread, spreadY, Math.sin(arm + spin) * r + spreadZ], i * 3);
  }
  return out;
}

// Samples filled pixels of text drawn on a 2D canvas.
export function text(count, str, width = 6.4) {
  const out = new Float32Array(count * 3);
  const canvas = document.createElement('canvas');
  const W = 512, H = 256;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  let size = 220;
  ctx.font = `700 ${size}px "Space Grotesk", system-ui, sans-serif`;
  while (ctx.measureText(str).width > W * 0.92 && size > 40) {
    size -= 8;
    ctx.font = `700 ${size}px "Space Grotesk", system-ui, sans-serif`;
  }
  ctx.fillText(str, W / 2, H / 2 + size * 0.04);

  const data = ctx.getImageData(0, 0, W, H).data;
  const filled = [];
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      if (data[(y * W + x) * 4 + 3] > 128) filled.push(x, y);
    }
  }
  if (filled.length === 0) return sphere(count);

  const scale = width / W;
  for (let i = 0; i < count; i++) {
    const k = Math.floor(Math.random() * (filled.length / 2)) * 2;
    const x = (filled[k] + Math.random() * 2 - W / 2) * scale;
    const y = -(filled[k + 1] + Math.random() * 2 - H / 2) * scale;
    out.set([x, y, (Math.random() - 0.5) * 0.35], i * 3);
  }
  return out;
}
