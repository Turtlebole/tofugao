import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type HtmlTagDescriptor, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// The first photos the hero shows: the first cards of `driveDay` in src/data/sets.ts, by file name.
const HERO_PHOTOS = ['jdm-tomodachi-crx', 'cover-amb-1']

/**
 * Preloads the hero's first photos. Only the app knows about them, and it has to download and run
 * before it can ask for them, so without a hint the browser finds them late. The built file names
 * carry a content hash, which is why this reads them out of the bundle.
 */
function preloadHeroPhotos(): Plugin {
  let base = '/'
  return {
    name: 'preload-hero-photos',
    configResolved(config) {
      base = config.base
    },
    transformIndexHtml: {
      order: 'post',
      handler(_html, ctx): HtmlTagDescriptor[] {
        if (!ctx.bundle) return [] // the dev server serves the photos unhashed
        return HERO_PHOTOS.flatMap((stem) => {
          const asset = Object.values(ctx.bundle!).find((file) => new RegExp(`^assets/${stem}-[\\w-]{8}\\.avif$`).test(file.fileName))
          if (!asset) return []
          return [
            {
              tag: 'link',
              attrs: { rel: 'preload', as: 'image', type: 'image/avif', href: base + asset.fileName, fetchpriority: 'high' },
              injectTo: 'head',
            },
          ]
        })
      },
    },
  }
}

/**
 * Puts the stylesheet inside the page. It is small and every visit needs it before painting, so a
 * separate file only adds a round trip to the first paint.
 */
function inlineCss(): Plugin {
  let base = '/'
  return {
    name: 'inline-css',
    configResolved(config) {
      base = config.base
    },
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const bundle = ctx.bundle
        if (!bundle) return html
        return html.replace(/<link rel="stylesheet"[^>]*? href="([^"]+)"[^>]*>/g, (tag, href: string) => {
          const file = bundle[href.startsWith(base) ? href.slice(base.length) : href]
          return file?.type === 'asset' ? `<style>${file.source}</style>` : tag
        })
      },
    },
  }
}

export default defineConfig({
  plugins: [vue(), tailwindcss(), preloadHeroPhotos(), inlineCss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
})
