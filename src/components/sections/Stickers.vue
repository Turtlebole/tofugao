<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { collaborators } from '@/data/site'
import { useI18n } from '@/i18n'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { useAfterFirstPaint } from '@/lib/paint'

const { t } = useI18n()

// Until the hero has painted, this section sits right under it, so even lazy images would start loading
// ahead of the hero's own photos. Their sources are set afterwards, when the hero's pin has pushed it away.
const settled = useAfterFirstPaint()

// Crew logos as die-cut slap stickers, the way they end up on bumpers and windows at a meet.
const tilts = [-8, 5, -3, 9, -6, 4, -10, 6, -2]

const list = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

onMounted(() => {
  if (!list.value || prefersReducedMotion()) return
  ctx = gsap.context(() => {
    gsap.from('[data-sticker]', {
      scale: 1.9,
      autoAlpha: 0,
      rotation: () => gsap.utils.random(-35, 35),
      duration: 0.75,
      ease: 'back.out(2.4)',
      stagger: 0.075,
      scrollTrigger: { trigger: list.value, start: 'top 85%', once: true },
    })
  }, list.value)
})
onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <!-- Clipped sideways: stickers start oversized before they slap down -->
  <section class="mx-auto max-w-5xl overflow-x-clip px-5 py-24 sm:px-8 sm:py-32" :aria-label="t.about.collaborators">
    <p class="text-fg-muted text-center text-[15px]">{{ t.about.collaborators }}</p>
    <ul ref="list" class="mt-10 flex flex-wrap justify-center">
      <li
        v-for="(c, i) in collaborators"
        :key="c.handle"
        class="-mx-1.5 my-1 sm:-mx-2.5"
        :style="{ zIndex: i % 2 ? 2 : 1 }"
      >
        <a
          data-sticker
          :href="c.url"
          target="_blank"
          rel="noopener noreferrer"
          :title="c.name"
          class="relative block rounded-full transition-[rotate,translate,scale] duration-500 ease-[var(--ease-out-expo)] hover:z-10 hover:-translate-y-2 hover:scale-110 hover:rotate-0 focus-visible:rotate-0"
          :style="{ rotate: `${tilts[i % tilts.length]}deg` }"
        >
          <img
            :src="settled ? c.logo : undefined"
            :alt="c.name"
            width="112"
            height="112"
            loading="lazy"
            class="size-20 rounded-full border-[5px] border-white object-cover shadow-[0_14px_26px_-12px_rgb(0_0_0/0.55)] sm:size-28 sm:border-[6px]"
          />
        </a>
      </li>
    </ul>
  </section>
</template>
