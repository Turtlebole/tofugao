# tofugao-site

Portfolio for Jovan Živković ([@tofugao](https://www.instagram.com/tofugao/)), built with Vue 3, Vite and Tailwind CSS v4.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build
```

## Editing content

| What | Where |
| --- | --- |
| All page copy, in English and Serbian | `src/i18n/en.ts`, `src/i18n/sr.ts` |
| Projects (index list) and photos in the Selected work grid | `src/data/projects.ts` |
| Hero photos (the night drive) | `driveDay` / `driveNight` in `src/data/sets.ts`; where each one hangs in `DAY_SPOTS` / `NIGHT_SPOTS` in `src/components/sections/Hero.vue` |
| Name, links, "shot for & with" list | `src/data/site.ts` |
| Image files | `src/photos/` (see the README there) |
| Logo | `src/assets/logo.jpg`, favicon in `public/favicon.png` |
| Colors | `@theme` block in `src/style.css` |
| Fonts | Self-hosted: `public/fonts/` and `src/fonts.css` (see Performance) |

## Languages

English and Serbian (Latin script). The site picks `?lang=sr` / `?lang=en` from the URL first, then the visitor's last choice, then the browser language (Serbian, Croatian, Bosnian and Montenegrin browsers get Serbian).

- UI copy lives in `src/i18n/en.ts`. `sr.ts` has to provide every key, or the type-check fails.
- Content in `src/data/projects.ts` can be a plain string (same in both languages, e.g. names) or `{ en: '…', sr: '…' }`.

The palette comes from the tofugao logo: cream paper `#f9f6ef`, ink `#121211`, sprout green `#74a561` and tofu `#d6b980`.

## Performance

Lighthouse (mobile, simulated slow 4G and a 4x slower CPU) scores about 98 on a production build, and 100 on desktop. To measure, build, serve and audit:

```bash
npm run build && npm run preview
npx lighthouse http://localhost:4173 --only-categories=performance
```

What keeps it there, so a change doesn't quietly undo it:

- **Photos are AVIF** (`src/photos/`; the original JPEGs are in `photos-original/`). Convert new ones as the README there shows.
- **Fonts are self-hosted and load after the first paint** (`src/lib/fonts.ts`). Until then the page uses the system font; the hero headline waits for the fonts so it never flashes in the wrong font. Don't preload the fonts or link Google Fonts: anything that finishes before the first large paint counts against Lighthouse's first-paint numbers.
- **Only the first hero photos load up front** (`EAGER` in `Hero.vue`, plus a preload in `vite.config.ts` that must match the first cards of `driveDay`). The rest, and other below-the-fold images, wait for `afterFirstPaint` (`src/lib/paint.ts`).
- **Nothing should repaint the hero photos after the first paint.** Chrome counts a repaint of a photo that has grown as a new, later largest paint. That is why `ScrollTrigger.refresh()` after the fonts load skips the pinned hero (`src/main.ts`), and why the photo captions keep the system font until hovered.
- The stylesheet is inlined into `index.html` at build time (`vite.config.ts`), and `render()` in `Hero.vue` writes only the styles that changed.
- The server hosting `dist/` should compress text (gzip or brotli) and cache `assets/` and `fonts/` for a long time.

## Deploying

`npm run build` produces a static site in `dist/`. Netlify, Vercel, Cloudflare Pages and GitHub Pages all work with build command `npm run build` and output directory `dist`.
