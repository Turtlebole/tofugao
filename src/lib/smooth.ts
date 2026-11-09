import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { gsap, ScrollTrigger } from './gsap'

/**
 * Smooth scrolling with Lenis, driven by GSAP's ticker so scroll position and every
 * ScrollTrigger animation update in the same frame (no drift, no double rAF loops).
 * Lenis turns its own smoothing off for visitors who prefer reduced motion.
 */
let lenis: Lenis | null = null

export function initSmoothScroll() {
  lenis = new Lenis({
    lerp: 0.085,
    wheelMultiplier: 0.95,
    // In-page links (#work, #about…) glide to their section, clear of the floating header
    anchors: { offset: -88, duration: 1.4 },
  })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis?.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
}

/** Freeze page scrolling while an overlay (menu, lightbox) is open. */
export function lockScroll(locked: boolean) {
  document.documentElement.style.overflow = locked ? 'hidden' : ''
  if (locked) lenis?.stop()
  else lenis?.start()
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.6 })
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}
