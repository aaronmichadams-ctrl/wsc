import { rng } from './motion';

/** A jagged torn-paper edge as an SVG data URI, usable as a CSS mask. */
export function tornEdge(seed: number, edge: 'top' | 'bottom'): string {
  const r = rng(seed);
  const W = 1200;
  const H = 20;
  const pts: string[] = [];
  let x = 0;
  while (x <= W) {
    const y = 3 + r() * 11 + (r() < 0.15 ? 5 : 0);
    pts.push(`${x.toFixed(0)},${(edge === 'top' ? y : H - y).toFixed(1)}`);
    x += 6 + r() * 16;
  }
  pts.push(`${W},${edge === 'top' ? 8 : H - 8}`);
  const poly =
    edge === 'top' ? `0,${H} ${pts.join(' ')} ${W},${H}` : `0,0 ${pts.join(' ')} ${W},0`;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${W} ${H}' preserveAspectRatio='none'><polygon points='${poly}' fill='black'/></svg>`;
  return `url("data:image/svg+xml;utf8,${svg}")`;
}

/** Irregular scrap-of-paper clip-path polygon (percent based). */
export function scrapClip(seed: number, jag = 1.1): string {
  const r = rng(seed);
  const pts: string[] = [];
  const side = (n: number, fn: (t: number, j: number) => [number, number]) => {
    for (let i = 0; i < n; i++) {
      const t = i / n;
      pts.push(fn(t * 100, r() * jag).map((v) => `${v.toFixed(2)}%`).join(' '));
    }
  };
  side(9, (t, j) => [t, j]);
  side(7, (t, j) => [100 - j, t]);
  side(9, (t, j) => [100 - t, 100 - j]);
  side(7, (t, j) => [j, 100 - t]);
  return `polygon(${pts.join(', ')})`;
}
