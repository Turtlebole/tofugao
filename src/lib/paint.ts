import { ref, type Ref } from 'vue'

/** Turns true a moment after the first large paint (see afterFirstPaint). For things that can wait for it. */
export function useAfterFirstPaint(): Ref<boolean> {
  const settled = ref(false)
  afterFirstPaint(() => (settled.value = true))
  return settled
}

/**
 * Runs `fn` a moment after the page's first large paint, once the visitor can already see something.
 * Work that is not needed for that first view (the fonts, the photos further down the road) waits for
 * this so it never competes with it.
 *
 * Never waits longer than `giveUpMs`, in case the browser reports no paint.
 */
export function afterFirstPaint(fn: () => void, delayMs = 250, giveUpMs = 3000) {
  let ran = false
  const run = () => {
    if (ran) return
    ran = true
    fn()
  }
  const whenLoaded = () => {
    setTimeout(run, giveUpMs)
    try {
      new PerformanceObserver((list, observer) => {
        if (!list.getEntries().length) return
        observer.disconnect()
        setTimeout(run, delayMs)
      }).observe({ type: 'largest-contentful-paint', buffered: true })
    } catch {
      setTimeout(run, 500) // this browser does not report paint timing
    }
  }
  if (document.readyState === 'complete') whenLoaded()
  else window.addEventListener('load', whenLoaded, { once: true })
}
