// Facts that are the same in every language. Translated copy lives in src/i18n/en.ts and sr.ts.

export const site = {
  name: 'Jovan Živković',
  handle: 'tofugao',
  instagram: 'https://www.instagram.com/tofugao/',
  dm: 'https://ig.me/m/tofugao',
  timezone: 'Europe/Belgrade',
}

// Profile pictures of the crews and venues, saved from their public Instagram profiles (150x150).
const logos = import.meta.glob<string>('../assets/collaborators/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
})

const crew = (name: string, handle: string) => ({
  name,
  handle,
  url: `https://www.instagram.com/${handle}/`,
  logo: logos[`../assets/collaborators/${handle}.jpg`] ?? '',
})

/** People, crews and venues Jovan has shot for or with (from post captions and collabs). */
export const collaborators = [
  crew('JDM Club Tomodachi NS', 'jdmclubtomodachins'),
  crew('Auto Moto Berza', 'automotoberza'),
  crew('When We Were Young!', 'whenwewereyoung_ns'),
  crew('Leto na kampusu', 'letonakampusu'),
  crew('Buč Kesidi', 'buckesidi'),
  crew('DJ Night Mare', 'dj_nightmarespins'),
  crew('Auto JPG', 'auto_jpg'),
  crew('KC Lab', 'kc_lab021'),
  crew('Borisov atelje', 'borisov_atelje'),
]
