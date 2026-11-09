import { computed, ref, watch } from 'vue'
import en from './en'
import sr from './sr'

export type Locale = 'en' | 'sr'

/** A piece of content: the same in every language, or one string per language. */
export type Text = string | Record<Locale, string>

const dictionaries = { en, sr }
const htmlLang: Record<Locale, string> = { en: 'en', sr: 'sr-Latn' }
const intlLocale: Record<Locale, string> = { en: 'en-US', sr: 'sr-Latn-RS' }

const isLocale = (v: unknown): v is Locale => v === 'en' || v === 'sr'

// ?lang=en in the URL wins, then the visitor's last choice; otherwise Serbian.
function initialLocale(): Locale {
  const fromUrl = new URLSearchParams(window.location.search).get('lang')
  if (isLocale(fromUrl)) return fromUrl
  try {
    const saved = localStorage.getItem('lang')
    if (isLocale(saved)) return saved
  } catch {
    /* storage blocked */
  }
  return 'sr'
}

export const locale = ref<Locale>(initialLocale())
export const t = computed(() => dictionaries[locale.value])

export const tx = (v: Text): string => (typeof v === 'string' ? v : v[locale.value])

export function setLocale(l: Locale) {
  locale.value = l
}

export const formatMonthYear = (iso: string) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString(intlLocale[locale.value], { month: 'short', year: 'numeric' })

watch(
  locale,
  (l) => {
    document.documentElement.lang = htmlLang[l]
    document.title = dictionaries[l].meta.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', dictionaries[l].meta.description)
    // Keep a shared ?lang= link in sync with the switch, so a reload doesn't flip it back
    const url = new URL(window.location.href)
    if (url.searchParams.has('lang') && url.searchParams.get('lang') !== l) {
      url.searchParams.set('lang', l)
      history.replaceState(history.state, '', url)
    }
    try {
      localStorage.setItem('lang', l)
    } catch {
      /* storage blocked */
    }
  },
  { immediate: true },
)

export function useI18n() {
  return { t, tx, locale, setLocale, formatMonthYear }
}
