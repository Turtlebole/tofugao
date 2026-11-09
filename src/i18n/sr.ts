import type { Messages } from './en'

/** Serbian plural: 1 objava, 2–4 objave, 5+ objava (21 objava, 22 objave, 11–14 objava). */
function plural(n: number, one: string, few: string, many: string) {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return one
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few
  return many
}

// Srpski, latinica. Tone matches Jovan's captions: casual, "ti" form.
const sr: Messages = {
  meta: {
    title: 'tofugao · Jovan Živković, fotograf automobila i žurki',
    description:
      'Jovan Živković (tofugao) fotografiše auto skupove, izložbe automobila, klupske žurke i koncerte u Novom Sadu i Beogradu, a fotografije obrađuje u Lightroomu i Photoshopu.',
  },
  lang: { label: 'Jezik', en: 'English', sr: 'Srpski' },
  nav: {
    work: 'Radovi',
    index: 'Indeks',
    about: 'O meni',
    contact: 'Kontakt',
    book: 'Zakaži snimanje',
    bookMobile: 'Zakaži snimanje na Instagramu',
    menu: 'Meni',
    close: 'Zatvori',
  },
  hero: {
    line1: 'Automobili danju,',
    line2: 'žurke noću.',
    lead: 'Fotograf iz Novog Sada i Beograda. Fotografišem auto skupove, izložbe automobila, klupske žurke i koncerte, a svaki set doterujem u Lightroomu i Photoshopu.',
    book: 'Zakaži snimanje',
    seeWork: 'Pogledaj radove',
    scroll: 'Skroluj',
    city: 'Novi Sad',
  },
  day: {
    title: 'Dan',
    intro: 'Auto skupovi, izložbe i snimanja automobila po Novom Sadu i Beogradu.',
  },
  night: {
    title: 'Noć',
    intro: 'Klupske žurke, koncerti i sve što se dešava posle ponoći.',
  },
  work: {
    ctaTitle: 'Sledeće fotkam tvoj auto ili tvoju žurku?',
    view: (title, caption) => `Otvori: ${title}, ${caption}`,
  },
  index: {
    title: 'Indeks',
    posts: (n) => `${n} ${plural(n, 'objava', 'objave', 'objava')}`,
    everything: 'Pogledaj sve na Instagramu',
    cols: { no: 'Br.', project: 'Projekat', type: 'Vrsta', details: 'Detalji', date: 'Datum' },
  },
  about: {
    title: 'O meni',
    lead: 'Prvi aparat sam kupio 2025. i krenuo od nule. Godinu dana kasnije, vikende provodim na auto skupovima, a noći po klubovima Novog Sada i Beograda.',
    body: 'Počeo sam sa Canonom 1200D, a danas koristim 750D sa kit objektivom 18–55. Sve fotografije obrađujem u Lightroomu i Photoshopu. Auto skupovi, izložbe, klupske žurke i koncerti: ako nešto organizuješ, javi mi se.',
    imageAlt: 'tofugao, prva godina (2025–2026)',
    figcaption: 'Objava za prvu godišnjicu, jun 2026.',
    facts: [
      { label: 'Lokacija', value: 'Novi Sad i Beograd' },
      { label: 'Fotografišem', value: 'Auto skupove, izložbe automobila, žurke, koncerte' },
      { label: 'Aparat', value: 'Canon EOS 750D' },
      { label: 'Objektiv', value: 'EF-S 18–55mm f/3.5–5.6' },
      { label: 'Obrada', value: 'Lightroom, Photoshop' },
      { label: 'Zakazivanje', value: 'Poruka na Instagramu' },
    ],
    collaborators: 'Saradnje',
  },
  contact: {
    title: 'Imaš skup, žurku ili auto vredan fotkanja?',
    dm: 'Pošalji poruku na Instagramu',
    instagram: 'Instagram',
    basedIn: 'Lokacija',
    basedValue: 'Novi Sad i Beograd',
    localTime: 'Lokalno vreme',
    inNoviSad: 'u Novom Sadu',
    rights: (year, name) => `© ${year} ${name}. Fotografije: tofugao, osim gde je drugačije navedeno.`,
    top: 'Na vrh',
  },
  lightbox: {
    close: 'Zatvori',
    viewPost: 'Pogledaj na Instagramu',
    prev: '← Prethodna',
    next: 'Sledeća →',
  },
}

export default sr
