<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { projectById, type Shot } from '@/data/projects'
import { useI18n } from '@/i18n'
import { lockScroll } from '@/lib/smooth'

const props = defineProps<{ shots: Shot[]; index: number | null }>()
const emit = defineEmits<{ close: []; change: [index: number] }>()
const { t, tx, formatMonthYear } = useI18n()

const shot = computed(() => (props.index === null ? null : (props.shots[props.index] ?? null)))
const project = computed(() => (shot.value ? projectById(shot.value.project) : undefined))
const label = computed(() => (shot.value ? `${tx(shot.value.title)}, ${tx(shot.value.caption)}` : ''))
const pad = (n: number) => String(n).padStart(2, '0')

const closeBtn = ref<HTMLButtonElement | null>(null)
let returnFocusTo: HTMLElement | null = null
let touchStartX = 0

function step(delta: number) {
  if (props.index === null) return
  const n = props.shots.length
  emit('change', (props.index + delta + n) % n)
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
  else if (e.key === 'ArrowRight') step(1)
  else if (e.key === 'ArrowLeft') step(-1)
}

function onTouchEnd(e: TouchEvent) {
  const dx = (e.changedTouches[0]?.clientX ?? touchStartX) - touchStartX
  if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
}

function lock(open: boolean) {
  lockScroll(open)
  if (open) window.addEventListener('keydown', onKey)
  else window.removeEventListener('keydown', onKey)
}

watch(
  () => props.index !== null,
  async (open) => {
    if (open) {
      returnFocusTo = document.activeElement as HTMLElement | null
      lock(true)
      await nextTick()
      closeBtn.value?.focus()
    } else {
      lock(false)
      returnFocusTo?.focus()
    }
  },
)

onBeforeUnmount(() => lock(false))
</script>

<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="shot"
        class="text-paper fixed inset-0 z-[100] flex flex-col bg-[#0e0e0d]"
        role="dialog"
        aria-modal="true"
        :aria-label="label"
        @touchstart.passive="touchStartX = $event.touches[0]?.clientX ?? 0"
        @touchend.passive="onTouchEnd"
      >
        <div class="flex items-center justify-between px-5 py-4 text-sm sm:px-8">
          <span class="text-paper/55 text-[13px] tabular-nums">{{ pad((index ?? 0) + 1) }} / {{ pad(shots.length) }}</span>
          <button ref="closeBtn" type="button" class="link" @click="emit('close')">{{ t.lightbox.close }}</button>
        </div>

        <div class="flex min-h-0 flex-1 items-center justify-center px-5 sm:px-16" @click.self="emit('close')">
          <Transition name="fade" mode="out-in">
            <img
              :key="shot.id"
              :src="shot.src"
              :alt="label"
              :width="shot.width"
              :height="shot.height"
              class="block h-auto max-h-[calc(100svh-9.5rem)] w-auto max-w-full rounded-lg object-contain"
            />
          </Transition>
        </div>

        <div class="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 px-5 py-5 text-sm sm:px-8">
          <div>
            <p>{{ tx(shot.title) }}</p>
            <p class="text-paper/50">
              {{ tx(shot.caption) }}<template v-if="project"> · {{ formatMonthYear(project.date) }}</template>
            </p>
          </div>
          <div class="flex items-center gap-6">
            <a
              v-if="project"
              :href="project.post"
              target="_blank"
              rel="noopener noreferrer"
              class="link text-paper/70 hover:text-paper"
            >
              {{ t.lightbox.viewPost }}
            </a>
            <button type="button" class="link" @click="step(-1)">{{ t.lightbox.prev }}</button>
            <button type="button" class="link" @click="step(1)">{{ t.lightbox.next }}</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
