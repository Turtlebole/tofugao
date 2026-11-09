<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const props = defineProps<{ timeZone: string }>()

const fmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: props.timeZone,
  hour: '2-digit',
  minute: '2-digit',
})
const now = ref(fmt.format(new Date()))
let timer: number | undefined

onMounted(() => {
  timer = window.setInterval(() => (now.value = fmt.format(new Date())), 15_000)
})
onBeforeUnmount(() => window.clearInterval(timer))
</script>

<template>
  <time>{{ now }}</time>
</template>
