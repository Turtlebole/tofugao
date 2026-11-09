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
| Hero slideshow photos | `slides` list at the top of `src/components/sections/Hero.vue` |
| Name, links, "shot for & with" list | `src/data/site.ts` |
| Image files | `src/photos/` (see the README there) |
| Logo | `src/assets/logo.jpg`, favicon in `public/favicon.png` |
| Colors and fonts | `@theme` block in `src/style.css` |

## Languages

English and Serbian (Latin script). The site picks `?lang=sr` / `?lang=en` from the URL first, then the visitor's last choice, then the browser language (Serbian, Croatian, Bosnian and Montenegrin browsers get Serbian).

- UI copy lives in `src/i18n/en.ts`. `sr.ts` has to provide every key, or the type-check fails.
- Content in `src/data/projects.ts` can be a plain string (same in both languages, e.g. names) or `{ en: '…', sr: '…' }`.

The palette comes from the tofugao logo: cream paper `#f9f6ef`, ink `#121211`, sprout green `#74a561` and tofu `#d6b980`.

## Deploying

`npm run build` produces a static site in `dist/`. Netlify, Vercel, Cloudflare Pages and GitHub Pages all work with build command `npm run build` and output directory `dist`.
