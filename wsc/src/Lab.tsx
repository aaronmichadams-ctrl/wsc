import { useRef } from 'react';
import Section from './components/Section';
import SketchButton from './components/SketchButton';
import SketchBox from './components/SketchBox';
import PaperScrap from './components/PaperScrap';
import Sticker from './components/Sticker';
import Scribble from './components/Scribble';
import TradeIcon from './components/TradeIcon';
import { PhoneDoodle, SparkleDoodle, StarDoodle, SunDoodle, SwirlDoodle, ThumbDoodle } from './components/Doodles';
import Coaster from './coaster/Coaster';
import Rider from './coaster/Rider';
import { brand, hero, packages, testimonial, trades } from './content';
import type { CrayonName } from './lib/rough';

const SWATCHES: { name: string; c: CrayonName }[] = [
  { name: 'Fire truck red', c: 'red' },
  { name: 'Sky blue', c: 'blue' },
  { name: 'Sunshine yellow', c: 'yellow' },
  { name: 'Grass green', c: 'green' },
  { name: 'Orange', c: 'orange' },
  { name: 'Purple', c: 'purple' },
];

/** Visual-system test page: paper, crayon filter, fonts, components, coaster. */
export default function Lab() {
  const page = useRef<HTMLElement>(null);
  return (
    <>
      <header className="lab-nav wrap">
        <a className="logo" href="#top">
          {brand.name}
        </a>
        <span className="lab-nav__tag">visual system test page</span>
      </header>

      <main id="main" className="page" ref={page}>
        <Coaster pageRef={page} />

        {/* 0. HERO */}
        <Section id="top" coaster="run" labelledBy="lab-hero">
          <div className="margin-doodle md-left margin-doodle--keep" style={{ top: 30 }}>
            <SunDoodle />
          </div>
          <div className="hero">
            <p className="eyebrow">Hi neighbor!</p>
            <h1 id="lab-hero" className="crayon-text">
              {hero.headlineLead}{' '}
              <span className="has-scribble">
                {hero.headlineScribble}
                <Scribble kind="underline" color="red" draw="load" delay={0.4} duration={0.8} />
              </span>
            </h1>
            <p className="lede">{hero.subline}</p>
            <div className="btn-row">
              <SketchButton href={hero.primaryCta.href} color="yellow" seed={4}>
                {hero.primaryCta.label}
              </SketchButton>
              <SketchButton href={hero.secondaryCta.href} variant="outline" seed={9}>
                {hero.secondaryCta.label}
              </SketchButton>
            </div>
          </div>
        </Section>

        {/* 1. PALETTE + TYPE */}
        <Section coaster="run" tint="yellow" seed={3} labelledBy="lab-box">
          <p className="eyebrow">01 · the crayon box</p>
          <h2 id="lab-box">
            <span className="has-scribble">
              Six crayons and a pencil
              <Scribble kind="underline" color="blue" seed={5} />
            </span>
          </h2>
          <ul className="swatches">
            {SWATCHES.map((s, i) => (
              <li key={s.c} className="swatch">
                <div className="swatch__chip">
                  <SketchBox fill={s.c} stroke="graphite" seed={20 + i} fillStyle={i % 2 ? 'zigzag' : 'hachure'} hachureGap={4} />
                </div>
                <span>{s.name}</span>
              </li>
            ))}
          </ul>
          <div className="type-specimen">
            <PaperScrap rotate={-1.2} seed={4} lined>
              <p className="spec-head">Gochi Hand for headlines</p>
              <p>
                Patrick Hand for body copy. It stays easy to read at small sizes, even when you are standing on a
                ladder checking your phone. Graphite on cream paper gives about 10:1 contrast.
              </p>
            </PaperScrap>
          </div>
        </Section>

        {/* 2. BUTTONS + CARDS (loop-the-loop happens here) */}
        <Section coaster="loop" labelledBy="lab-cards">
          <div className="margin-doodle md-left" style={{ top: 360, width: 84 }}>
            <StarDoodle />
          </div>
          <p className="eyebrow">02 · buttons and paper scraps</p>
          <h2 id="lab-cards">
            <span className="has-scribble">
              Hand-made, every piece
              <Scribble kind="double" color="green" seed={7} />
            </span>
          </h2>
          <div className="btn-row">
            <SketchButton color="yellow" seed={2}>Hover me</SketchButton>
            <SketchButton color="red" seed={3}>Click me</SketchButton>
            <SketchButton color="blue" seed={6}>Or me</SketchButton>
            <SketchButton variant="outline" seed={8}>Outline</SketchButton>
          </div>
          <ul className="cards">
            {packages.items.map((p, i) => (
              <PaperScrap key={p.name} as="li" rotate={[-2.2, 1.2, -0.8][i]} seed={11 + i} className={p.popular ? 'is-popular' : ''}>
                {p.popular && <Sticker label={packages.popularLabel} className="card-sticker" />}
                <h3>{p.name}</h3>
                <p className="price">
                  {p.price}
                  <small>{p.period}</small>
                </p>
                <p>{p.blurb}</p>
                <ul className="checks">
                  {p.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </PaperScrap>
            ))}
          </ul>
        </Section>

        {/* 3. DRAW ON SCROLL (big drop happens here) */}
        <Section coaster="drop" tint="blue" seed={8} labelledBy="lab-draw">
          <div className="margin-doodle md-right" style={{ top: 120, width: 104 }}>
            <PhoneDoodle />
          </div>
          <div className="margin-doodle md-right" style={{ bottom: 40, width: 92 }}>
            <ThumbDoodle />
          </div>
          <p className="eyebrow">03 · drawn as you scroll</p>
          <h2 id="lab-draw">
            <span className="has-scribble">
              {trades.title}
              <Scribble kind="underline" color="orange" seed={9} />
            </span>
          </h2>
          <p className="lede">Outlines sketch themselves first, then the color scribbles in.</p>
          <ul className="trades">
            {trades.items.map((t, i) => (
              <li key={t.key} className="trade">
                <TradeIcon kind={t.key} seed={i + 2} />
                <span>{t.label}</span>
              </li>
            ))}
          </ul>
          <div className="arrow-demo">
            <PaperScrap rotate={-2} seed={31} tape="corners">
              <p className="spec-head">We plan</p>
            </PaperScrap>
            <Scribble kind="arrow-right" color="purple" seed={4} className="arrow-demo__arrow" strokeWidth={3.5} />
            <PaperScrap rotate={1.5} seed={32} tape="corners">
              <p className="spec-head">You get calls</p>
            </PaperScrap>
          </div>
        </Section>

        {/* 4. MASCOT + STICKY NOTE */}
        <Section coaster="run" labelledBy="lab-wes">
          <div className="margin-doodle md-left" style={{ top: 120, width: 90 }}>
            <SwirlDoodle />
          </div>
          <div className="margin-doodle md-left" style={{ top: 360, width: 80 }}>
            <SparkleDoodle />
          </div>
          <p className="eyebrow">04 · our mascot</p>
          <h2 id="lab-wes">
            <span className="has-scribble">
              Meet {brand.mascotName}
              <Scribble kind="circle" color="yellow" seed={12} strokeWidth={4} />
            </span>
          </h2>
          <div className="wes-grid">
            <PaperScrap rotate={-1} seed={41}>
              <div className="wes-poses">
                {(['ride', 'up', 'scream', 'hat', 'wave', 'end'] as const).map((p) => (
                  <figure key={p}>
                    <WesPose pose={p} />
                    <figcaption>{p}</figcaption>
                  </figure>
                ))}
              </div>
            </PaperScrap>
            <PaperScrap as="blockquote" rotate={2} seed={42} tape="top" color="#fff3a8" className="sticky">
              <p>“{testimonial.quote}”</p>
              <footer>- {testimonial.name}</footer>
            </PaperScrap>
          </div>
        </Section>

        {/* 5. END OF THE RIDE */}
        <Section id="audit" coaster="end" tint="green" seed={14} labelledBy="lab-end">
          <div className="end-demo">
            <p className="eyebrow">05 · last stop</p>
            <h2 id="lab-end">Free Audit station</h2>
            <p className="lede">The ride ends here. {brand.mascotName} hops out and gives you a thumbs up.</p>
            <SketchButton color="red" seed={14}>
              Get a Free Audit
            </SketchButton>
          </div>
        </Section>
      </main>
      <footer className="lab-foot wrap">
        <p>Test page. Real sections come next.</p>
      </footer>
    </>
  );
}

function WesPose({ pose }: { pose: 'ride' | 'up' | 'scream' | 'hat' | 'wave' | 'end' }) {
  return <Rider pose={pose} className={`wes-static ${pose === 'end' ? 'rider--out' : ''}`} />;
}
