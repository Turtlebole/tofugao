import { projectById, shots, type Shot } from './projects'

/** A photo or the booking tile in a bento grid. `span` is in grid cells (2 cols on phones, 4 on desktop). */
export type BentoTile = { kind: 'photo'; shot: Shot; span: string } | { kind: 'cta'; span: string }

const shot = (id: string): Shot => {
  const s = shots.find((x) => x.id === id)
  if (!s) throw new Error(`Unknown shot: ${id}`)
  return s
}

/** An Instagram cover (his posters) as a gallery photo. */
const cover = (projectId: string, width = 480, height = 640): Shot => {
  const p = projectById(projectId)
  if (!p) throw new Error(`Unknown project: ${projectId}`)
  return { id: `cover-${projectId}`, src: p.cover, width, height, title: p.title, caption: p.kind, category: p.category, project: p.id }
}

/*
 * Both grids fill a complete rectangle on desktop (4 columns) and phones (2 columns);
 * grid-flow-dense back-fills the gaps.
 *
 *   Day                               Night
 *   [BMW][   CR-X   ][W220]           [Buč][ WWWY crowd ][NoBreaks]
 *   [   ][          ][    ]           [   ][Hand][Hallow][        ]
 *   [  Twingo  ][Det][EG  ]           [Bor][KCLab][   Booking    ]
 */
export const daySet: BentoTile[] = [
  { kind: 'photo', shot: shot('amb-bmw'), span: 'row-span-2' },
  { kind: 'photo', shot: shot('jdm-crx'), span: 'col-span-2 row-span-2' },
  { kind: 'photo', shot: shot('w220'), span: 'row-span-2' },
  { kind: 'photo', shot: shot('twingo'), span: 'col-span-2' },
  { kind: 'photo', shot: shot('amb-detail'), span: '' },
  { kind: 'photo', shot: cover('civic-eg'), span: '' },
]

export const nightSet: BentoTile[] = [
  { kind: 'photo', shot: shot('buc-kesidi'), span: 'row-span-2' },
  { kind: 'photo', shot: shot('wwwy-crowd'), span: 'col-span-2' },
  { kind: 'photo', shot: cover('no-breaks'), span: 'row-span-2' },
  { kind: 'photo', shot: shot('hand'), span: '' },
  { kind: 'photo', shot: cover('wwwy-halloween'), span: '' },
  { kind: 'photo', shot: cover('wwwy-borisov'), span: '' },
  { kind: 'photo', shot: cover('wwwy-kc-lab'), span: '' },
  { kind: 'cta', span: 'col-span-2' },
]

/** Hero "night drive": car shots pass by in daylight, then party shots after dark. */
export const driveDay = [
  shot('jdm-crx'),
  shot('amb-bmw'),
  cover('jdm-tomodachi'),
  shot('w220'),
  shot('twingo'),
  cover('civic-eg'),
  shot('amb-detail'),
  cover('twingo'),
]
export const driveNight = [
  shot('wwwy-crowd'),
  shot('buc-kesidi'),
  cover('no-breaks'),
  shot('hand'),
  cover('wwwy-halloween'),
  cover('wwwy-kc-lab'),
  cover('wwwy-borisov'),
]
