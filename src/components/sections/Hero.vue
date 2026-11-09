<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Shot } from '@/data/projects'
import { driveDay, driveNight } from '@/data/sets'
import { site } from '@/data/site'
import { vLift, vMagnetic } from '@/directives'
import { useI18n } from '@/i18n'
import { gsap, prefersReducedMotion, SplitText } from '@/lib/gsap'

const { t, tx, locale } = useI18n()

/*
 * Night drive. The hero pins for a couple of screens of scrolling, and scrolling is driving:
 * his photos sit in 3D space along the road and rush past like street lights, car shots in
 * daylight first, then party shots after dark. The sky goes day → dusk → night → dawn, and
 * dawn hands over to the cream page below.
 *
 * Everything that follows the scroll is computed in render() from one number, the drive
 * progress p (0 → 1), so the scene is always consistent however fast you scroll.
 */

// Where each photo hangs, scattered by hand so no two neighbours line up. x / y are in vw / vh
// from the vanishing point, mostly above the horizon so photos fly up and out past the edges,
// away from the headline at the bottom. rot is a tilt in degrees; size scales the base width.
type Spot = { x: number; y: number; rot: number; size: number }
const DAY_SPOTS: Spot[] = [
  { x: -31, y: -21, rot: -6, size: 1.1 },
  { x: 34, y: -33, rot: 7, size: 0.82 },
  { x: -41, y: -4, rot: 9, size: 0.85 },
  { x: 17, y: -12, rot: -8, size: 0.95 },
  { x: -13, y: -38, rot: -10, size: 0.88 },
  { x: 41, y: 4, rot: -5, size: 1.12 },
]
const NIGHT_SPOTS: Spot[] = [
  { x: 37, y: -24, rot: 8, size: 1.05 },
  { x: -35, y: -9, rot: -6, size: 1.12 },
  { x: 9, y: -37, rot: 5, size: 0.85 },
  { x: -42, y: -31, rot: 10, size: 0.8 },
  { x: 29, y: -1, rot: -9, size: 0.95 },
  { x: -21, y: -21, rot: 4, size: 1.0 },
]
const PER_PHASE = 6
const STEP = 440 // depth between photos (px)
const FIRST = 120 // the nearest photo starts just in front of you

const repeat = <T,>(list: T[], n: number) => Array.from({ length: n }, (_, i) => list[i % list.length]!)

// Keeps a panorama or a tall poster from making a card that is all edge
const ratioOf = (s: Shot) => Math.min(4 / 3, Math.max(3 / 4, s.width / s.height))

const makeCard = (s: Shot, spot: Spot, key: string, night: boolean, depth: number) => ({
  key,
  src: s.src,
  title: s.title,
  caption: s.caption,
  ratio: ratioOf(s),
  night,
  ...spot,
  depth,
})

const cards = [
  ...repeat(driveDay, PER_PHASE).map((s, i) =>
    makeCard(s, DAY_SPOTS[i % DAY_SPOTS.length]!, `d${i}-${s.id}`, false, FIRST + i * STEP),
  ),
  ...repeat(driveNight, PER_PHASE).map((s, i) =>
    makeCard(s, NIGHT_SPOTS[i % NIGHT_SPOTS.length]!, `n${i}-${s.id}`, true, FIRST + PER_PHASE * STEP + 300 + i * STEP),
  ),
]
const TRAVEL = cards[cards.length - 1]!.depth + 800

// Colours for type and buttons by day and by night
const DAY = { fg: '#000000', bg: '#f9f6ef', muted: '#6e6a63' }
const NIGHT = { fg: '#f6f1e7', bg: '#05060c', muted: '#b9b3a8' }

const root = ref<HTMLElement | null>(null)
const clock = ref('12:00')
const progress = { p: 0 } // position through the pinned hero, 0 → 1
const intro = { offset: 0 } // extra distance for the load animation
const still = prefersReducedMotion()
let cardEls: HTMLElement[] = []
let parts: Record<string, HTMLElement | null> = {}
let vw = window.innerWidth
let vh = window.innerHeight
let ctx: gsap.Context | null = null
let letters: SplitText | null = null

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const ramp = (p: number, start: number, length: number) => clamp01((p - start) / length)
const mix = gsap.utils.interpolate

function render() {
  const p = progress.p
  const el = root.value
  if (!el) return

  // Sky and type: night falls at about a third of the way, dawn arrives near the end
  const dawn = ramp(p, 0.86, 0.1)
  const dusk = ramp(p, 0.24, 0.14) * (1 - dawn)
  const night = ramp(p, 0.36, 0.12) * (1 - dawn)
  if (parts.dusk) parts.dusk.style.opacity = dusk.toFixed(3)
  if (parts.night) parts.night.style.opacity = night.toFixed(3)
  el.style.setProperty('--hero-fg', mix(DAY.fg, NIGHT.fg, night))
  el.style.setProperty('--hero-bg', mix(DAY.bg, NIGHT.bg, night))
  el.style.setProperty('--hero-muted', mix(DAY.muted, NIGHT.muted, night))
  if (parts.line2) parts.line2.style.opacity = still ? '1' : (0.14 + 0.86 * ramp(p, 0.42, 0.1)).toFixed(3)
  if (parts.lead) {
    const lead = still ? 1 : ramp(p, 0.88, 0.08)
    parts.lead.style.opacity = lead.toFixed(3)
    parts.lead.style.visibility = lead > 0 ? 'visible' : 'hidden'
    parts.lead.style.transform = `translateY(${((1 - lead) * 24).toFixed(1)}px)`
  }
  if (parts.hint) parts.hint.style.opacity = (1 - ramp(p, 0.02, 0.05)).toFixed(3)

  // 12:00 → 06:00 the next morning
  const minutes = Math.round(720 + clamp01(p) * 1080) % 1440
  clock.value = `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`

  // Photos: fade in out of the haze, fade out just before they'd fill the screen
  const travel = (p / 0.84 + intro.offset) * TRAVEL
  const nightGate = ramp(p, 0.26, 0.1)
  for (let i = 0; i < cardEls.length; i++) {
    const c = cards[i]!
    const card = cardEls[i]!
    const z = travel - c.depth
    let o = z < -2000 ? clamp01((z + 2600) / 600) : 1
    if (z > 150) o = Math.min(o, clamp01(1 - (z - 150) / 450))
    if (c.night) o *= nightGate
    if (o <= 0.001) {
      if (card.style.visibility !== 'hidden') card.style.visibility = 'hidden'
      continue
    }
    card.style.visibility = 'visible'
    card.style.opacity = o.toFixed(3)
    card.style.transform = `translate3d(${((c.x * vw) / 100).toFixed(1)}px, ${((c.y * vh) / 100).toFixed(1)}px, ${z.toFixed(1)}px) rotate(${c.rot}deg)`
  }
}

function riseLetters() {
  const line = root.value?.querySelector<HTMLElement>('[data-line1]')
  if (!line || still) return
  letters?.revert()
  letters = SplitText.create(line, { type: 'words,chars', mask: 'chars' })
  gsap.from(letters.chars, {
    yPercent: 110,
    stagger: 0.02,
    duration: 1.2,
    ease: 'expo.out',
    delay: 0.2,
    // Unwrap afterwards so accents and descenders aren't clipped by the masks
    onComplete: () => {
      letters?.revert()
      letters = null
    },
  })
}

function collectParts() {
  const q = (sel: string) => root.value?.querySelector<HTMLElement>(sel) ?? null
  parts = { dusk: q('[data-sky="dusk"]'), night: q('[data-sky="night"]'), line2: q('[data-line2]'), lead: q('[data-lead]'), hint: q('[data-hint]') }
}

function onResize() {
  vw = window.innerWidth
  vh = window.innerHeight
  render()
}

onMounted(() => {
  cardEls = Array.from(root.value!.querySelectorAll<HTMLElement>('[data-card]'))
  collectParts()
  window.addEventListener('resize', onResize)
  render()
  if (still) return

  ctx = gsap.context(() => {
    const mobile = window.matchMedia('(max-width: 767px)').matches
    gsap.to(progress, {
      p: 1,
      ease: 'none',
      onUpdate: render,
      scrollTrigger: {
        trigger: root.value,
        start: 'top top',
        end: () => `+=${Math.round(window.innerHeight * (mobile ? 2 : 2.4))}`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })

    // Load: the photos glide in out of the haze while the day line rises
    gsap.from(intro, { offset: -0.12, duration: 2.6, ease: 'expo.out', onUpdate: render })
    riseLetters()
    gsap.from('[data-hero-fade]', { autoAlpha: 0, y: 16, stagger: 0.1, duration: 1.4, ease: 'expo.out', delay: 0.9 })
  }, root.value!)
})

watch(locale, async () => {
  await nextTick()
  collectParts() // the headline is re-created per language
  render()
  ctx?.add(riseLetters)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  letters?.revert()
  ctx?.revert()
})
</script>

<template>
  <section
    id="top"
    ref="root"
    class="relative h-svh min-h-[560px] overflow-hidden"
    style="--hero-fg: #000000; --hero-bg: #f9f6ef; --hero-muted: #6e6a63"
  >
    <!-- Sky -->
    <div class="absolute inset-0" aria-hidden="true">
      <div class="absolute inset-0 bg-[linear-gradient(180deg,#fdf0cf_0%,#fbf3e3_45%,#f9f6ef_100%)]">
        <div class="glows">
          <span class="-top-1/4 right-[5%] h-[70%] w-[45%] [--c:#ffe08a]"></span>
          <span class="top-[30%] -left-[10%] h-[60%] w-[45%] [--c:#ffe1c4] [animation-delay:-9s]"></span>
        </div>
      </div>
      <div data-sky="dusk" class="absolute inset-0 bg-[linear-gradient(180deg,#1f2563_0%,#7e3b78_50%,#f0895c_100%)] opacity-0"></div>
      <div data-sky="night" class="absolute inset-0 bg-[linear-gradient(180deg,#020308_0%,#060a1c_60%,#0c1131_100%)] opacity-0">
        <div class="glows">
          <span class="-top-1/4 left-[10%] h-[70%] w-[50%] [--c:#22389e]"></span>
          <span class="top-[20%] right-[0%] h-[65%] w-[45%] [--c:#7a1f4d] [animation-delay:-8s]"></span>
          <span class="bottom-[-20%] left-[35%] h-[50%] w-[40%] [--c:#1f5219] [animation-delay:-15s]"></span>
        </div>
      </div>
    </div>

    <!-- Photos in 3D along the road -->
    <div class="drive-scene absolute inset-0 [perspective:900px] [perspective-origin:50%_42%]" aria-hidden="true">
      <div class="absolute top-[42%] left-1/2 [transform-style:preserve-3d]">
        <!--
          The card is placed in 3D by render() and is the only thing that takes the cursor. What moves
          on hover (see vLift) lives inside it, so the hovered area never changes under the cursor.
        -->
        <div
          v-for="c in cards"
          :key="c.key"
          v-lift="80"
          data-card
          class="lift-card invisible absolute top-0 left-0 w-[calc(clamp(150px,24vw,400px)*var(--s,1))] -translate-x-1/2 -translate-y-1/2 will-change-transform [transform-style:preserve-3d]"
          :style="{ '--s': c.size }"
        >
          <div data-lift class="lift-frame relative overflow-hidden rounded-xl" :style="{ aspectRatio: c.ratio }">
            <img data-lift-img :src="c.src" alt="" draggable="false" class="h-full w-full object-cover" />
            <span class="lift-sheen"></span>
            <span class="lift-glare"></span>
            <span class="lift-caption">
              <span class="lift-line"><span>{{ tx(c.title) }}</span></span>
              <span class="lift-line lift-line-sub"><span>{{ tx(c.caption) }}</span></span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Time readout: the drive runs from noon to six in the morning -->
    <div data-hero-fade class="pointer-events-none absolute top-24 right-5 z-10 text-right sm:top-28 sm:right-10" style="color: var(--hero-fg)">
      <p class="text-[13px]" style="color: var(--hero-muted)">{{ t.hero.city }}</p>
      <p class="type-day text-[clamp(1.6rem,3vw,2.6rem)] tabular-nums">{{ clock }}</p>
      <p data-hint class="mt-3 flex items-center justify-end gap-2 text-[13px]" style="color: var(--hero-muted)">
        {{ t.hero.scroll }}
        <span class="hero-hint-line relative block h-6 w-px overflow-hidden" style="background: var(--hero-muted)"></span>
      </p>
    </div>

    <!-- Headline and actions. The layer lets the cursor through to the photos; only the buttons catch it. -->
    <div class="pointer-events-none relative z-10 flex h-full flex-col justify-end px-5 pb-8 sm:px-10 sm:pb-12">
      <h1 :key="locale">
        <span data-line1 class="type-day block text-[clamp(2.4rem,7vw,7.5rem)]" style="color: var(--hero-fg)">
          {{ t.hero.line1 }}
        </span>
        <span data-line2 class="type-night text-gradient -mb-[0.1em] block pb-[0.1em] text-[clamp(3rem,9vw,9.5rem)]">
          {{ t.hero.line2 }}
        </span>
      </h1>
      <div class="mt-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-5 sm:mt-8">
        <p data-lead class="max-w-[34rem] sm:text-lg" style="color: var(--hero-muted)">{{ t.hero.lead }}</p>
        <div data-hero-fade class="pointer-events-auto flex flex-wrap items-center gap-x-8 gap-y-4">
          <a
            v-magnetic="0.25"
            :href="site.dm"
            target="_blank"
            rel="noopener noreferrer"
            class="hero-cta rounded-full px-7 py-3.5 font-medium"
          >
            {{ t.hero.book }}
          </a>
          <a href="#dan" class="link font-medium" style="color: var(--hero-fg)">{{ t.hero.seeWork }}</a>
        </div>
      </div>
    </div>
  </section>
</template>
