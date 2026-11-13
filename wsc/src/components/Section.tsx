import type { CSSProperties, ReactNode } from 'react';
import { tornEdge } from '../lib/torn';

type Props = {
  id?: string;
  tint?: 'none' | 'yellow' | 'blue' | 'green' | 'pink';
  seed?: number;
  /** marks this section for the rollercoaster track */
  coaster?: 'run' | 'loop' | 'drop' | 'end';
  className?: string;
  labelledBy?: string;
  /** margin doodles, positioned against the section (not the content column) */
  decor?: ReactNode;
  children: ReactNode;
};

export default function Section({ id, tint = 'none', seed = 1, coaster = 'run', className = '', labelledBy, decor, children }: Props) {
  const bgStyle =
    tint === 'none'
      ? undefined
      : ({
          '--bg': `var(--tint-${tint})`,
          '--torn-top': tornEdge(seed, 'top'),
          '--torn-bottom': tornEdge(seed + 77, 'bottom'),
        } as CSSProperties);
  return (
    <section id={id} className={`section ${className}`} data-coaster={coaster} aria-labelledby={labelledBy}>
      {tint !== 'none' && <div className="section-bg" style={bgStyle} aria-hidden="true" />}
      {decor}
      <div className="wrap">{children}</div>
    </section>
  );
}
