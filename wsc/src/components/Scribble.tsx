import { useMemo } from 'react';
import Sketchy, { type Shape } from './Sketchy';
import type { CrayonName } from '../lib/rough';

type Kind = 'underline' | 'double' | 'circle' | 'arrow-right' | 'arrow-down' | 'arrow-curve';

const PATHS: Record<Kind, { vb: string; d: string[] }> = {
  underline: { vb: '0 0 300 30', d: ['M6 18 C 60 10, 120 22, 180 14 S 270 12, 294 16'] },
  double: {
    vb: '0 0 300 38',
    d: ['M6 22 C 70 16, 150 26, 294 19', 'M24 33 C 90 27, 180 35, 280 29'],
  },
  circle: {
    vb: '0 0 300 120',
    d: ['M150 10 C 60 8, 8 34, 14 64 C 22 104, 120 114, 196 108 C 268 102, 296 78, 288 50 C 280 22, 210 6, 120 14'],
  },
  'arrow-right': {
    vb: '0 0 220 80',
    d: ['M8 50 C 50 20, 120 20, 196 42', 'M174 22 L 200 43 L 170 58'],
  },
  'arrow-down': {
    vb: '0 0 90 180',
    d: ['M30 8 C 70 50, 10 100, 46 160', 'M26 140 L 47 166 L 66 136'],
  },
  'arrow-curve': {
    vb: '0 0 240 140',
    d: ['M10 20 C 80 0, 150 40, 120 80 C 100 110, 160 130, 214 104', 'M192 92 L 216 103 L 196 122'],
  },
};

type Props = {
  kind?: Kind;
  color?: CrayonName;
  seed?: number;
  draw?: 'scroll' | 'load' | 'enter' | 'none';
  delay?: number;
  duration?: number;
  className?: string;
  strokeWidth?: number;
};

export default function Scribble({
  kind = 'underline',
  color = 'red',
  seed = 2,
  draw = 'scroll',
  delay,
  duration,
  className = '',
  strokeWidth = 4.5,
}: Props) {
  const def = PATHS[kind];
  const shapes = useMemo<Shape[]>(
    () => def.d.map((d) => ({ d, stroke: color, strokeWidth, roughness: 0.9 })),
    [def, color, strokeWidth],
  );
  return (
    <Sketchy
      shapes={shapes}
      viewBox={def.vb}
      seed={seed}
      draw={draw}
      drawDelay={delay}
      drawDuration={duration}
      className={`scribble scribble--${kind} ${className}`}
      start="top 92%"
      end="top 60%"
    />
  );
}
