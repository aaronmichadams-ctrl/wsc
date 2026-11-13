/**
 * Rollercoaster track geometry.
 *
 * The track is built from "pieces" (each its own SVG path string), so every sample along the
 * track knows which way the rider faces and whether it is in the loop / big drop / station.
 */

export const F_LOOP = 1;
export const F_DROP = 2;
export const F_END = 4;

export type Piece = { cmds: string; x0: number; y0: number; facing: 1 | -1; flags: number };

export type SectionBox = { top: number; bottom: number; kind: string };

export type Track = {
  d: string;
  step: number;
  n: number;
  length: number;
  x: Float32Array;
  y: Float32Array;
  ang: Float32Array; // radians
  facing: Int8Array;
  flags: Uint8Array;
};

const f = (v: number) => v.toFixed(1);

class Pen {
  pieces: Piece[] = [];
  constructor(public x: number, public y: number) {}
  private push(cmds: string, nx: number, ny: number, facing: 1 | -1, flags: number) {
    this.pieces.push({ cmds, x0: this.x, y0: this.y, facing, flags });
    this.x = nx;
    this.y = ny;
  }
  line(x: number, y: number, facing: 1 | -1, flags = 0) {
    this.push(`L${f(x)} ${f(y)}`, x, y, facing, flags);
  }
  cubic(c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number, facing: 1 | -1, flags = 0) {
    this.push(`C${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(x)} ${f(y)}`, x, y, facing, flags);
  }
  arc(r: number, sweep: 0 | 1, x: number, y: number, facing: 1 | -1, flags = 0, large: 0 | 1 = 0) {
    this.push(`A${f(r)} ${f(r)} 0 ${large} ${sweep} ${f(x)} ${f(y)}`, x, y, facing, flags);
  }
  /** horizontal-tangent S-curve, the basic coaster swoop */
  swoop(x: number, y: number, facing: 1 | -1, flags = 0, k = 0.45) {
    const dx = x - this.x;
    this.cubic(this.x + dx * k, this.y, x - dx * k, y, x, y, facing, flags);
  }
  /** a vertical loop-the-loop. dir = travel direction */
  loop(R: number, dir: 1 | -1, gap = 34) {
    const sweep: 0 | 1 = dir > 0 ? 0 : 1;
    const bx = this.x;
    const by = this.y;
    this.arc(R, sweep, bx + dir * gap * 0.5, by - 2 * R, dir, F_LOOP);
    this.arc(R, sweep, bx + dir * gap, by, dir, F_LOOP);
  }
}

/* ------------------------------------------------------------------ */
/* Desktop: a long track that zig-zags down the page margins           */
/* ------------------------------------------------------------------ */
export function buildDesktopPieces(W: number, contentW: number, sections: SectionBox[]) {
  const margin = Math.max(60, (W - contentW) / 2);
  const xL = margin * 0.5;
  const xR = W - margin * 0.5;
  const r = Math.min(64, Math.max(34, margin * 0.36));
  const CROSS = 64; // how far into a section the crossing sits

  const hero = sections[0];
  let y = hero.top + 150;
  const pen = new Pen(xR - r - 170, y);
  // starting platform on top of the first hill
  pen.line(xR - r - 40, y, 1);
  pen.swoop(xR - r, y + 4, 1);
  let dir: 1 | -1 = 1;
  let endInfo = { x: pen.x, y: pen.y, dir: 1 as 1 | -1 };

  for (let i = 0; i < sections.length - 1; i++) {
    const sec = sections[i];
    const next = sections[i + 1];
    const side = dir > 0 ? xR : xL;
    const sweep: 0 | 1 = dir > 0 ? 1 : 0;
    const isDrop = sec.kind === 'drop';
    const flags = isDrop ? F_DROP : 0;
    const yBottom = next.top + CROSS - r;
    const yTop = pen.y + r;

    // over the edge
    pen.arc(r, sweep, side, yTop, dir, flags);
    // down the margin, rider flips sides at the halfway point
    const mid = (yTop + yBottom) / 2;
    const wig = isDrop ? 0 : dir * 14;
    const h1 = mid - yTop;
    pen.cubic(side + wig, yTop + h1 / 3, side - wig, yTop + (2 * h1) / 3, side, mid, dir, flags);
    pen.cubic(side + wig, mid + h1 / 3, side - wig, mid + (2 * h1) / 3, side, yBottom, (-dir) as 1 | -1, flags);
    // valley turn back toward the page
    pen.arc(r, sweep, side - dir * r, yBottom + r, (-dir) as 1 | -1, flags);
    dir = (-dir) as 1 | -1;

    // crossing at the top of `next`
    const target = (dir > 0 ? xR : xL) - dir * r;
    const span = target - pen.x;
    const yc = pen.y;
    if (next.kind === 'end') {
      const endX = pen.x + span * 0.5;
      pen.swoop(pen.x + span * 0.22, yc - 46, dir);
      pen.swoop(endX - dir * 70, yc + 26, dir);
      pen.line(endX, yc + 26, dir, F_END);
      endInfo = { x: endX, y: yc + 26, dir };
      break;
    }
    if (next.kind === 'loop') {
      pen.swoop(pen.x + span * 0.25, yc + 30, dir);
      pen.line(pen.x + dir * 30, yc + 30, dir);
      pen.loop(92, dir);
      pen.line(pen.x + dir * 30, yc + 30, dir);
      pen.swoop(pen.x + (target - pen.x) * 0.5, yc - 28, dir);
      pen.swoop(target, yc + 40, dir);
    } else if (next.kind === 'drop') {
      // a tall lift hill right before the big drop
      pen.swoop(pen.x + span * 0.3, yc + 20, dir);
      pen.swoop(pen.x + span * 0.55, yc - 150, dir);
      pen.swoop(target, yc - 150, dir, F_DROP, 0.3);
    } else {
      pen.swoop(pen.x + span * 0.38, yc - 54, dir);
      pen.swoop(target, yc + 40, dir);
    }
  }
  return { pieces: pen.pieces, endInfo };
}

/* ------------------------------------------------------------------ */
/* Mobile: a short track across the top of the screen (progress bar)   */
/* ------------------------------------------------------------------ */
export function buildMobilePieces(W: number, H: number) {
  const base = H - 12;
  const x0 = 24;
  const L = W - x0 - 30;
  const pen = new Pen(x0, base);
  pen.swoop(x0 + L * 0.14, base - 14, 1);
  pen.swoop(x0 + L * 0.3, base, 1);
  pen.swoop(x0 + L * 0.44, base - 10, 1);
  pen.swoop(x0 + L * 0.56, base, 1);
  pen.loop(12, 1, 10);
  pen.swoop(x0 + L * 0.78, base - 12, 1);
  pen.swoop(x0 + L - 26, base, 1);
  pen.line(x0 + L, base, 1, F_END);
  return { pieces: pen.pieces, endInfo: { x: pen.x, y: pen.y, dir: 1 as const } };
}

/* ------------------------------------------------------------------ */
/* Sampling                                                            */
/* ------------------------------------------------------------------ */
let measureSvg: SVGSVGElement | null = null;
function measurePath(): SVGPathElement {
  if (!measureSvg) {
    measureSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    measureSvg.setAttribute('aria-hidden', 'true');
    measureSvg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;visibility:hidden';
    document.body.appendChild(measureSvg);
  }
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  measureSvg.appendChild(p);
  return p;
}

export function sampleTrack(pieces: Piece[], step: number): Track {
  const el = measurePath();
  const lens: number[] = [];
  for (const pc of pieces) {
    el.setAttribute('d', `M${f(pc.x0)} ${f(pc.y0)} ${pc.cmds}`);
    lens.push(el.getTotalLength());
  }
  const length = lens.reduce((a, b) => a + b, 0);
  const n = Math.max(2, Math.floor(length / step) + 1);
  const x = new Float32Array(n);
  const y = new Float32Array(n);
  const ang = new Float32Array(n);
  const facing = new Int8Array(n);
  const flags = new Uint8Array(n);

  let pi = 0;
  let pStart = 0;
  el.setAttribute('d', `M${f(pieces[0].x0)} ${f(pieces[0].y0)} ${pieces[0].cmds}`);
  for (let i = 0; i < n; i++) {
    const s = Math.min(i * step, length);
    while (pi < pieces.length - 1 && s > pStart + lens[pi]) {
      pStart += lens[pi];
      pi++;
      el.setAttribute('d', `M${f(pieces[pi].x0)} ${f(pieces[pi].y0)} ${pieces[pi].cmds}`);
    }
    const pt = el.getPointAtLength(Math.max(0, s - pStart));
    x[i] = pt.x;
    y[i] = pt.y;
    facing[i] = pieces[pi].facing;
    flags[i] = pieces[pi].flags;
  }
  for (let i = 0; i < n; i++) {
    const a = Math.max(0, i - 1);
    const b = Math.min(n - 1, i + 1);
    ang[i] = Math.atan2(y[b] - y[a], x[b] - x[a]);
  }
  el.remove();
  const d = `M${f(pieces[0].x0)} ${f(pieces[0].y0)} ` + pieces.map((p) => p.cmds).join(' ');
  return { d, step, n, length, x, y, ang, facing, flags };
}

/** Offset rails (either side of the centerline) with a little hand-drawn jitter. */
export function buildRails(t: Track, gauge: number, seed = 1) {
  const make = (side: number, ph: number) => {
    const cum = new Float32Array(t.n);
    let d = '';
    let px = 0;
    let py = 0;
    for (let i = 0; i < t.n; i++) {
      const nx = -Math.sin(t.ang[i]);
      const ny = Math.cos(t.ang[i]);
      const j = Math.sin(i * 0.09 + ph + seed) * 0.7 + Math.sin(i * 0.023 + ph * 2) * 0.6;
      const off = side * gauge + j;
      const X = t.x[i] + nx * off;
      const Y = t.y[i] + ny * off;
      d += (i === 0 ? 'M' : 'L') + X.toFixed(1) + ' ' + Y.toFixed(1);
      if (i > 0) cum[i] = cum[i - 1] + Math.hypot(X - px, Y - py);
      px = X;
      py = Y;
    }
    return { d, cum, len: cum[t.n - 1] };
  };
  return [make(-1, 0.3), make(1, 2.1)];
}

export function buildTies(t: Track, every: number, half: number) {
  const ties: { d: string; s: number }[] = [];
  for (let i = 0; i < t.n; i += every) {
    const nx = -Math.sin(t.ang[i]);
    const ny = Math.cos(t.ang[i]);
    const wob = ((i * 7919) % 5) * 0.4 - 0.8;
    ties.push({
      d: `M${(t.x[i] - nx * half + wob).toFixed(1)} ${(t.y[i] - ny * half).toFixed(1)}L${(t.x[i] + nx * half).toFixed(1)} ${(t.y[i] + ny * half + wob).toFixed(1)}`,
      s: i * t.step,
    });
  }
  return ties;
}
