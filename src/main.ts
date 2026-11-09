import { createApp } from 'vue'
import App from './App.vue'
import { ScrollTrigger } from './lib/gsap'
import { initSmoothScroll } from './lib/smooth'
import './style.css'

initSmoothScroll()
createApp(App).mount('#app')

// Images and web fonts change the page height after first paint; re-measure scroll animations.
window.addEventListener('load', () => ScrollTrigger.refresh())
document.fonts?.ready.then(() => ScrollTrigger.refresh())
