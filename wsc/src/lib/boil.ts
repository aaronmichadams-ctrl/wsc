import { prefersReducedMotion } from './motion';

/**
 * "Boiling lines": registered elements cycle between 3 crayon filter seeds at ~8fps.
 * Only elements currently on screen are touched, and the ticker stops when nothing is visible
 * or the tab is hidden.
 */
const FRAMES = 3;
const FPS = 8;
const visible = new Set<HTMLElement | SVGElement>();
let frame = 0;
let timer: number | undefined;
let io: IntersectionObserver | undefined;

function tick() {
  frame = (frame + 1) % FRAMES;
  const f = `url(#crayon-b${frame})`;
  visible.forEach((el) => {
    el.style.filter = f;
  });
}

function sync() {
  const shouldRun = visible.size > 0 && !document.hidden;
  if (shouldRun && timer === undefined) timer = window.setInterval(tick, 1000 / FPS);
  if (!shouldRun && timer !== undefined) {
    clearInterval(timer);
    timer = undefined;
  }
}

function getIO() {
  if (!io) {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const el = e.target as HTMLElement;
          if (e.isIntersecting) visible.add(el);
          else visible.delete(el);
        }
        sync();
      },
      { rootMargin: '80px' },
    );
    document.addEventListener('visibilitychange', sync);
  }
  return io;
}

export function registerBoil(el: HTMLElement | SVGElement, enabled = true): () => void {
  if (!enabled || prefersReducedMotion()) {
    el.style.filter = 'url(#crayon)';
    return () => {};
  }
  el.style.filter = `url(#crayon-b${frame})`;
  const obs = getIO();
  obs.observe(el);
  return () => {
    obs.unobserve(el);
    visible.delete(el);
    sync();
  };
}
