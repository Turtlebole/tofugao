<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { daySet, nightSet } from '@/data/sets'
import { useI18n } from '@/i18n'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import SiteHeader from '@/components/ui/SiteHeader.vue'
import About from '@/components/sections/About.vue'
import Contact from '@/components/sections/Contact.vue'
import Hero from '@/components/sections/Hero.vue'
import PhotoBento from '@/components/sections/PhotoBento.vue'
import ProjectIndex from '@/components/sections/ProjectIndex.vue'
import Stickers from '@/components/sections/Stickers.vue'

const { t } = useI18n()

// Night palette. The day palette is the :root default in style.css.
const NIGHT = {
  '--bg': '#060606',
  '--fg': '#f6f1e7',
  '--muted': '#9a948a',
  '--line': '#24221f',
  '--card': '#141312',
  '--accent': '#3b6cff',
  '--on-accent': '#ffffff',
  '--grain': 0.08,
}

// Day turns into night as the Night section scrolls up the screen.
let ctx: gsap.Context | null = null
onMounted(() => {
  ctx = gsap.context(() => {
    const scrollTrigger = prefersReducedMotion()
      ? { trigger: '#noc', start: 'top 60%', toggleActions: 'play none none reverse' }
      : { trigger: '#noc', start: 'top 85%', end: 'top 25%', scrub: true }
    gsap.to(document.documentElement, { ...NIGHT, ease: 'none', duration: 0.6, scrollTrigger })
  })
})
onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <div class="grain" aria-hidden="true"></div>
  <SiteHeader />
  <main>
    <Hero />
    <Stickers />
    <PhotoBento id="dan" mode="day" :title="t.day.title" :intro="t.day.intro" :tiles="daySet" />
    <PhotoBento id="noc" mode="night" :title="t.night.title" :intro="t.night.intro" :tiles="nightSet" />
    <ProjectIndex />
    <About />
    <Contact />
  </main>
</template>
