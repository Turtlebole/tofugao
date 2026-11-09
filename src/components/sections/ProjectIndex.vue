<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { projects, type Project } from '@/data/projects'
import { site } from '@/data/site'
import { vReveal } from '@/directives'
import { useI18n } from '@/i18n'
import { gsap } from '@/lib/gsap'

const { t, tx, formatMonthYear } = useI18n()
const pad = (n: number) => String(n).padStart(2, '0')

// Cover preview that follows the cursor while hovering a row (mouse/trackpad only).
const canHover = ref(false)
const hovered = ref<Project | null>(null)
const preview = ref<HTMLElement | null>(null)
let moveX: ((v: number) => void) | null = null
let moveY: ((v: number) => void) | null = null
let tilt: ((v: number) => void) | null = null
let lastX = 0

function onMove(e: PointerEvent) {
  moveX?.(e.clientX + 36)
  moveY?.(e.clientY)
  tilt?.(gsap.utils.clamp(-7, 7, (e.clientX - lastX) * 0.6))
  lastX = e.clientX
}

function onEnter(p: Project, e: PointerEvent) {
  if (!hovered.value && preview.value) gsap.set(preview.value, { x: e.clientX + 36, y: e.clientY })
  hovered.value = p
}

onMounted(async () => {
  canHover.value = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  await nextTick()
  {
    if (!preview.value) return
    gsap.set(preview.value, { yPercent: -50 })
    moveX = gsap.quickTo(preview.value, 'x', { duration: 0.7, ease: 'power3.out' })
    moveY = gsap.quickTo(preview.value, 'y', { duration: 0.7, ease: 'power3.out' })
    tilt = gsap.quickTo(preview.value, 'rotate', { duration: 0.9, ease: 'power3.out' })
  }
})
onBeforeUnmount(() => preview.value && gsap.killTweensOf(preview.value))
</script>

<template>
  <section id="index" class="mx-auto max-w-7xl px-5 pb-32 sm:px-8 sm:pb-44">
    <div class="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
      <h2 v-reveal class="type-night text-[clamp(3rem,8vw,6.5rem)]">{{ t.index.title }}</h2>
      <p class="text-fg-muted flex flex-wrap gap-x-5 text-[15px]">
        <span>{{ t.index.posts(projects.length) }}</span>
        <a :href="site.instagram" target="_blank" rel="noopener noreferrer" class="link text-fg font-medium">
          {{ t.index.everything }}
        </a>
      </p>
    </div>

    <div
      class="text-fg-muted border-rule mt-12 hidden grid-cols-[3.5rem_minmax(0,2.2fr)_11rem_minmax(0,1.6fr)_6rem] gap-6 border-b px-4 pb-3 text-[13px] md:grid"
      aria-hidden="true"
    >
      <span>{{ t.index.cols.no }}</span>
      <span>{{ t.index.cols.project }}</span>
      <span>{{ t.index.cols.type }}</span>
      <span>{{ t.index.cols.details }}</span>
      <span class="text-right">{{ t.index.cols.date }}</span>
    </div>

    <ul class="mt-6 md:mt-0" @pointermove="onMove" @pointerleave="hovered = null">
      <li v-for="(p, i) in projects" :key="p.id" class="border-rule border-b">
        <a
          :href="p.post"
          target="_blank"
          rel="noopener noreferrer"
          class="group hover:bg-fg/5 grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center gap-x-3 rounded-lg px-2 py-4 transition-colors duration-500 md:grid-cols-[3.5rem_minmax(0,2.2fr)_11rem_minmax(0,1.6fr)_6rem] md:gap-x-6 md:px-4 md:py-5"
          @pointerenter="onEnter(p, $event)"
        >
          <span class="text-fg-muted text-[13px] tabular-nums">{{ pad(projects.length - i) }}</span>

          <span class="flex min-w-0 items-center gap-3">
            <img :src="p.cover" alt="" class="size-12 shrink-0 rounded-lg object-cover md:hidden" loading="lazy" />
            <span class="min-w-0">
              <span
                class="block text-[1.05rem] leading-snug font-semibold [font-stretch:100%] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:translate-x-1.5 md:truncate md:text-[1.4rem]"
              >
                {{ tx(p.title) }}
              </span>
              <span class="text-fg-muted block text-[13px] md:hidden">{{ tx(p.kind) }}</span>
            </span>
          </span>

          <span class="text-fg/80 hidden truncate text-[15px] md:block">{{ tx(p.kind) }}</span>
          <span class="text-fg-muted hidden truncate text-[15px] md:block">{{ p.credit ? tx(p.credit) : '' }}</span>
          <span class="text-fg-muted text-right text-[13px] whitespace-nowrap tabular-nums">{{ formatMonthYear(p.date) }}</span>
        </a>
      </li>
    </ul>

    <div
      v-if="canHover"
      ref="preview"
      class="pointer-events-none fixed top-0 left-0 z-30 w-52 transition-opacity duration-500 xl:w-60"
      :class="hovered ? 'opacity-100' : 'opacity-0'"
      aria-hidden="true"
    >
      <div class="bg-card relative aspect-[3/4] overflow-hidden rounded-xl shadow-[0_28px_56px_-24px_rgb(0_0_0/0.55)]">
        <img
          v-for="p in projects"
          :key="p.id"
          :src="p.cover"
          alt=""
          loading="lazy"
          class="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          :class="hovered?.id === p.id ? 'opacity-100' : 'opacity-0'"
        />
      </div>
    </div>
  </section>
</template>
