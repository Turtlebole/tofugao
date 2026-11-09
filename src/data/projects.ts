import type { Text } from '@/i18n'

// Every image in src/photos, keyed by file name.
const files = import.meta.glob<string>('../photos/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  query: '?url',
  import: 'default',
})

function photo(name: string): string {
  const url = files[`../photos/${name}`]
  if (!url) throw new Error(`Missing photo: src/photos/${name}`)
  return url
}

export type Category = 'cars' | 'parties'

/** One Instagram post / event. Listed in the project index. */
export interface Project {
  id: string
  title: Text
  kind: Text
  category: Category
  /** ISO date of the post. */
  date: string
  /** Who it was shot for / with, or what's in it. */
  credit?: Text
  cover: string
  post: string
}

/** A single photo in the "Selected work" grid. Sizes are the real pixel sizes. */
export interface Shot {
  id: string
  src: string
  width: number
  height: number
  title: Text
  caption: Text
  category: Category
  project: string
}

const ig = (code: string) => `https://www.instagram.com/p/${code}/`

const KIND = {
  party: { en: 'Party', sr: 'Žurka' },
  carShoot: { en: 'Car shoot', sr: 'Snimanje automobila' },
  carMeet: { en: 'Car meet', sr: 'Auto skup' },
  carShow: { en: 'Car show', sr: 'Izložba automobila' },
  concert: { en: 'Concert', sr: 'Koncert' },
  selection: { en: 'Selection', sr: 'Izbor' },
} satisfies Record<string, Text>

export const projects: Project[] = (
  [
    {
      id: 'wwwy-halloween',
      title: 'WWWY! Halloween recap',
      kind: KIND.party,
      category: 'parties',
      date: '2026-10-23',
      credit: 'When We Were Young!',
      cover: photo('cover-wwwy-halloween.jpg'),
      post: ig('De1vlL9F__v'),
    },
    {
      id: 'civic-eg',
      title: 'The mighty EG',
      kind: KIND.carShoot,
      category: 'cars',
      date: '2026-10-21',
      credit: { en: 'Honda Civic EG, with Auto JPG', sr: 'Honda Civic EG, sa Auto JPG' },
      cover: photo('cover-civic-eg.jpg'),
      post: ig('DewkCRZCLuj'),
    },
    {
      id: 'monotony-kills',
      title: 'Monotony kills',
      kind: KIND.carShoot,
      category: 'cars',
      date: '2026-10-13',
      credit: 'Mercedes S-Class W220',
      cover: photo('cover-monotony-kills.jpg'),
      post: ig('DeeEPaDCLqK'),
    },
    {
      id: 'jdm-tomodachi',
      title: 'JDM Club Tomodachi NS 2026',
      kind: KIND.carMeet,
      category: 'cars',
      date: '2026-10-01',
      credit: 'JDM Club Tomodachi NS',
      cover: photo('cover-jdm-tomodachi.jpg'),
      post: ig('Dd8nytxjH-t'),
    },
    {
      id: 'no-breaks',
      title: 'No Breaks: The Last Dance',
      kind: KIND.party,
      category: 'parties',
      date: '2026-09-30',
      credit: {
        en: 'DJ Night Mare at KC Lab, with mjauu.jpg',
        sr: 'DJ Night Mare u KC Labu, sa mjauu.jpg',
      },
      cover: photo('cover-no-breaks.jpg'),
      post: ig('Dd6N21PiM1M'),
    },
    {
      id: 'twingo',
      title: 'Le twongi',
      kind: KIND.carShoot,
      category: 'cars',
      date: '2026-09-21',
      credit: 'Renault Twingo',
      cover: photo('cover-twingo.jpg'),
      post: ig('Ddj_A1uHN7f'),
    },
    {
      id: 'wwwy-kc-lab',
      title: 'WWWY! Highlights 5.9.',
      kind: KIND.party,
      category: 'parties',
      date: '2026-09-12',
      credit: {
        en: 'When We Were Young! at KC Lab, with mjauu.jpg',
        sr: 'When We Were Young! u KC Labu, sa mjauu.jpg',
      },
      cover: photo('cover-wwwy-kc-lab.jpg'),
      post: ig('DdMaSJSl7l6'),
    },
    {
      id: 'amb-2',
      title: { en: 'Auto Moto Berza 2026, part 2', sr: 'Auto Moto Berza 2026, deo 2' },
      kind: KIND.carShow,
      category: 'cars',
      date: '2026-09-11',
      credit: 'Auto Moto Berza',
      cover: photo('cover-amb-2.jpg'),
      post: ig('DdJM-gKjFZ-'),
    },
    {
      id: 'amb-1',
      title: { en: 'Auto Moto Berza 2026, part 1', sr: 'Auto Moto Berza 2026, deo 1' },
      kind: KIND.carShow,
      category: 'cars',
      date: '2026-09-09',
      credit: 'Auto Moto Berza',
      cover: photo('cover-amb-1.jpg'),
      post: ig('DdD1IxyjB9k'),
    },
    {
      id: 'one-year',
      title: { en: 'One year of tofugao', sr: 'tofugao, prva godina' },
      kind: KIND.selection,
      category: 'parties',
      date: '2026-06-24',
      credit: { en: 'A year of work, 2025–2026', sr: 'Godina rada, 2025–2026' },
      cover: photo('cover-one-year.jpg'),
      post: ig('DZ-bk-1jAam'),
    },
    {
      id: 'wwwy-borisov',
      title: 'WWWY! Highlights 12.6.',
      kind: KIND.party,
      category: 'parties',
      date: '2026-06-23',
      credit: {
        en: 'At Borisov atelje, with shutter_alek & mjauu.jpg',
        sr: 'U Borisov ateljeu, sa shutter_alek i mjauu.jpg',
      },
      cover: photo('cover-wwwy-borisov.jpg'),
      post: ig('DZ8DcsCF4If'),
    },
    {
      id: 'buc-kesidi',
      title: "There's no love in club, love is on street",
      kind: KIND.concert,
      category: 'parties',
      date: '2025-10-01',
      credit: { en: 'Buč Kesidi at Leto na kampusu', sr: 'Buč Kesidi na Letu na kampusu' },
      cover: photo('cover-buc-kesidi.jpg'),
      post: ig('DPQufPlDA2D'),
    },
  ] satisfies Project[]
).sort((a, b) => b.date.localeCompare(a.date))

const allShots: Shot[] = [
  {
    id: 'amb-bmw',
    src: photo('cover-amb-1.jpg'),
    width: 444,
    height: 604,
    title: 'Auto Moto Berza 2026',
    caption: KIND.carShow,
    category: 'cars',
    project: 'amb-1',
  },
  {
    id: 'jdm-crx',
    src: photo('jdm-tomodachi-crx.jpg'),
    width: 436,
    height: 388,
    title: 'JDM Club Tomodachi NS',
    caption: 'Honda CR-X',
    category: 'cars',
    project: 'jdm-tomodachi',
  },
  {
    id: 'buc-kesidi',
    src: photo('cover-buc-kesidi.jpg'),
    width: 480,
    height: 640,
    title: 'Buč Kesidi',
    caption: 'Leto na kampusu, 2025',
    category: 'parties',
    project: 'buc-kesidi',
  },
  {
    id: 'w220',
    src: photo('cover-monotony-kills.jpg'),
    width: 480,
    height: 640,
    title: 'Monotony kills',
    caption: 'Mercedes S-Class W220',
    category: 'cars',
    project: 'monotony-kills',
  },
  {
    id: 'wwwy-crowd',
    src: photo('wwwy-kc-lab-crowd.jpg'),
    width: 480,
    height: 246,
    title: 'When We Were Young!',
    caption: 'KC Lab',
    category: 'parties',
    project: 'wwwy-kc-lab',
  },
  {
    id: 'amb-detail',
    src: photo('cover-amb-2.jpg'),
    width: 444,
    height: 604,
    title: 'Auto Moto Berza 2026',
    caption: { en: 'Detail', sr: 'Detalj' },
    category: 'cars',
    project: 'amb-2',
  },
  {
    id: 'twingo',
    src: photo('twingo.jpg'),
    width: 436,
    height: 296,
    title: 'Le twongi',
    caption: 'Renault Twingo',
    category: 'cars',
    project: 'twingo',
  },
  {
    id: 'hand',
    src: photo('one-year-hand.jpg'),
    width: 428,
    height: 282,
    title: { en: 'One year of tofugao', sr: 'tofugao, prva godina' },
    caption: '2025–2026',
    category: 'parties',
    project: 'one-year',
  },
]

/**
 * Display order for "Selected work": pairs of one portrait + one landscape, alternating
 * cars and parties, so every row on desktop is balanced.
 */
const ORDER = ['amb-bmw', 'wwwy-crowd', 'twingo', 'buc-kesidi', 'w220', 'hand', 'jdm-crx', 'amb-detail']

export const shots: Shot[] = [
  ...ORDER.map((id) => allShots.find((s) => s.id === id)).filter((s): s is Shot => !!s),
  ...allShots.filter((s) => !ORDER.includes(s.id)),
]

export const projectById = (id: string) => projects.find((p) => p.id === id)
