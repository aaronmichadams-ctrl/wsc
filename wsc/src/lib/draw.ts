import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from './motion';

gsap.registerPlugin(ScrollTrigger);

type DrawOpts = {
  /** 'scroll' scrubs with scroll position, 'load' plays once after `delay` */
  mode?: 'scroll' | 'load' | 'enter';
  start?: string;
  end?: string;
  delay?: number;
  duration?: number;
  trigger?: Element;
};

/** Hide every [data-draw] path so it can be drawn on. Returns lengths. */
function prime(paths: SVGGeometryElement[]) {
  return paths.map((p) => {
    const len = Math.ceil(p.getTotalLength()) + 2;
    p.style.strokeDasharray = `${len} ${len + 12}`;
    p.style.strokeDashoffset = `${len + 6}`;
    return len;
  });
}

/**
 * Draw every `[data-draw]` stroke inside `root` in document order.
 * Elements marked `data-draw="fill"` (scribbled color) start after the outlines finish.
 */
export function drawOn(root: Element, opts: DrawOpts = {}): () => void {
  if (prefersReducedMotion()) return () => {};
  const all = Array.from(root.querySelectorAll<SVGGeometryElement>('[data-draw]'));
  if (!all.length) return () => {};
  const outlines = all.filter((p) => p.dataset.draw !== 'fill');
  const fills = all.filter((p) => p.dataset.draw === 'fill');
  const lo = prime(outlines);
  const lf = prime(fills);
  const mode = opts.mode ?? 'scroll';

  const tl = gsap.timeline({
    paused: mode !== 'scroll',
    delay: opts.delay ?? 0,
    scrollTrigger:
      mode === 'scroll'
        ? {
            trigger: opts.trigger ?? root,
            start: opts.start ?? 'top 88%',
            end: opts.end ?? 'top 45%',
            scrub: 0.6,
          }
        : undefined,
  });
  const total = opts.duration ?? 1;
  const sumO = lo.reduce((a, b) => a + b, 0) || 1;
  const sumF = lf.reduce((a, b) => a + b, 0) || 1;
  const outShare = fills.length ? 0.55 : 1;
  outlines.forEach((p, i) => {
    tl.to(p, { strokeDashoffset: 0, duration: (lo[i] / sumO) * total * outShare, ease: 'none' });
  });
  const unders = Array.from(root.querySelectorAll<SVGElement>('[data-underlay]'));
  if (unders.length) {
    gsap.set(unders, { opacity: 0 });
    tl.to(unders, { opacity: 1, duration: total * 0.08, ease: 'none' });
  }
  fills.forEach((p, i) => {
    tl.to(p, { strokeDashoffset: 0, duration: (lf[i] / sumF) * total * (1 - outShare), ease: 'none' });
  });

  let st: ScrollTrigger | undefined;
  if (mode === 'load') tl.play();
  if (mode === 'enter') {
    st = ScrollTrigger.create({
      trigger: opts.trigger ?? root,
      start: opts.start ?? 'top 85%',
      once: true,
      onEnter: () => tl.play(),
    });
  }
  return () => {
    st?.kill();
    tl.scrollTrigger?.kill();
    tl.kill();
    root.querySelectorAll<SVGElement>('[data-underlay]').forEach((u) => (u.style.opacity = ''));
    all.forEach((p) => {
      p.style.strokeDasharray = '';
      p.style.strokeDashoffset = '';
    });
  };
}

export { gsap, ScrollTrigger };
