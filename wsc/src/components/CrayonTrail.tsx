import { useEffect, useRef } from 'react';
import { isFinePointer, prefersReducedMotion } from '../lib/motion';

const COLORS = ['#e5483b', '#3d9ad9', '#f6c21f', '#4fae3e', '#f2852a', '#8a5cc6'];

/** A waxy crayon trail that follows the mouse and fades out. Desktop only. */
export default function CrayonTrail() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!isFinePointer() || prefersReducedMotion()) return;
    const c = ref.current!;
    const ctx = c.getContext('2d')!;
    let dpr = 1;
    const size = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      c.width = innerWidth * dpr;
      c.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    window.addEventListener('resize', size);
    let last: { x: number; y: number } | null = null;
    let color = 0;
    let dist = 0;
    let raf = 0;
    let idle = 0;
    const fade = () => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.09)';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.globalCompositeOperation = 'source-over';
      idle++;
      if (idle < 60) raf = requestAnimationFrame(fade);
      else {
        ctx.clearRect(0, 0, c.width, c.height);
        raf = 0;
      }
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      const p = { x: e.clientX, y: e.clientY };
      if (last) {
        const d = Math.hypot(p.x - last.x, p.y - last.y);
        if (d > 120) {
          last = p;
          return;
        }
        dist += d;
        if (dist > 260) {
          dist = 0;
          color = (color + 1) % COLORS.length;
        }
        ctx.strokeStyle = COLORS[color];
        ctx.lineCap = 'round';
        // a few jittered strokes = waxy crayon texture
        for (let k = 0; k < 3; k++) {
          ctx.globalAlpha = 0.35 + Math.random() * 0.25;
          ctx.lineWidth = 1.5 + Math.random() * 2.5;
          ctx.beginPath();
          ctx.moveTo(last.x + (Math.random() - 0.5) * 2.5, last.y + (Math.random() - 0.5) * 2.5);
          ctx.lineTo(p.x + (Math.random() - 0.5) * 2.5, p.y + (Math.random() - 0.5) * 2.5);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }
      last = p;
      idle = 0;
      if (!raf) raf = requestAnimationFrame(fade);
    };
    const leave = () => (last = null);
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', size);
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
    };
  }, []);
  return <canvas ref={ref} className="crayon-trail" aria-hidden="true" />;
}
