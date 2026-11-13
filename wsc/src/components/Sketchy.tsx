import { useEffect, useMemo, useRef, type CSSProperties, type MouseEventHandler, type KeyboardEventHandler } from 'react';
import { crayon, sketchPath, type CrayonName } from '../lib/rough';
import { drawOn } from '../lib/draw';
import { useBoil } from '../lib/useBoil';

export type Shape = {
  d: string;
  stroke?: CrayonName | 'none';
  fill?: CrayonName;
  fillStyle?: 'hachure' | 'zigzag' | 'cross-hatch';
  hachureGap?: number;
  hachureAngle?: number;
  strokeWidth?: number;
  roughness?: number;
  /** paint an opaque underlay under the fill */
  underlay?: string;
  /** do not draw-on; always visible */
  static?: boolean;
  className?: string;
};

type Props = {
  shapes: Shape[];
  viewBox: string;
  seed?: number;
  draw?: 'scroll' | 'load' | 'enter' | 'none';
  drawDelay?: number;
  drawDuration?: number;
  start?: string;
  end?: string;
  boil?: boolean;
  className?: string;
  style?: CSSProperties;
  title?: string;
  onClick?: MouseEventHandler<SVGSVGElement>;
  onKeyDown?: KeyboardEventHandler<SVGSVGElement>;
  tabIndex?: number;
  role?: string;
  children?: React.ReactNode;
};

/**
 * Renders hand-authored paths through rough.js so they look sketched, and optionally
 * "draws them on" (outline first, then the scribbled color).
 */
export default function Sketchy({
  shapes,
  viewBox,
  seed = 1,
  draw = 'scroll',
  drawDelay,
  drawDuration,
  start,
  end,
  boil = true,
  className = '',
  style,
  title,
  onClick,
  onKeyDown,
  tabIndex,
  role,
  children,
}: Props) {
  const ref = useRef<SVGSVGElement>(null);
  useBoil(ref, boil);

  const sketches = useMemo(
    () =>
      shapes.map((s, i) => ({
        s,
        sk: sketchPath(s.d, {
          seed: seed * 31 + i,
          stroke: s.stroke && s.stroke !== 'none' ? crayon[s.stroke] : crayon.graphite,
          strokeWidth: s.strokeWidth ?? 2.6,
          roughness: s.roughness ?? 1.1,
          fill: s.fill ? crayon[s.fill] : undefined,
          fillStyle: s.fillStyle ?? 'hachure',
          hachureGap: s.hachureGap ?? 4.2,
          hachureAngle: s.hachureAngle ?? -38,
          fillWeight: 2.2,
          bowing: 1,
        }),
      })),
    [shapes, seed],
  );

  useEffect(() => {
    if (draw === 'none' || !ref.current) return;
    return drawOn(ref.current, { mode: draw, delay: drawDelay, duration: drawDuration, start, end });
  }, [draw, drawDelay, drawDuration, start, end]);

  const labelled = Boolean(title);
  return (
    <svg
      ref={ref}
      viewBox={viewBox}
      className={`sketchy ${className}`}
      style={style}
      role={role ?? (labelled ? 'img' : undefined)}
      aria-hidden={labelled || role ? undefined : true}
      aria-label={title}
      focusable={tabIndex !== undefined ? 'true' : 'false'}
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {sketches.map(({ s, sk }, i) => (
        <g key={i} className={s.className}>
          {s.underlay && <path d={s.d} fill={s.underlay} stroke="none" data-underlay={s.static ? undefined : ''} />}
          {s.fill &&
            sk.hatch.map((d, j) => (
              <path
                key={`h${j}`}
                d={d}
                data-draw={s.static ? undefined : 'fill'}
                stroke={crayon[s.fill!]}
                strokeWidth={2.2}
                strokeLinecap="round"
                fill="none"
              />
            ))}
          {s.stroke !== 'none' &&
            sk.outline.map((d, j) => (
              <path
                key={`o${j}`}
                d={d}
                data-draw={s.static ? undefined : ''}
                stroke={s.stroke && s.stroke !== "none" ? crayon[s.stroke] : crayon.graphite}
                strokeWidth={s.strokeWidth ?? 2.6}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
            ))}
        </g>
      ))}
      {children}
    </svg>
  );
}
