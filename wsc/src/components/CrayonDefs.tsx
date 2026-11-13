/**
 * Global SVG filter defs.
 *  - #crayon        static waxy crayon edge (wobble + grit + paper-tooth grain)
 *  - #crayon-b0..b2 same filter, different wobble seeds, cycled for "boiling" lines
 *  - #crayon-soft   grain only, for big hand-lettered text
 */
const WOBBLE_SEEDS = [3, 11, 27];

function CrayonFilter({ id, seed }: { id: string; seed: number }) {
  return (
    <filter id={id} x="-6%" y="-6%" width="112%" height="112%" colorInterpolationFilters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves={2} seed={seed} result="wob" />
      <feDisplacementMap in="SourceGraphic" in2="wob" scale="4" xChannelSelector="R" yChannelSelector="G" result="w1" />
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={1} seed={seed + 5} result="grit" />
      <feDisplacementMap in="w1" in2="grit" scale="2.2" xChannelSelector="R" yChannelSelector="B" result="w2" />
      <feTurbulence type="fractalNoise" baseFrequency="1.1 0.35" numOctaves={2} seed="9" result="wax" />
      <feColorMatrix
        in="wax"
        type="matrix"
        values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  4.2 0 0 0 -1.25"
        result="waxA"
      />
      <feComposite in="w2" in2="waxA" operator="in" />
    </filter>
  );
}

export default function CrayonDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <CrayonFilter id="crayon" seed={WOBBLE_SEEDS[0]} />
        {WOBBLE_SEEDS.map((s, i) => (
          <CrayonFilter key={s} id={`crayon-b${i}`} seed={s} />
        ))}
        <filter id="crayon-soft" x="-2%" y="-2%" width="104%" height="104%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="1.2 0.4" numOctaves={2} seed="4" result="wax" />
          <feColorMatrix
            in="wax"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3 0 0 0 -0.55"
            result="waxA"
          />
          <feComposite in="SourceGraphic" in2="waxA" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}
