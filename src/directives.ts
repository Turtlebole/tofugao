import type { Directive } from 'vue'
import { gsap, prefersReducedMotion } from '@/lib/gsap'

const tweens = new WeakMap<HTMLElement, gsap.core.Tween>()
const cleanups = new WeakMap<HTMLElement, () => void>()

/**
 * GSAP scroll reveal, played once when the element comes into view.
 * Transform and opacity only, so it stays smooth.
 *   v-reveal          rise and fade in
 *   v-reveal.image    wipe the first child in from the bottom
 *   v-reveal="120"    optional delay in ms
 */
export const vReveal: Directive<HTMLElement, number | undefined, 'image'> = {
  mounted(el, { value, modifiers }) {
    if (prefersReducedMotion()) return
    const scrollTrigger = { trigger: el, start: 'top 88%', once: true }
    const delay = (value ?? 0) / 1000
    const tween = modifiers.image
      ? gsap.from(el.firstElementChild ?? el, { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.4, delay, scrollTrigger })
      : gsap.from(el, { autoAlpha: 0, y: 36, duration: 1.4, delay, scrollTrigger })
    tweens.set(el, tween)
  },
  unmounted(el) {
    const tween = tweens.get(el)
    tween?.scrollTrigger?.kill()
    tween?.kill()
    tweens.delete(el)
  },
}

/**
 * Hover for a photo hung in a 3D scene (the hero's night drive): the print jumps toward you with
 * a spring, leans toward the cursor and follows it a little, while its picture slides the other
 * way for depth. Value = how far it jumps toward you, in px (default 80).
 *
 * The listeners sit on the host, which never moves on hover, so all this can happen without the
 * hovered area changing under the cursor (no flicker at the edges). Inside it:
 *   [data-lift]      the frame: lifts, grows, leans
 *   [data-lift-img]  the picture: grows and slides against the cursor
 * The light, sheen, caption and shadow are CSS (.lift-* in style.css); this sets --gx and --gy for them.
 * The host's children must not take pointer events (.lift-card does that).
 * Skipped on touch screens and when the visitor prefers reduced motion.
 */
export const vLift: Directive<HTMLElement, number | undefined> = {
  mounted(el, { value }) {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const frame = el.querySelector<HTMLElement>('[data-lift]')
    const img = el.querySelector<HTMLElement>('[data-lift-img]')
    if (!fine || prefersReducedMotion() || !frame || !img) return

    const depth = value ?? 80
    const lean = 13 // degrees at the edge of the photo
    const follow = { duration: 0.7, ease: 'power3.out' }
    const leanX = gsap.quickTo(frame, 'rotationX', follow)
    const leanY = gsap.quickTo(frame, 'rotationY', follow)
    const frameX = gsap.quickTo(frame, 'x', follow)
    const frameY = gsap.quickTo(frame, 'y', follow)
    const imgX = gsap.quickTo(img, 'x', follow)
    const imgY = gsap.quickTo(img, 'y', follow)

    // The host's own box is what the pointer is over, so offsetX / offsetY already account for its 3D transform
    const move = (e: PointerEvent) => {
      const w = el.offsetWidth
      const h = el.offsetHeight
      const x = e.offsetX / w - 0.5 // cursor over the photo, -0.5 → 0.5
      const y = e.offsetY / h - 0.5
      leanX(-y * 2 * lean)
      leanY(x * 2 * lean)
      frameX(x * w * 0.08)
      frameY(y * h * 0.08)
      imgX(-x * w * 0.1)
      imgY(-y * h * 0.1)
      el.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`)
      el.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(1)}%`)
    }
    const enter = (e: PointerEvent) => {
      gsap.to(frame, { z: depth, scale: 1.1, duration: 1, ease: 'back.out(1.7)', overwrite: 'auto' })
      gsap.to(img, { scale: 1.16, duration: 1.2, ease: 'expo.out', overwrite: 'auto' })
      move(e)
    }
    const leave = () => {
      gsap.to(frame, { z: 0, scale: 1, duration: 1.3, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' })
      gsap.to(img, { scale: 1, duration: 0.9, overwrite: 'auto' })
      leanX(0)
      leanY(0)
      frameX(0)
      frameY(0)
      imgX(0)
      imgY(0)
    }
    el.addEventListener('pointerenter', enter)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    cleanups.set(el, () => {
      el.removeEventListener('pointerenter', enter)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      gsap.killTweensOf([frame, img])
      gsap.set([frame, img], { clearProps: 'transform' })
    })
  },
  unmounted(el) {
    cleanups.get(el)?.()
    cleanups.delete(el)
  },
}

/**
 * 3D tilt toward the cursor with a soft light glare, like turning a print in your hand.
 *   v-tilt="10"         max tilt in degrees (default 10)
 *   v-tilt.scene="14"   element already sits inside a 3D scene: don't add perspective to its parent
 * Uses the CSS `rotate` property (axis + angle), so it never fights an element's own transform.
 * Skipped on touch screens and when the visitor prefers reduced motion.
 */
export const vTilt: Directive<HTMLElement, number | undefined, 'scene'> = {
  mounted(el, { value, modifiers }) {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine || prefersReducedMotion()) return

    const max = value ?? 10
    if (!modifiers.scene && el.parentElement) el.parentElement.style.perspective = '900px'
    el.classList.add('tilt')
    const glare = document.createElement('span')
    glare.className = 'tilt-glare'
    glare.setAttribute('aria-hidden', 'true')
    el.appendChild(glare)

    const state = { x: 0, y: 0 } // cursor position over the element, -0.5 → 0.5
    const apply = () => {
      const ax = -state.y
      const ay = state.x
      const amount = Math.hypot(ax, ay)
      el.style.rotate = amount < 0.002 ? '' : `${ax.toFixed(3)} ${ay.toFixed(3)} 0 ${(amount * 2 * max).toFixed(2)}deg`
      el.style.setProperty('--gx', `${((state.x + 0.5) * 100).toFixed(1)}%`)
      el.style.setProperty('--gy', `${((state.y + 0.5) * 100).toFixed(1)}%`)
    }
    const to = (x: number, y: number, duration: number) =>
      gsap.to(state, { x, y, duration, ease: 'power3.out', overwrite: true, onUpdate: apply })

    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      to((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5, 0.6)
    }
    const leave = () => to(0, 0, 1)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerleave', leave)
    cleanups.set(el, () => {
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerleave', leave)
      gsap.killTweensOf(state)
      glare.remove()
    })
  },
  unmounted(el) {
    cleanups.get(el)?.()
    cleanups.delete(el)
  },
}
