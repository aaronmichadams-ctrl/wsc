import type { CSSProperties, ReactNode } from 'react';
import { useMemo } from 'react';
import { scrapClip } from '../lib/torn';

type Props = {
  children: ReactNode;
  rotate?: number;
  seed?: number;
  tape?: 'top' | 'corners' | 'none';
  lined?: boolean;
  color?: string;
  className?: string;
  as?: 'div' | 'article' | 'li' | 'figure' | 'blockquote';
};

/** A scrap of paper taped to the page, slightly rotated, with uneven edges. */
export default function PaperScrap({
  children,
  rotate = -1.5,
  seed = 1,
  tape = 'top',
  lined = false,
  color,
  className = '',
  as: Tag = 'div',
}: Props) {
  const clip = useMemo(() => scrapClip(seed), [seed]);
  const tapeRot = ((seed * 37) % 9) - 4;
  return (
    <Tag className={`scrap ${className}`} style={{ '--rot': `${rotate}deg` } as CSSProperties}>
      <div
        className={`scrap__paper ${lined ? 'scrap__paper--lined' : ''}`}
        style={{ clipPath: clip, background: color }}
      >
        {children}
      </div>
      {tape === 'top' && <span className="tape tape--top" style={{ '--tr': `${tapeRot}deg` } as CSSProperties} aria-hidden="true" />}
      {tape === 'corners' && (
        <>
          <span className="tape tape--tl" aria-hidden="true" />
          <span className="tape tape--tr" aria-hidden="true" />
        </>
      )}
    </Tag>
  );
}
