import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { brand } from '../content';
import { prefersReducedMotion } from '../lib/motion';

/** The logo gets scribbled in with a crayon, then the paper slides away. */
export default function LogoLoader({ onDone }: { onDone?: () => void }) {
  const [gone, setGone] = useState(() => prefersReducedMotion());
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gone) {
      onDone?.();
      return;
    }
    const el = root.current!;
    const scrib = el.querySelector<SVGPathElement>('.loader__scrib')!;
    const under = el.querySelector<SVGPathElement>('.loader__under')!;
    const ls = scrib.getTotalLength();
    const lu = under.getTotalLength();
    gsap.set(scrib, { strokeDasharray: `${ls} ${ls}`, strokeDashoffset: ls });
    gsap.set(under, { strokeDasharray: `${lu} ${lu}`, strokeDashoffset: lu });
    let tl: gsap.core.Timeline | undefined;
    const start = () => {
      tl = gsap
        .timeline({
          onComplete: () => {
            setGone(true);
            onDone?.();
          },
        })
        .to(scrib, { strokeDashoffset: 0, duration: 0.9, ease: 'power1.inOut' })
        .to(under, { strokeDashoffset: 0, duration: 0.35, ease: 'power2.out' }, '-=0.15')
        .to(el, { yPercent: -100, duration: 0.55, ease: 'power3.in', delay: 0.15 });
    };
    // don't wait forever on fonts
    Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 700))]).then(start);
    return () => {
      tl?.kill();
    };
  }, [gone, onDone]);

  if (gone) return null;

  // a zig-zag "scribble" stroke that sweeps over the logo; used as a mask to reveal it
  const zz: string[] = [];
  for (let i = 0; i <= 26; i++) {
    const x = 6 + i * 23;
    zz.push(`${x} ${i % 2 ? 128 : 18}`);
  }
  return (
    <div ref={root} className="loader" aria-hidden="true">
      <svg viewBox="0 0 620 170" className="loader__svg">
        <defs>
          <mask id="loader-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="620" height="170">
            <path className="loader__scrib" d={`M${zz.join(' L')}`} stroke="#fff" strokeWidth="46" fill="none" strokeLinejoin="round" strokeLinecap="round" />
          </mask>
        </defs>
        <g mask="url(#loader-mask)">
          <text x="310" y="98" textAnchor="middle" className="loader__text">
            {brand.name}
          </text>
        </g>
        <path className="loader__under" d="M90 132 C 200 118, 360 140, 540 124" stroke="#e5483b" strokeWidth="7" fill="none" strokeLinecap="round" filter="url(#crayon)" />
      </svg>
    </div>
  );
}
