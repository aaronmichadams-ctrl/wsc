import { forwardRef, useMemo } from 'react';
import { crayon, sketchCircle, sketchPath } from '../lib/rough';

/**
 * Wes, the Weekly Social mascot. Drawn facing +x, wheels touching y = 0.
 * Poses are switched with data-pose on the root:
 *   ride | up | scream | hat | wave | end
 */

const CART = 'M-30 -9 L-35 -36 Q-36 -41 -30 -41 L-24 -41 L-21 -30 L14 -30 Q25 -30 31 -22 L38 -13 Q40 -9 34 -9 Z';
const CAP = 'M-19 -61 Q-18 -76 -5 -76 Q8 -76 8 -62 Z';
const BRIM = 'M6 -63 Q14 -65 20 -61 Q14 -58.5 6 -60.5 Z';
const SHIRT = 'M-15 -44 Q-15 -48 -10 -48 L-1 -48 Q4 -48 4 -44 L4 -28 L-15 -28 Z';
const LEGS = 'M-11 -28 L-12 -12 L-6 -12 M-2 -28 L-1 -12 L5 -12';

const ARMS = {
  ride: ['M-2 -44 Q6 -40 13 -32', 'M-12 -44 Q-18 -40 -21 -32'],
  up: ['M-2 -45 Q7 -56 9 -70', 'M-12 -45 Q-18 -57 -22 -70'],
  hat: ['M-2 -45 Q9 -54 4 -72', 'M-12 -44 Q-18 -40 -21 -32'],
  wave: ['M-2 -45 Q8 -48 13 -60', 'M-12 -44 Q-18 -40 -21 -32'],
  thumb: ['M-2 -44 Q8 -44 15 -50', 'M-12 -44 Q-16 -38 -16 -30'],
} as const;
const HANDS: Record<keyof typeof ARMS, [number, number][]> = {
  ride: [[13, -32], [-21, -32]],
  up: [[9, -71], [-22, -71]],
  hat: [[4, -73], [-21, -32]],
  wave: [[13, -61], [-21, -32]],
  thumb: [[15, -51], [-16, -29]],
};

const ink = crayon.graphite;

function useSketches() {
  return useMemo(() => {
    const o = { roughness: 0.7, bowing: 0.6, strokeWidth: 2.2 };
    return {
      cart: sketchPath(CART, { ...o, seed: 3, fill: crayon.red, fillStyle: 'zigzag', hachureGap: 3.2, fillWeight: 1.8, strokeWidth: 2.4 }),
      cap: sketchPath(CAP, { ...o, seed: 5, fill: crayon.blue, fillStyle: 'zigzag', hachureGap: 2.6, fillWeight: 1.6 }),
      brim: sketchPath(BRIM, { ...o, seed: 6, fill: crayon.blue, hachureGap: 2, fillWeight: 1.4 }),
      shirt: sketchPath(SHIRT, { ...o, seed: 7, fill: crayon.green, fillStyle: 'hachure', hachureGap: 2.8, fillWeight: 1.6 }),
      head: sketchCircle(-5.5, -60, 27, { ...o, seed: 9, strokeWidth: 2.3 }),
      w1: sketchCircle(-21, -5, 11, { ...o, seed: 11, fill: crayon.graphite, fillStyle: 'hachure', hachureGap: 2, fillWeight: 1.2 }),
      w2: sketchCircle(23, -5, 11, { ...o, seed: 12, fill: crayon.graphite, fillStyle: 'hachure', hachureGap: 2, fillWeight: 1.2 }),
    };
  }, []);
}

const Paths = ({ ds, stroke, w, fill }: { ds: string[]; stroke: string; w: number; fill?: string }) => (
  <>
    {ds.map((d, i) => (
      <path key={i} d={d} stroke={stroke} strokeWidth={w} fill={fill ?? 'none'} strokeLinecap="round" strokeLinejoin="round" />
    ))}
  </>
);

function Arm({ pose }: { pose: keyof typeof ARMS }) {
  return (
    <g className={`arm arm--${pose}`}>
      {ARMS[pose].map((d, i) => (
        <path key={i} d={d} className={i === 0 ? 'arm__front' : 'arm__back'} stroke={ink} strokeWidth={2.6} fill="none" strokeLinecap="round" />
      ))}
      {HANDS[pose].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={2.8} fill={crayon.white} stroke={ink} strokeWidth={1.8} className={i === 0 ? 'arm__front' : 'arm__back'} />
      ))}
      {pose === 'thumb' && <path d="M15 -53 L15.5 -59" stroke={ink} strokeWidth={2.6} strokeLinecap="round" />}
    </g>
  );
}

type Props = { className?: string; pose?: 'ride' | 'up' | 'scream' | 'hat' | 'wave' | 'end' };

const Rider = forwardRef<SVGSVGElement, Props>(function Rider({ className = '', pose = 'ride' }, ref) {
  const sk = useSketches();
  return (
    <svg ref={ref} className={`rider ${className}`} viewBox="-48 -86 104 96" width="104" height="96" data-pose={pose} aria-hidden="true">
      {/* the character (hops out at the end) */}
      <g className="rider__char">
        <g className="rider__bob">
          <path d={LEGS} stroke={ink} strokeWidth={2.6} fill="none" strokeLinecap="round" strokeLinejoin="round" className="rider__legs" />
          <path d={SHIRT} fill={crayon.white} />
          <Paths ds={sk.shirt.hatch} stroke={crayon.green} w={1.6} />
          <Paths ds={sk.shirt.outline} stroke={ink} w={2.2} />
          {/* head */}
          <circle cx={-5.5} cy={-60} r={13.2} fill={crayon.white} />
          <Paths ds={sk.head.outline} stroke={ink} w={2.3} />
          <circle cx={4} cy={-54} r={2.6} fill={crayon.orange} opacity={0.55} />
          <g className="face face--dot">
            <circle cx={-0.5} cy={-60} r={1.8} fill={ink} />
            <circle cx={5.5} cy={-60} r={1.8} fill={ink} />
            <path d="M-1 -53.5 Q2.5 -50.5 6 -53.5" stroke={ink} strokeWidth={1.8} fill="none" strokeLinecap="round" />
          </g>
          <g className="face face--wide">
            <circle cx={-1} cy={-60.5} r={3.3} fill={crayon.white} stroke={ink} strokeWidth={1.4} />
            <circle cx={6.2} cy={-60.5} r={3.3} fill={crayon.white} stroke={ink} strokeWidth={1.4} />
            <circle cx={0} cy={-60.5} r={1.4} fill={ink} />
            <circle cx={7.2} cy={-60.5} r={1.4} fill={ink} />
            <ellipse cx={3} cy={-52.5} rx={2.2} ry={2.8} fill={ink} />
          </g>
          {/* cap */}
          <g className="rider__cap">
            <path d={CAP} fill={crayon.white} />
            <Paths ds={sk.cap.hatch} stroke={crayon.blue} w={1.6} />
            <Paths ds={sk.cap.outline} stroke={ink} w={2.2} />
            <path d={BRIM} fill={crayon.blue} opacity={0.85} />
            <Paths ds={sk.brim.outline} stroke={ink} w={2} />
          </g>
          <Arm pose="ride" />
          <Arm pose="up" />
          <Arm pose="hat" />
          <Arm pose="wave" />
          <Arm pose="thumb" />
          <g className="rider__lines">
            <path d="M-30 -66 L-36 -70 M-30 -58 L-37 -58 M-30 -50 L-36 -46" stroke={ink} strokeWidth={1.6} strokeLinecap="round" />
          </g>
        </g>
      </g>
      {/* the cart */}
      <g className="rider__cart">
        <path d={CART} fill="#fff7ee" />
        <Paths ds={sk.cart.hatch} stroke={crayon.red} w={1.8} />
        <Paths ds={sk.cart.outline} stroke={ink} w={2.4} />
        <path d="M-2 -24 l2 4 4.5 .6 -3.3 3.1 .8 4.5 -4 -2.1 -4 2.1 .8 -4.5 -3.3 -3.1 4.5 -.6 z" fill={crayon.yellow} stroke={ink} strokeWidth={1.2} />
        <Paths ds={sk.w1.hatch} stroke={ink} w={1.2} />
        <Paths ds={sk.w1.outline} stroke={ink} w={2.2} />
        <Paths ds={sk.w2.hatch} stroke={ink} w={1.2} />
        <Paths ds={sk.w2.outline} stroke={ink} w={2.2} />
      </g>
    </svg>
  );
});

export default Rider;
