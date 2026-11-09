import { createApp } from 'vue'
import App from './App.vue'
import { fontsReady } from './lib/fonts'
import { ScrollTrigger } from './lib/gsap'
import { initSmoothScroll } from './lib/smooth'
import './style.css'

initSmoothScroll()
createApp(App).mount('#app')

// Images and web fonts change the page height after first paint; re-measure scroll animations.
window.addEventListener('load', () => ScrollTrigger.refresh())
// The fonts change the text below the hero, not the hero (its height is the screen's and it is the
// only pinned section). A full refresh would unpin and re-pin it, repainting its photos after the
// first paint, which counts as a later largest paint.
fontsReady.then(() => {
  for (const trigger of ScrollTrigger.getAll()) if (!trigger.pin) trigger.refresh()
})
