<script setup lang="ts">
import { useId } from 'vue'

// Inline SVG flags: emoji flags don't render on Windows (they show as "GB" / "RS").
defineProps<{ code: 'gb' | 'rs' }>()
const id = useId()
</script>

<template>
  <!-- Serbia (civil flag: red, blue, white) -->
  <svg v-if="code === 'rs'" viewBox="0 0 3 2" aria-hidden="true">
    <rect width="3" height="2" fill="#fff" />
    <rect width="3" height="1.3334" fill="#0c4076" />
    <rect width="3" height="0.6667" fill="#c6363c" />
  </svg>

  <!-- United Kingdom -->
  <svg v-else viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <clipPath :id="`${id}-s`"><path d="M0,0 v30 h60 v-30 z" /></clipPath>
    <clipPath :id="`${id}-t`"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" /></clipPath>
    <g :clip-path="`url(#${id}-s)`">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" :clip-path="`url(#${id}-t)`" stroke="#c8102e" stroke-width="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#c8102e" stroke-width="6" />
    </g>
  </svg>
</template>
