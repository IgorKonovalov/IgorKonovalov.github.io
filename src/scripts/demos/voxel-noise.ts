// Deterministic value noise shared by the voxel engine demos, so every
// reader gets the same cave. Integer hash in, smoothstep-blended lattice out.

export function hash(x: number, y: number): number {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ 0x5bd1e995;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

export function noise(x: number, y: number, s: number): number {
  const fx = x / s;
  const fy = y / s;
  const ix = Math.floor(fx);
  const iy = Math.floor(fy);
  const tx = fx - ix;
  const ty = fy - iy;
  const sx = tx * tx * (3 - 2 * tx);
  const sy = ty * ty * (3 - 2 * ty);
  const a = hash(ix, iy) + (hash(ix + 1, iy) - hash(ix, iy)) * sx;
  const b = hash(ix, iy + 1) + (hash(ix + 1, iy + 1) - hash(ix, iy + 1)) * sx;
  return a + (b - a) * sy;
}

/** Parse a CSS colour token into RGB, via a 1×1 canvas so any syntax works. */
export function rgbOf(color: string): [number, number, number] {
  const c = document.createElement('canvas').getContext('2d');
  if (!c) return [128, 128, 128];
  c.fillStyle = color;
  c.fillRect(0, 0, 1, 1);
  const d = c.getImageData(0, 0, 1, 1).data;
  return [d[0], d[1], d[2]];
}
