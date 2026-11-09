<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import logo from '@/assets/logo.jpg'
import { site } from '@/data/site'
import { useI18n, type Locale } from '@/i18n'
import { lockScroll } from '@/lib/smooth'
import FlagIcon from './FlagIcon.vue'

const { t, locale, setLocale } = useI18n()

const links = computed(() => [
  { label: t.value.nav.work, href: '#dan' },
  { label: t.value.nav.index, href: '#index' },
  { label: t.value.nav.about, href: '#about' },
  { label: t.value.nav.contact, href: '#contact' },
])
const locales: { code: Locale; flag: 'gb' | 'rs' }[] = [
  { code: 'sr', flag: 'rs' },
  { code: 'en', flag: 'gb' },
]

const open = ref(false)
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') open.value = false
}

watch(open, (isOpen) => lockScroll(isOpen))

onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  lockScroll(false)
})
</script>

<template>
  <!-- Floating glass bar; the wrapper ignores clicks so the page stays usable around it -->
  <header class="pointer-events-none fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-5">
    <div
      class="glass pointer-events-auto mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 rounded-full pr-2 pl-2.5 sm:pl-3"
    >
      <a href="#top" class="flex items-center gap-2.5" @click="open = false">
        <img :src="logo" alt="" width="32" height="32" class="size-8 rounded-full" />
        <span class="font-brand text-xl font-semibold tracking-tight max-[359px]:sr-only">tofugao</span>
      </a>

      <div class="flex items-center gap-2 sm:gap-3 md:gap-6">
        <nav aria-label="Main" class="hidden items-center gap-6 text-[15px] md:flex">
          <a v-for="l in links" :key="l.href" :href="l.href" class="link">{{ l.label }}</a>
        </nav>

        <!-- Language switch -->
        <div role="group" :aria-label="t.lang.label" class="bg-fg/5 flex items-center rounded-full p-0.5">
          <button
            v-for="l in locales"
            :key="l.code"
            type="button"
            class="flex items-center gap-1.5 rounded-full px-2 py-1.5 text-[12px] font-semibold uppercase transition-[background-color,color,box-shadow] duration-300 sm:py-1 sm:pr-2.5"
            :class="locale === l.code ? 'bg-surface text-fg shadow-[0_1px_3px_rgb(0_0_0/0.15)]' : 'text-fg-muted hover:text-fg'"
            :aria-pressed="locale === l.code"
            :lang="l.code === 'sr' ? 'sr-Latn' : 'en'"
            :title="t.lang[l.code]"
            @click="setLocale(l.code)"
          >
            <FlagIcon
              :code="l.flag"
              class="h-[11px] w-[16px] shrink-0 rounded-[2px] ring-1 ring-black/10 transition-opacity duration-300"
              :class="locale === l.code ? '' : 'opacity-50'"
            />
            <span class="hidden sm:inline">{{ l.code }}</span>
          </button>
        </div>

        <a
          :href="site.dm"
          target="_blank"
          rel="noopener noreferrer"
          class="bg-fg text-surface hover:bg-accent hover:text-on-accent hidden rounded-full px-4 py-2 text-[15px] font-medium transition-colors duration-500 md:inline-block"
        >
          {{ t.nav.book }}
        </a>

        <button
          type="button"
          class="bg-fg text-surface rounded-full px-3.5 py-2 text-[15px] font-medium md:hidden"
          :aria-expanded="open"
          aria-controls="mobile-menu"
          @click="open = !open"
        >
          {{ open ? t.nav.close : t.nav.menu }}
        </button>
      </div>
    </div>
  </header>

  <!-- Outside the header: the glass bar's backdrop-filter would otherwise trap position:fixed -->
  <Teleport to="body">
    <Transition name="fade">
      <nav
        v-if="open"
        id="mobile-menu"
        aria-label="Main"
        data-lenis-prevent
        class="bg-surface fixed inset-0 z-30 flex flex-col justify-between px-5 pt-24 pb-10 md:hidden"
      >
        <ul>
          <li v-for="l in links" :key="l.href" class="border-rule border-b">
            <a :href="l.href" class="type-day block py-4 text-[2.4rem]" @click="open = false">{{ l.label }}</a>
          </li>
        </ul>
        <a
          :href="site.dm"
          target="_blank"
          rel="noopener noreferrer"
          class="bg-fg text-surface rounded-full py-4 text-center font-medium"
        >
          {{ t.nav.bookMobile }}
        </a>
      </nav>
    </Transition>
  </Teleport>
</template>
