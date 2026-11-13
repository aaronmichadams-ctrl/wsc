import { starPoints } from './rough';

export const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0 Z`;

export const poly = (pts: [number, number][]) =>
  `M${pts.map((p) => p.map((v) => v.toFixed(1)).join(' ')).join(' L')} Z`;

export const star = (cx: number, cy: number, o: number, i: number, n = 5) => poly(starPoints(cx, cy, o, i, n));

export const heart = (cx: number, cy: number, s: number) => {
  const k = s / 60;
  const P = (x: number, y: number) => `${(cx + (x - 50) * k).toFixed(1)} ${(cy + (y - 50) * k).toFixed(1)}`;
  return `M${P(50, 80)} C${P(20, 60)}, ${P(10, 40)}, ${P(26, 28)} C${P(38, 20)}, ${P(48, 28)}, ${P(50, 36)} C${P(52, 28)}, ${P(62, 20)}, ${P(74, 28)} C${P(90, 40)}, ${P(80, 60)}, ${P(50, 80)} Z`;
};

export const sparkle = (cx: number, cy: number, r: number) =>
  `M${cx} ${cy - r} Q${cx + r * 0.18} ${cy - r * 0.18} ${cx + r} ${cy} Q${cx + r * 0.18} ${cy + r * 0.18} ${cx} ${cy + r} Q${cx - r * 0.18} ${cy + r * 0.18} ${cx - r} ${cy} Q${cx - r * 0.18} ${cy - r * 0.18} ${cx} ${cy - r} Z`;
