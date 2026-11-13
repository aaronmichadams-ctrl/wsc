import Sketchy, { type Shape } from './Sketchy';
import { circle, sparkle } from '../lib/shapes';

const U = '#fffdf6';

export const TRADE_SHAPES: Record<string, Shape[]> = {
  hvac: [
    { d: 'M14 30 L106 30 L106 98 L14 98 Z', fill: 'blue', underlay: U },
    { d: circle(60, 64, 24), fill: 'yellow', fillStyle: 'zigzag', hachureGap: 3.2, underlay: U },
    { d: 'M60 64 L60 44 M60 64 L78 72 M60 64 L42 72', strokeWidth: 3 },
    { d: 'M24 18 L34 8 M30 18 L20 8 M46 18 L56 8 M52 18 L42 8', stroke: 'blue', strokeWidth: 2.4 },
  ],
  plumbing: [
    { d: 'M60 10 C60 10 26 52 26 74 C26 96 44 108 60 108 C76 108 94 96 94 74 C94 52 60 10 60 10 Z', fill: 'blue', fillStyle: 'zigzag', hachureGap: 3.6, underlay: U },
    { d: 'M42 74 C42 86 48 92 56 94', stroke: 'graphite', strokeWidth: 3 },
  ],
  roofing: [
    { d: 'M24 58 L24 106 L96 106 L96 58', fill: 'yellow', underlay: U },
    { d: 'M8 62 L60 16 L112 62 Z', fill: 'red', fillStyle: 'zigzag', hachureGap: 3.6, underlay: U },
    { d: 'M80 34 L80 18 L92 18 L92 44', fill: 'orange', underlay: U },
    { d: 'M52 106 L52 80 L68 80 L68 106', fill: 'blue' },
  ],
  landscaping: [
    { d: 'M54 72 L50 108 L72 108 L66 72 Z', fill: 'orange', underlay: U },
    {
      d: 'M60 12 C40 12 30 26 34 38 C18 40 16 64 32 70 C34 84 56 86 62 78 C72 88 96 82 94 66 C108 60 104 38 88 36 C90 22 76 10 60 12 Z',
      fill: 'green',
      fillStyle: 'zigzag',
      hachureGap: 3.6,
      underlay: U,
    },
    { d: 'M14 110 L106 110', stroke: 'green', strokeWidth: 3 },
  ],
  detailing: [
    {
      d: 'M10 82 C10 70 18 66 30 64 L42 46 C44 42 48 40 54 40 L80 40 C86 40 90 44 94 50 L102 64 C110 66 112 72 112 82 Z',
      fill: 'purple',
      fillStyle: 'zigzag',
      hachureGap: 3.6,
      underlay: U,
    },
    { d: 'M46 62 L52 48 L66 48 L66 62 Z M72 62 L72 48 L84 48 L92 62 Z', fill: 'blue', underlay: U, strokeWidth: 2 },
    { d: circle(34, 84, 10), fill: 'graphite', underlay: U },
    { d: circle(88, 84, 10), fill: 'graphite', underlay: U },
    { d: sparkle(100, 22, 12), stroke: 'orange', fill: 'yellow' },
    { d: sparkle(20, 34, 8), stroke: 'orange', fill: 'yellow' },
  ],
  yours: [
    { d: 'M12 50 L108 50 L108 104 L12 104 Z', fill: 'orange', fillStyle: 'zigzag', hachureGap: 3.6, underlay: U },
    { d: 'M42 50 L42 34 L78 34 L78 50', strokeWidth: 3 },
    { d: 'M12 68 L108 68', strokeWidth: 2.2 },
    { d: 'M54 78 L66 78 L66 90 L54 90 Z', fill: 'yellow', underlay: U },
    { d: 'M100 8 L104 20 L116 22 L106 30 L108 42 L100 35 L91 42 L93 30 L84 22 L96 20 Z', stroke: 'purple', fill: 'purple' },
  ],
};

export default function TradeIcon({ kind, seed = 1, className = '' }: { kind: keyof typeof TRADE_SHAPES; seed?: number; className?: string }) {
  return <Sketchy shapes={TRADE_SHAPES[kind]} viewBox="0 0 120 120" seed={seed} className={`trade-icon ${className}`} start="top 90%" end="top 55%" />;
}
