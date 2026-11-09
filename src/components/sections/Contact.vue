<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import logo from '@/assets/logo.jpg'
import { site } from '@/data/site'
import { vReveal } from '@/directives'
import { useI18n } from '@/i18n'
import { fontsReady } from '@/lib/fonts'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import LocalTime from '@/components/ui/LocalTime.vue'

const { t } = useI18n()
const year = new Date().getFullYear()

// Footer wordmark: letters rise out of a mask and the logo rolls in, tied to the scroll.
const letters = 'tofugao'.split('')
const footer = ref<HTMLElement | null>(null)
const wordmark = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null
let resizeWatch: ResizeObserver | null = null
let fitted = 0

/*
 * Sizes the wordmark so the logo's left edge and the last letter's right edge meet the edges of
 * the footer, at any width. It measures the mark at a probe size and scales from there, so it
 * stays exact when the web font arrives and changes the letter widths. offsetLeft / offsetWidth
 * are layout measurements, so the scroll animation's transforms don't skew them.
 */
function fitWordmark() {
  const el = wordmark.value
  const first = el?.firstElementChild as HTMLElement | null
  const last = el?.lastElementChild as HTMLElement | null
  if (!el || !first || !last || !el.clientWidth) return
  const probe = 100
  el.style.fontSize = `${probe}px`
  const natural = last.offsetLeft + last.offsetWidth - first.offsetLeft
  el.style.fontSize = `${(probe * el.clientWidth) / natural}px`
  fitted = el.clientWidth
}

onMounted(() => {
  if (!footer.value) return
  fitWordmark()
  // Height changes when the size does, so only a change of width needs a new fit
  resizeWatch = new ResizeObserver(() => {
    if (wordmark.value && wordmark.value.clientWidth !== fitted) fitWordmark()
  })
  resizeWatch.observe(footer.value)
  // The brand fonts arrive after the first paint (src/lib/fonts.ts), and the letters change width with them
  fontsReady.then(fitWordmark)

  if (prefersReducedMotion()) return
  ctx = gsap.context(() => {
    const scrollTrigger = { trigger: footer.value, start: 'top bottom', end: 'bottom bottom', scrub: 1 }
    gsap.from('[data-letter]', { yPercent: 110, rotate: 6, stagger: 0.05, ease: 'none', scrollTrigger })
    gsap.from('[data-wordmark-logo]', { scale: 0.2, rotate: -160, ease: 'none', scrollTrigger })
  }, footer.value)
})
onBeforeUnmount(() => {
  resizeWatch?.disconnect()
  ctx?.revert()
})
</script>

<template>
  <section id="contact" class="relative isolate overflow-hidden">
    <div class="glows -z-10 opacity-60" aria-hidden="true">
      <span class="-top-1/3 left-[5%] h-[80%] w-[55%] [--c:#2c4fc4]"></span>
      <span class="top-[5%] -right-[15%] h-[75%] w-[50%] [--c:#a12f63] [animation-delay:-9s]"></span>
      <span class="top-[40%] left-[30%] h-[55%] w-[45%] [--c:#2f5f27] [animation-delay:-16s]"></span>
    </div>

    <div class="mx-auto max-w-7xl px-5 pt-28 pb-16 sm:px-8 sm:pt-40">
      <h2 v-reveal class="type-night max-w-5xl text-[clamp(2.8rem,8vw,7.5rem)]">{{ t.contact.title }}</h2>

      <a
        :href="site.dm"
        target="_blank"
        rel="noopener noreferrer"
        class="bg-fg text-surface hover:bg-accent hover:text-on-accent mt-12 inline-block rounded-full px-6 py-3.5 font-semibold whitespace-nowrap transition-colors duration-500 sm:mt-16 sm:px-8 sm:py-4 sm:text-lg"
      >
        {{ t.contact.dm }}
      </a>

      <dl class="mt-20 grid gap-8 border-t border-rule pt-8 sm:grid-cols-3 sm:mt-28">
        <div>
          <dt class="text-fg-muted text-[13px]">{{ t.contact.instagram }}</dt>
          <dd class="mt-1 text-[15px]">
            <a :href="site.instagram" target="_blank" rel="noopener noreferrer" class="link">@{{ site.handle }}</a>
          </dd>
        </div>
        <div>
          <dt class="text-fg-muted text-[13px]">{{ t.contact.basedIn }}</dt>
          <dd class="mt-1 text-[15px]">{{ t.contact.basedValue }}</dd>
        </div>
        <div>
          <dt class="text-fg-muted text-[13px]">{{ t.contact.localTime }}</dt>
          <dd class="mt-1 text-[15px] tabular-nums"><LocalTime :time-zone="site.timezone" /> {{ t.contact.inNoviSad }}</dd>
        </div>
      </dl>
    </div>

    <footer ref="footer" class="mx-auto max-w-7xl overflow-hidden px-5 pb-8 sm:px-8">
      <!-- The size here is a stand-in until fitWordmark() sets the exact one -->
      <p
        ref="wordmark"
        class="font-brand flex items-center gap-[0.1em] text-[min(19.5vw,18.5rem)] leading-[0.85] font-semibold tracking-[-0.06em] select-none"
        aria-hidden="true"
      >
        <img data-wordmark-logo :src="logo" alt="" class="size-[0.72em] shrink-0 rounded-full" />
        <!--
          The mask only clips vertically. The tight tracking makes each letter's box a hair narrower
          than its glyph, so the letters pad their box by the tracking and pull it back with a
          negative margin: the gradient then paints the whole glyph and the spacing stays the same.
        -->
        <span class="-mb-[0.18em] flex shrink-0 overflow-x-visible overflow-y-clip">
          <span
            v-for="(l, i) in letters"
            :key="i"
            data-letter
            class="from-fg -mr-[0.06em] inline-block bg-gradient-to-b to-white/10 bg-clip-text pr-[0.06em] pb-[0.18em] text-transparent"
            >{{ l }}</span
          >
        </span>
      </p>
      <div class="text-fg-muted mt-8 flex flex-wrap justify-between gap-4 border-t border-rule pt-5 text-[13px]">
        <span>{{ t.contact.rights(year, site.name) }}</span>
        <a href="#top" class="link hover:text-fg">{{ t.contact.top }}</a>
      </div>
    </footer>
  </section>
</template>
