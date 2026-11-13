import { useMemo, useRef } from 'react';
import { crayon, sketchPolygon, starPoints } from '../lib/rough';
import { useBoil } from '../lib/useBoil';

/** Hand-drawn star sticker with a real-text label. */
export default function Sticker({ label, className = '' }: { label: string; className?: string }) {
  const ref = useRef<SVGSVGElement>(null);
  useBoil(ref);
  const sk = useMemo(
    () =>
      sketchPolygon(starPoints(70, 70, 62, 34, 7), {
        seed: 12,
        fill: crayon.yellow,
        fillStyle: 'zigzag',
        hachureGap: 3.6,
        fillWeight: 2,
        stroke: crayon.orange,
        strokeWidth: 3,
        roughness: 1.2,
      }),
    [],
  );
  return (
    <div className={`sticker ${className}`}>
      <svg ref={ref} viewBox="0 0 140 140" aria-hidden="true">
        <polygon points={starPoints(70, 70, 58, 32, 7).join(' ')} fill="#fffbe8" />
        {sk.hatch.map((d, i) => (
          <path key={i} d={d} stroke={crayon.yellow} strokeWidth={2} fill="none" />
        ))}
        {sk.outline.map((d, i) => (
          <path key={i} d={d} stroke={crayon.orange} strokeWidth={3} fill="none" strokeLinecap="round" />
        ))}
      </svg>
      <span className="sticker__label">{label}</span>
    </div>
  );
}
