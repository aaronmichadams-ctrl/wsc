import { useEffect, useMemo, useRef, useState } from 'react';
import { crayon, sketchRect, type CrayonName } from '../lib/rough';
import { useBoil } from '../lib/useBoil';

type Props = {
  fill?: CrayonName | 'none';
  stroke?: CrayonName;
  seed?: number;
  fillStyle?: 'hachure' | 'zigzag' | 'cross-hatch' | 'solid';
  hachureGap?: number;
  roughness?: number;
  strokeWidth?: number;
  /** opaque paper underlay under the hatching */
  underlay?: string;
  /** offset scribbled shadow */
  shadow?: boolean;
  boil?: boolean;
  inset?: number;
  className?: string;
};

/** A hand-drawn rectangle that sizes itself to its parent. Parent must be position: relative. */
export default function SketchBox({
  fill = 'none',
  stroke = 'graphite',
  seed = 1,
  fillStyle = 'hachure',
  hachureGap = 5,
  roughness = 1.4,
  strokeWidth = 2.6,
  underlay,
  shadow = false,
  boil = true,
  inset = 2,
  className = '',
}: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  useBoil(ref, boil);

  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const w = Math.round(e.borderBoxSize?.[0]?.inlineSize ?? el.offsetWidth);
      const h = Math.round(e.borderBoxSize?.[0]?.blockSize ?? el.offsetHeight);
      setSize((s) => (s && Math.abs(s.w - w) < 2 && Math.abs(s.h - h) < 2 ? s : { w, h }));
    });
    ro.observe(el, { box: 'border-box' });
    return () => ro.disconnect();
  }, []);

  const pad = 8;
  const sk = useMemo(() => {
    if (!size) return null;
    const w = size.w - inset * 2;
    const h = size.h - inset * 2;
    const box = sketchRect(pad + inset, pad + inset, w, h, {
      seed,
      roughness,
      strokeWidth,
      stroke: crayon[stroke],
      fill: fill === 'none' ? undefined : crayon[fill],
      fillStyle,
      hachureGap,
      fillWeight: fillStyle === 'zigzag' ? 1.8 : 2.4,
    });
    const sh = shadow
      ? sketchRect(pad + inset + 5, pad + inset + 6, w, h, {
          seed: seed + 9,
          roughness: 1.6,
          stroke: crayon.graphite,
          strokeWidth: 2,
          fill: crayon.graphite,
          fillStyle: 'hachure',
          hachureGap: 3.2,
          fillWeight: 1.6,
          hachureAngle: 50,
        })
      : null;
    return { box, sh, w, h };
  }, [size, seed, roughness, strokeWidth, stroke, fill, fillStyle, hachureGap, inset, shadow]);

  return (
    <svg
      ref={ref}
      className={`sketch-box ${className}`}
      aria-hidden="true"
      focusable="false"
      width={size ? size.w + pad * 2 : 0}
      height={size ? size.h + pad * 2 : 0}
      style={{ position: 'absolute', left: -pad, top: -pad, overflow: 'visible', pointerEvents: 'none', zIndex: 0 }}
    >
      {sk?.sh && (
        <g className="sketch-box__shadow">
          {sk.sh.hatch.map((d, i) => (
            <path key={i} d={d} stroke={crayon.graphite} strokeWidth={1.6} fill="none" opacity={0.85} />
          ))}
          {sk.sh.outline.map((d, i) => (
            <path key={`o${i}`} d={d} stroke={crayon.graphite} strokeWidth={2} fill="none" />
          ))}
        </g>
      )}
      {sk && (
        <g className="sketch-box__face">
          {underlay && (
            <rect x={pad + inset + 1} y={pad + inset + 1} width={sk.w - 2} height={sk.h - 2} fill={underlay} rx={3} />
          )}
          {sk.box.hatch.map((d, i) => (
            <path key={i} d={d} stroke={fill === 'none' ? 'none' : crayon[fill]} strokeWidth={2.4} fill="none" strokeLinecap="round" />
          ))}
          {sk.box.outline.map((d, i) => (
            <path key={`o${i}`} d={d} stroke={crayon[stroke]} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" />
          ))}
        </g>
      )}
    </svg>
  );
}
