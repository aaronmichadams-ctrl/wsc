import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Rider from './Rider';
import {
  F_DROP,
  F_END,
  F_LOOP,
  buildDesktopPieces,
  buildMobilePieces,
  buildRails,
  buildTies,
  sampleTrack,
  type SectionBox,
  type Track,
} from './track';
import { prefersReducedMotion } from '../lib/motion';
import { registerBoil } from '../lib/boil';

type Built = {
  mode: 'desktop' | 'mobile';
  W: number;
  H: number;
  track: Track;
  rails: { d: string; cum: Float32Array; len: number }[];
  ties: { d: string; s: number }[];
  /** scroll position at which the rider reaches each sample (desktop) */
  keys: Float32Array | null;
  end: { x: number; y: number; dir: 1 | -1 };
};

const DESKTOP_MQ = '(min-width: 1024px)';
const MOBILE_BAR_H = 58;
const LEAD = 240; // px of track drawn ahead of the rider

type Pose = 'ride' | 'up' | 'scream' | 'hat' | 'wave' | 'end';

function wrapDeg(a: number) {
  a = ((a + 180) % 360 + 360) % 360 - 180;
  return a;
}

export default function Coaster({ pageRef }: { pageRef: React.RefObject<HTMLElement> }) {
  const [built, setBuilt] = useState<Built | null>(null);
  const riderWrap = useRef<HTMLDivElement>(null);
  const riderSvg = useRef<SVGSVGElement>(null);
  const railRefs = useRef<(SVGPathElement | null)[]>([]);
  const fillRef = useRef<SVGPathElement>(null);
  const tiesRef = useRef<SVGGElement>(null);

  /* ---------------- build the track from the page layout ---------------- */
  const build = useCallback(() => {
    const page = pageRef.current;
    if (!page) return;
    const desktop = window.matchMedia(DESKTOP_MQ).matches;
    const W = document.documentElement.clientWidth;
    if (desktop) {
      const pageTop = page.getBoundingClientRect().top + window.scrollY;
      const secs: SectionBox[] = Array.from(page.querySelectorAll<HTMLElement>('[data-coaster]')).map((el) => {
        const r = el.getBoundingClientRect();
        return { top: r.top + window.scrollY - pageTop, bottom: r.bottom + window.scrollY - pageTop, kind: el.dataset.coaster || 'run' };
      });
      if (secs.length < 2) return;
      const wrapEl = page.querySelector<HTMLElement>('.wrap');
      const contentW = wrapEl ? wrapEl.getBoundingClientRect().width : Math.min(1100, W - 300);
      const { pieces, endInfo } = buildDesktopPieces(W, contentW, secs);
      const track = sampleTrack(pieces, 4);
      const rails = buildRails(track, 5);
      const ties = buildTies(track, 6, 9);
      // scroll keys: rider tracks ~55% down the viewport, but always keeps moving
      const vh = window.innerHeight;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
      const keys = new Float32Array(track.n);
      const pageOffset = pageTop;
      for (let i = 1; i < track.n; i++) {
        const want = track.y[i] + pageOffset - vh * 0.56;
        keys[i] = Math.max(keys[i - 1] + 0.5 * track.step, want);
      }
      const last = keys[track.n - 1];
      if (last > maxScroll * 0.985) {
        const k = (maxScroll * 0.985) / last;
        for (let i = 0; i < track.n; i++) keys[i] *= k;
      }
      setBuilt({ mode: 'desktop', W, H: page.offsetHeight, track, rails, ties, keys, end: endInfo });
    } else {
      const H = MOBILE_BAR_H;
      const { pieces, endInfo } = buildMobilePieces(W, H);
      const track = sampleTrack(pieces, 2);
      setBuilt({ mode: 'mobile', W, H, track, rails: [{ d: track.d, cum: new Float32Array(0), len: track.length }], ties: [], keys: null, end: endInfo });
    }
  }, [pageRef]);

  useEffect(() => {
    let t: number | undefined;
    const schedule = () => {
      window.clearTimeout(t);
      t = window.setTimeout(build, 180);
    };
    build();
    document.fonts?.ready.then(schedule);
    window.addEventListener('resize', schedule);
    const ro = new ResizeObserver(schedule);
    if (pageRef.current) ro.observe(pageRef.current);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener('resize', schedule);
      ro.disconnect();
    };
  }, [build, pageRef]);

  /* ---------------- per-frame engine ---------------- */
  useLayoutEffect(() => {
    if (!built || !riderWrap.current || !riderSvg.current) return;
    const { track: t, keys, rails, ties, mode } = built;
    const wrap = riderWrap.current;
    const svg = riderSvg.current;
    const reduced = prefersReducedMotion();
    const unboil = registerBoil(svg);
    const tieEls = tiesRef.current ? Array.from(tiesRef.current.children) as SVGPathElement[] : [];

    // prime rails for draw-ahead
    const railEls = railRefs.current.filter(Boolean) as SVGPathElement[];
    railEls.forEach((el, i) => {
      const len = mode === 'desktop' ? rails[i].len : t.length;
      el.style.strokeDasharray = `${len + 2} ${len + 2}`;
      el.style.strokeDashoffset = reduced ? '0' : `${len + 1}`;
    });
    if (fillRef.current) {
      fillRef.current.style.strokeDasharray = `${t.length + 2} ${t.length + 2}`;
      fillRef.current.style.strokeDashoffset = reduced ? '0' : `${t.length + 1}`;
    }
    let tiesShown = reduced ? ties.length : 0;
    tieEls.forEach((el, i) => el.setAttribute('visibility', i < tiesShown ? 'visible' : 'hidden'));

    const maxS = t.length - 0.01;
    const sForScroll = (sy: number) => {
      if (mode === 'mobile') {
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        return Math.min(1, Math.max(0, sy / max)) * maxS;
      }
      const k = keys!;
      if (sy <= k[0]) return 0;
      if (sy >= k[t.n - 1]) return maxS;
      let lo = 0;
      let hi = t.n - 1;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (k[mid] <= sy) lo = mid;
        else hi = mid;
      }
      const span = k[hi] - k[lo] || 1;
      return Math.min(maxS, (lo + (sy - k[lo]) / span) * t.step);
    };

    let s = sForScroll(window.scrollY);
    let target = s;
    let flip = t.facing[Math.round(s / t.step)] || 1;
    let angle = 0;
    let lastScroll = performance.now();
    let pose: Pose | '' = '';
    let shownS = -1;
    let atEnd = false;
    const charEl = svg.querySelector<SVGGElement>('.rider__char');
    const hop = gsap.timeline({ paused: true });
    if (charEl && mode === 'desktop') {
      hop
        .to(charEl, { x: 30, y: -34, duration: 0.22, ease: 'power2.out' })
        .to(charEl, { x: 60, y: 12, duration: 0.26, ease: 'power2.in' })
        .to(charEl, { scaleY: 0.86, transformOrigin: '50% 100%', duration: 0.08, yoyo: true, repeat: 1 });
    }

    const setPose = (p: Pose) => {
      if (p === pose) return;
      pose = p;
      svg.dataset.pose = p;
    };

    const sample = (sv: number) => {
      const fi = sv / t.step;
      const i = Math.min(t.n - 2, Math.floor(fi));
      const u = fi - i;
      const x = t.x[i] + (t.x[i + 1] - t.x[i]) * u;
      const y = t.y[i] + (t.y[i + 1] - t.y[i]) * u;
      return { i, x, y };
    };

    const render = (now: number) => {
      const { i, x, y } = sample(s);
      const facing = t.facing[i] as 1 | -1;
      const flags = t.flags[i];
      const inLoop = (flags & F_LOOP) !== 0;
      // angle of travel, clamped so the cart stays mostly upright outside the loop
      let a = (t.ang[i] * 180) / Math.PI;
      const baseA = facing > 0 ? 0 : 180;
      let rel = wrapDeg(a - baseA);
      if (!inLoop) rel = Math.max(-78, Math.min(78, rel));
      a = rel + baseA;
      const diff = wrapDeg(a - angle);
      angle = reduced ? a : angle + diff * 0.35;
      // flip smoothly when the rider swaps sides of the track
      flip += (facing - flip) * (reduced ? 1 : 0.22);
      const sy = Math.abs(flip) < 0.08 ? 0.08 * Math.sign(flip || 1) : flip;
      wrap.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${angle.toFixed(2)}deg) scale(1, ${sy.toFixed(3)})`;

      // draw the track just ahead of the rider
      if (!reduced && Math.abs(s - shownS) > 0.5) {
        shownS = s;
        const reveal = Math.min(t.length, s + (mode === 'desktop' ? LEAD : 26));
        if (mode === 'desktop') {
          const ri = Math.min(t.n - 1, Math.floor(reveal / t.step));
          railEls.forEach((el, k) => {
            el.style.strokeDashoffset = `${(rails[k].len - rails[k].cum[ri]).toFixed(1)}`;
          });
          // ties pop in one by one
          let want = 0;
          while (want < ties.length && ties[want].s <= reveal) want++;
          while (tiesShown < want) tieEls[tiesShown++]?.setAttribute('visibility', 'visible');
          while (tiesShown > want) tieEls[--tiesShown]?.setAttribute('visibility', 'hidden');
        } else {
          railEls.forEach((el) => (el.style.strokeDashoffset = `${(t.length - reveal).toFixed(1)}`));
        }
        if (fillRef.current) fillRef.current.style.strokeDashoffset = `${(t.length - Math.max(0, s)).toFixed(1)}`;
      }

      if (reduced) {
        setPose('ride');
        return;
      }

      // reactions
      const end = (flags & F_END) !== 0 && s >= maxS - 2;
      if (end !== atEnd) {
        atEnd = end;
        if (end) hop.restart();
        else hop.reverse();
      }
      const moving = Math.abs(target - s) > 1.5 || now - lastScroll < 140;
      const downTilt = facing > 0 ? rel : -rel;
      if (atEnd) setPose('end');
      else if (inLoop) setPose('hat');
      else if ((flags & F_DROP) !== 0 && downTilt > 30 && moving) setPose('scream');
      else if (downTilt > 38 && moving) setPose('up');
      else if (now - lastScroll > 1000) setPose('wave');
      else setPose('ride');
    };

    const onScroll = () => {
      target = sForScroll(window.scrollY);
      lastScroll = performance.now();
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let raf = 0;
    let prev = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(64, now - prev);
      prev = now;
      const k = 1 - Math.pow(0.86, dt / 16.67);
      s += (target - s) * k;
      if (Math.abs(target - s) < 0.05) s = target;
      render(now);
      raf = requestAnimationFrame(loop);
    };
    if (reduced) {
      s = 0;
      render(performance.now());
    } else {
      render(performance.now());
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      hop.kill();
      if (charEl) gsap.set(charEl, { clearProps: 'all' });
      unboil();
    };
  }, [built]);

  if (!built) return null;
  const { mode, W, H, track, rails, ties } = built;

  if (mode === 'mobile') {
    return (
      <div className="coaster coaster--bar" aria-hidden="true">
        <svg className="coaster__svg" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          <path d={track.d} className="coaster__ghost" />
          <path ref={(el) => (railRefs.current[0] = el)} d={track.d} className="coaster__rail coaster__rail--bar" />
        </svg>
        <div ref={riderWrap} className="coaster__rider coaster__rider--small">
          <Rider ref={riderSvg} />
        </div>
      </div>
    );
  }

  return (
    <div className="coaster" aria-hidden="true" style={{ height: H }}>
      <svg className="coaster__svg" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <path ref={fillRef} d={track.d} className="coaster__trail" />
        <g ref={tiesRef} className="coaster__ties">
          {ties.map((t, i) => (
            <path key={i} d={t.d} />
          ))}
        </g>
        {rails.map((r, i) => (
          <path key={i} ref={(el) => (railRefs.current[i] = el)} d={r.d} className={`coaster__rail coaster__rail--${i}`} />
        ))}
        <Station x={built.end.x} y={built.end.y} dir={built.end.dir} />
      </svg>
      <div ref={riderWrap} className="coaster__rider">
        <Rider ref={riderSvg} />
      </div>
    </div>
  );
}

function Station({ x, y, dir }: { x: number; y: number; dir: 1 | -1 }) {
  // a little buffer stop and platform where the ride ends
  const px = x + dir * 8;
  return (
    <g className="coaster__station">
      <path d={`M${px} ${y + 2} L${px + dir * 120} ${y + 3}`} strokeWidth={3} />
      <path d={`M${px + dir * 6} ${y - 18} L${px + dir * 4} ${y + 2} M${px + dir * 6} ${y - 18} L${px + dir * 16} ${y - 17}`} strokeWidth={3} />
      <path d={`M${px + dir * 128} ${y - 2} l${dir * 4} -26 l${dir * 26} 4 l${-dir * 4} 24 z`} className="coaster__flag" />
      <path d={`M${px + dir * 128} ${y + 3} L${px + dir * 133} ${y - 40}`} strokeWidth={2.4} />
    </g>
  );
}

export { F_END };
