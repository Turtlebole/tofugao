<script setup lang="ts">
import { projectById } from '@/data/projects'
import { vReveal, vTilt } from '@/directives'
import { useI18n } from '@/i18n'

const { t } = useI18n()
const anniversary = projectById('one-year')
</script>

<template>
  <section id="about" class="mx-auto max-w-7xl px-5 pb-32 sm:px-8 sm:pb-44">
    <h2 v-reveal class="type-night text-[clamp(3rem,8vw,6.5rem)]">{{ t.about.title }}</h2>

    <div v-reveal="100" class="mt-10 grid gap-3 lg:mt-14 lg:grid-cols-12">
      <!-- Story -->
      <article class="bg-card rounded-[1.75rem] p-7 sm:p-12 lg:col-span-8">
        <p class="text-[clamp(1.45rem,2.5vw,2.15rem)] leading-[1.18] font-semibold tracking-[-0.02em] [font-stretch:100%]">
          {{ t.about.lead }}
        </p>
        <p class="text-fg-muted mt-8 max-w-[60ch]">{{ t.about.body }}</p>
      </article>

      <!-- The anniversary post is a cream poster: shown whole on its own paper, like a print -->
      <figure v-if="anniversary" v-tilt="6" class="group bg-paper ring-rule relative flex flex-col rounded-[1.75rem] p-4 ring-1 lg:col-span-4 lg:row-span-2">
        <div class="flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-lg">
          <img
            :src="anniversary.cover"
            :alt="t.about.imageAlt"
            width="480"
            height="640"
            loading="lazy"
            class="block max-h-full w-auto max-w-full object-contain transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
          />
        </div>
        <figcaption class="text-ink/60 mt-3 px-1 text-[13px]">{{ t.about.figcaption }}</figcaption>
      </figure>

      <!-- Facts -->
      <dl class="bg-card grid gap-x-8 gap-y-6 rounded-[1.75rem] p-7 sm:grid-cols-2 sm:p-10 lg:col-span-8 lg:grid-cols-3">
        <div v-for="f in t.about.facts" :key="f.label">
          <dt class="text-fg-muted text-[13px]">{{ f.label }}</dt>
          <dd class="mt-1 text-[15px] font-medium">{{ f.value }}</dd>
        </div>
      </dl>
    </div>
  </section>
</template>
