import { afterFirstPaint } from './paint'

/*
 * The brand fonts (src/fonts.css) load after the page has painted, so they never hold up the first
 * paint or compete with the hero photos for bandwidth. Until then the page uses the system font
 * (style.css switches over when <html> gets the `fonts` class), and the hero keeps its text hidden
 * so the headline never flashes in the wrong font.
 */

// One call per face; the sample text pulls in both the latin and latin-ext files.
const FACES = ['400 1em "Mona Sans"', 'italic 800 1em "Mona Sans"', '600 1em Outfit']
const SAMPLE = 'Ažćš'
// If a font is slow or blocked, show the text in the system font after this long
const GIVE_UP_MS = 4000

/** Resolves once the brand fonts are applied (or given up on), so layout can be measured and text revealed. */
export const fontsReady: Promise<void> = new Promise((resolve) => {
  let finished = false
  const finish = () => {
    if (finished) return
    finished = true
    document.documentElement.classList.add('fonts')
    resolve()
  }

  if (!document.fonts) {
    finish()
    return
  }
  afterFirstPaint(() => {
    setTimeout(finish, GIVE_UP_MS)
    Promise.all(FACES.map((face) => document.fonts.load(face, SAMPLE))).then(finish, finish)
  })
})
