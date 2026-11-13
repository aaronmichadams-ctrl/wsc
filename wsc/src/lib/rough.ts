import rough from 'roughjs';
import type { Drawable, Options } from 'roughjs/bin/core';

const gen = rough.generator();

export type Sketch = {
  /** outline strokes */
  outline: string[];
  /** hatched / scribbled fill strokes */
  hatch: string[];
  /** solid fill (used as an opaque underlay) */
  solid: string[];
};

export const crayon = {
  red: '#e5483b',
  blue: '#3d9ad9',
  yellow: '#f6c21f',
  green: '#4fae3e',
  orange: '#f2852a',
  purple: '#8a5cc6',
  graphite: '#3a3940',
  paper: '#fbf5e6',
  white: '#fffdf6',
} as const;

export type CrayonName = keyof typeof crayon;

const base: Options = {
  roughness: 1.3,
  bowing: 1.2,
  strokeWidth: 2.4,
  stroke: crayon.graphite,
  fillStyle: 'hachure',
  hachureAngle: -38,
  hachureGap: 5,
  fillWeight: 2.2,
};

function split(d: Drawable): Sketch {
  const out: Sketch = { outline: [], hatch: [], solid: [] };
  for (const set of d.sets) {
    const p = gen.opsToPath(set, 1);
    if (set.type === 'path') out.outline.push(p);
    else if (set.type === 'fillSketch') out.hatch.push(p);
    else out.solid.push(p);
  }
  return out;
}

export const sketchRect = (x: number, y: number, w: number, h: number, o: Options = {}) =>
  split(gen.rectangle(x, y, w, h, { ...base, ...o }));

export const sketchPath = (d: string, o: Options = {}) => split(gen.path(d, { ...base, ...o }));

export const sketchPolygon = (pts: [number, number][], o: Options = {}) =>
  split(gen.polygon(pts, { ...base, ...o }));

export const sketchCircle = (x: number, y: number, dia: number, o: Options = {}) =>
  split(gen.circle(x, y, dia, { ...base, ...o }));

export const sketchLine = (x1: number, y1: number, x2: number, y2: number, o: Options = {}) =>
  split(gen.line(x1, y1, x2, y2, { ...base, ...o }));

export const sketchCurve = (pts: [number, number][], o: Options = {}) =>
  split(gen.curve(pts, { ...base, ...o }));

/** Star polygon points */
export function starPoints(cx: number, cy: number, outer: number, inner: number, n = 5) {
  const pts: [number, number][] = [];
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI * i) / n - Math.PI / 2;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  return pts;
}
