import { useState, type CSSProperties } from 'react';
import Sketchy, { type Shape } from './Sketchy';
import { circle, heart, sparkle, star } from '../lib/shapes';

type DoodleProps = { className?: string; style?: CSSProperties; seed?: number };

const STAR: Shape[] = [{ d: star(50, 52, 40, 17), stroke: 'orange', fill: 'yellow', fillStyle: 'zigzag', hachureGap: 3.6 }];
export const StarDoodle = (p: DoodleProps) => (
  <Sketchy shapes={STAR} viewBox="0 0 100 100" className={`doodle ${p.className ?? ''}`} style={p.style} seed={p.seed ?? 3} />
);

const SWIRL: Shape[] = [
  {
    d: 'M50 50 C50 44 58 44 58 50 C58 60 42 60 42 50 C42 36 66 36 66 50 C66 70 34 70 34 50 C34 26 78 26 78 50 C78 80 22 82 24 48',
    stroke: 'purple',
    strokeWidth: 3,
  },
];
export const SwirlDoodle = (p: DoodleProps) => (
  <Sketchy shapes={SWIRL} viewBox="0 0 100 100" className={`doodle ${p.className ?? ''}`} style={p.style} seed={p.seed ?? 5} />
);

const PHONE: Shape[] = [
  { d: 'M26 30 Q26 24 32 24 L58 24 Q64 24 64 30 L64 90 Q64 96 58 96 L32 96 Q26 96 26 90 Z', stroke: 'graphite', fill: 'blue', hachureGap: 4, underlay: '#fffdf6' },
  { d: 'M31 33 L59 33 L59 84 L31 84 Z', stroke: 'graphite', strokeWidth: 1.8 },
  { d: circle(45, 90, 2.4), stroke: 'graphite', strokeWidth: 1.6 },
  { d: heart(72, 26, 22), stroke: 'red', fill: 'red', fillStyle: 'zigzag', hachureGap: 2.6, className: 'float-1' },
  { d: heart(86, 8, 14), stroke: 'red', fill: 'red', fillStyle: 'zigzag', hachureGap: 2.4, className: 'float-2' },
  { d: heart(54, 6, 12), stroke: 'orange', fill: 'orange', fillStyle: 'zigzag', hachureGap: 2.4, className: 'float-3' },
];
export const PhoneDoodle = (p: DoodleProps) => (
  <Sketchy shapes={PHONE} viewBox="0 -10 100 110" className={`doodle doodle--phone ${p.className ?? ''}`} style={p.style} seed={p.seed ?? 8} />
);

const THUMB: Shape[] = [
  { d: 'M18 50 L34 50 L34 88 L18 88 Z', stroke: 'graphite', fill: 'blue', underlay: '#fffdf6' },
  {
    d: 'M34 54 C44 50 50 40 50 26 C50 16 62 16 62 28 C62 36 60 42 58 48 L78 48 C88 48 88 58 82 60 C88 62 88 70 80 71 C86 73 85 80 78 81 C82 83 81 89 75 89 L44 89 C40 89 34 87 34 85 Z',
    stroke: 'graphite',
    fill: 'yellow',
    fillStyle: 'zigzag',
    hachureGap: 3.4,
    underlay: '#fffdf6',
  },
];
export const ThumbDoodle = (p: DoodleProps) => (
  <Sketchy shapes={THUMB} viewBox="0 0 100 100" className={`doodle ${p.className ?? ''}`} style={p.style} seed={p.seed ?? 11} />
);

const SPARKS: Shape[] = [
  { d: sparkle(30, 30, 20), stroke: 'orange', fill: 'yellow', hachureGap: 3 },
  { d: sparkle(70, 62, 14), stroke: 'blue', fill: 'blue', hachureGap: 3 },
  { d: sparkle(36, 78, 9), stroke: 'red', fill: 'red', hachureGap: 2.6 },
];
export const SparkleDoodle = (p: DoodleProps) => (
  <Sketchy shapes={SPARKS} viewBox="0 0 100 100" className={`doodle ${p.className ?? ''}`} style={p.style} seed={p.seed ?? 13} />
);

/* ---------- The sun (easter egg: click it for sunglasses) ---------- */
const rays = Array.from({ length: 10 }, (_, i) => {
  const a = (i / 10) * Math.PI * 2;
  const r1 = 32;
  const r2 = 44 + (i % 2) * 5;
  return `M${(60 + Math.cos(a) * r1).toFixed(1)} ${(60 + Math.sin(a) * r1).toFixed(1)} L${(60 + Math.cos(a) * r2).toFixed(1)} ${(60 + Math.sin(a) * r2).toFixed(1)}`;
}).join(' ');

const SUN: Shape[] = [
  { d: rays, stroke: 'orange', strokeWidth: 3.2 },
  { d: circle(60, 60, 25), stroke: 'orange', fill: 'yellow', fillStyle: 'zigzag', hachureGap: 3.2, underlay: '#fff6cf' },
  { d: 'M50 67 Q60 75 70 67', stroke: 'graphite', strokeWidth: 2.4 },
];
const GLASSES: Shape[] = [
  { d: 'M40 52 L57 52 Q57 64 48 64 Q40 64 40 52 Z', stroke: 'graphite', fill: 'graphite', hachureGap: 1.6, static: true },
  { d: 'M63 52 L80 52 Q80 64 71 64 Q63 64 63 52 Z', stroke: 'graphite', fill: 'graphite', hachureGap: 1.6, static: true },
  { d: 'M36 52 L84 51', stroke: 'graphite', strokeWidth: 2.4, static: true },
];

export function SunDoodle({ className = '', style }: DoodleProps) {
  const [cool, setCool] = useState(false);
  return (
    <button
      type="button"
      className={`sun-egg ${cool ? 'is-cool' : ''} ${className}`}
      style={style}
      aria-pressed={cool}
      aria-label={cool ? 'Take the sunglasses off the sun' : 'Poke the sun'}
      onClick={() => setCool((c) => !c)}
    >
      <Sketchy shapes={SUN} viewBox="0 0 120 120" className="doodle sun-egg__sun" seed={21}>
        {!cool && (
          <g className="sun-egg__eyes">
            <circle cx="51" cy="56" r="2.6" fill="#3a3940" />
            <circle cx="69" cy="56" r="2.6" fill="#3a3940" />
          </g>
        )}
      </Sketchy>
      {cool && (
        <Sketchy shapes={GLASSES} viewBox="0 0 120 120" className="sun-egg__glasses" seed={22} draw="none" boil={false} />
      )}
    </button>
  );
}
