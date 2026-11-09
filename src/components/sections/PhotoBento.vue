<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { BentoTile } from '@/data/sets'
import type { Shot } from '@/data/projects'
import { site } from '@/data/site'
import { vTilt } from '@/directives'
import { useI18n } from '@/i18n'
import { gsap, prefersReducedMotion, ScrollTrigger, SplitText } from '@/lib/gsap'
import Lightbox from '@/components/ui/Lightbox.vue'

const props = defineProps<{
  id: string
  mode: 'day' | 'night'
  title: string
  intro: string
  tiles: BentoTile[]
}>()

const { t, tx, locale } = useI18n()

const photos = computed(() => props.tiles.flatMap((tile) => (tile.kind === 'photo' ? [tile.shot] : [])))
const openIndex = ref<number | null>(null)
const open = (s: Shot) => (openIndex.value = photos.value.indexOf(s))

/*
 * Motion: the section title rises letter by letter, tiles land as one staggered batch,
 * and each photo drifts slightly inside its frame while you scroll.
 */
const root = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null
let letters: SplitText | null = null

function riseTitle(animate: boolean) {
  const el = root.value?.querySelector<HTMLElement>('[data-title]')
  if (!el || prefersReducedMotion()) return
  const trigger = animate ? { scrollTrigger: { trigger: el, start: 'top 85%', once: true } } : {}

  // Night: the gradient title sweeps in like a light. (Splitting it into letters would hide the
  // gradient, which is clipped to the text of the whole heading.)
  if (props.mode === 'night') {
    gsap.fromTo(
      el,
      { clipPath: 'inset(-20% 100% -20% 0%)', xPercent: -3 },
      { clipPath: 'inset(-20% -5% -20% 0%)', xPercent: 0, duration: 1.6, ease: 'expo.inOut', ...trigger },
    )
    return
  }

  // Day: letters rise one by one
  letters?.revert()
  letters = SplitText.create(el, { type: 'chars', mask: 'chars' })
  const vars = {
    yPercent: 115,
    stagger: 0.05,
    duration: 1.3,
    ease: 'expo.out',
    onComplete: () => {
      letters?.revert()
      letters = null
    },
  }
  gsap.from(letters.chars, { ...vars, ...trigger })
}

onMounted(() => {
  if (!root.value || prefersReducedMotion()) return
  ctx = gsap.context(() => {
    riseTitle(true)
    gsap.set('[data-tile]', { autoAlpha: 0, y: 60, scale: 0.96 })
    ScrollTrigger.batch('[data-tile]', {
      start: 'top 92%',
      once: true,
      onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, scale: 1, stagger: 0.07, duration: 1.5, ease: 'expo.out' }),
    })
    gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
      gsap.fromTo(
        el,
        { yPercent: -5 },
        { yPercent: 5, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } },
      )
    })
  }, root.value)
})

watch(locale, async () => {
  await nextTick()
  ctx?.add(() => riseTitle(false))
})

onBeforeUnmount(() => {
  letters?.revert()
  ctx?.revert()
})
</script>

<template>
  <section :id="id" ref="root" class="mx-auto max-w-7xl px-5 pb-28 sm:px-8 sm:pb-40">
    <div class="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
      <h2
        :key="locale"
        data-title
        class="text-[clamp(4.5rem,15vw,12rem)]"
        :class="mode === 'day' ? 'type-day' : 'type-night text-gradient -mb-[0.08em] pb-[0.08em]'"
      >
        {{ title }}
      </h2>
      <p class="text-fg-muted max-w-[26rem] pb-2 sm:pb-4 sm:text-lg">{{ intro }}</p>
    </div>

    <div
      class="mt-8 grid grid-flow-dense auto-rows-[42vw] grid-cols-2 gap-2 sm:auto-rows-[30vw] sm:gap-3 lg:mt-12 lg:auto-rows-[clamp(170px,17vw,235px)] lg:grid-cols-4"
    >
      <div
        v-for="tile in tiles"
        :key="tile.kind === 'photo' ? tile.shot.id : 'cta'"
        data-tile
        class="min-h-0"
        :class="tile.span"
      >
        <!-- Booking tile (night only) -->
        <a
          v-if="tile.kind === 'cta'"
          :href="site.dm"
          target="_blank"
          rel="noopener noreferrer"
          class="bg-club group flex h-full flex-col justify-between overflow-hidden rounded-xl p-5 text-white sm:p-6"
        >
          <span class="type-night text-[clamp(1.6rem,3.2vw,2.6rem)] leading-[0.95]">{{ t.work.ctaTitle }}</span>
          <span
            class="self-start border-b border-white/60 pb-0.5 text-[15px] font-medium transition-[border-color] duration-500 group-hover:border-white"
          >
            {{ t.nav.book }}
          </span>
        </a>

        <!-- Photo tile -->
        <button
          v-else
          v-tilt="10"
          type="button"
          class="group bg-card relative isolate block h-full w-full cursor-zoom-in overflow-hidden rounded-xl text-left"
          :aria-label="t.work.view(tx(tile.shot.title), tx(tile.shot.caption))"
          @click="open(tile.shot)"
        >
          <span data-parallax class="absolute inset-x-0 -inset-y-[7%] block will-change-transform">
            <img
              :src="tile.shot.src"
              alt=""
              loading="lazy"
              decoding="async"
              class="h-full w-full object-cover transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-110"
            />
          </span>
          <span
            class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pt-14 pb-3.5 text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 pointer-coarse:opacity-100"
          >
            <span class="block truncate text-[15px] font-semibold">{{ tx(tile.shot.title) }}</span>
            <span class="block truncate text-[13px] text-white/75">{{ tx(tile.shot.caption) }}</span>
          </span>
        </button>
      </div>
    </div>

    <Lightbox :shots="photos" :index="openIndex" @close="openIndex = null" @change="openIndex = $event" />
  </section>
</template>
