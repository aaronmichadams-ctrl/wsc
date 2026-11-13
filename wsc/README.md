# Weekly Social Co.

One-page marketing site for Weekly Social Co. (Woodstock, GA). Vite + React + TypeScript, GSAP ScrollTrigger, Rough.js.

## Local dev

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

## Editing content

All copy, prices, packages, the testimonial, team bios/photos and emails live in `src/content.ts`.
Team photos: put files in `public/team/` and set `photo: '/team/aaron.jpg'`.

## Free Audit form

Copy `.env.example` to `.env.local` and set `VITE_FORM_ENDPOINT` (Formspree form URL, or
`https://api.web3forms.com/submit` plus `VITE_WEB3FORMS_KEY`). On Vercel, add the same variables under
Project Settings > Environment Variables.

## Deploy to Vercel

Import the repo in Vercel. It auto-detects Vite (build `npm run build`, output `dist`). No `vercel.json` needed.
Or from the CLI: `npx vercel` (preview) / `npx vercel --prod`.

## Where things live

- `src/components/CrayonDefs.tsx` SVG crayon filters (static + 3 "boiling" seeds)
- `src/lib/boil.ts` 8fps boiling-line ticker (only for on-screen elements)
- `src/lib/draw.ts` draw-on-scroll (stroke-dashoffset + ScrollTrigger)
- `src/components/` SketchBox, SketchButton, PaperScrap, Sticker, Scribble, Doodles, TradeIcon
- `src/coaster/` track geometry, the rider (Wes), and the scroll engine
