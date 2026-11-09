const en = {
  meta: {
    title: 'tofugao · Jovan Živković, cars & parties photographer',
    description:
      'Jovan Živković (tofugao) photographs car meets, car shows, club nights and concerts in Novi Sad and Belgrade, and edits in Lightroom and Photoshop.',
  },
  lang: { label: 'Language', en: 'English', sr: 'Srpski' },
  nav: {
    work: 'Work',
    index: 'Index',
    about: 'About',
    contact: 'Contact',
    book: 'Book a shoot',
    bookMobile: 'Book a shoot on Instagram',
    menu: 'Menu',
    close: 'Close',
  },
  hero: {
    line1: 'Cars by day,',
    line2: 'parties by night.',
    lead: 'Photographer from Novi Sad and Belgrade. I shoot car meets, car shows, club nights and concerts, and finish every set in Lightroom and Photoshop.',
    book: 'Book a shoot',
    seeWork: 'See the work',
    scroll: 'Scroll',
    city: 'Novi Sad',
  },
  day: {
    title: 'Day',
    intro: 'Car meets, car shows and car shoots around Novi Sad and Belgrade.',
  },
  night: {
    title: 'Night',
    intro: 'Club nights, concerts and everything that happens after midnight.',
  },
  work: {
    ctaTitle: 'Your car or your party next?',
    view: (title: string, caption: string) => `View ${title}, ${caption}`,
  },
  index: {
    title: 'Index',
    posts: (n: number) => `${n} ${n === 1 ? 'post' : 'posts'}`,
    everything: 'See everything on Instagram',
    cols: { no: 'No.', project: 'Project', type: 'Type', details: 'Details', date: 'Date' },
  },
  about: {
    title: 'About',
    lead: 'I bought my first camera in 2025 and started from zero. A year on, I spend weekends at car meets and nights in clubs around Novi Sad and Belgrade.',
    body: 'Started on a Canon 1200D, now shooting a 750D with the 18–55 kit lens and editing everything in Lightroom and Photoshop. Car meets, car shows, club nights and concerts: if you are putting something on, send me a message.',
    imageAlt: 'One year of tofugao, 2025–2026',
    figcaption: 'One-year anniversary post, June 2026',
    facts: [
      { label: 'Based in', value: 'Novi Sad & Belgrade' },
      { label: 'Shoots', value: 'Car meets, car shows, club nights, concerts' },
      { label: 'Camera', value: 'Canon EOS 750D' },
      { label: 'Lens', value: 'EF-S 18–55mm f/3.5–5.6' },
      { label: 'Editing', value: 'Lightroom, Photoshop' },
      { label: 'Bookings', value: 'Instagram DM' },
    ],
    collaborators: 'Shot for & with',
  },
  contact: {
    title: 'Got a meet, a party or a car worth shooting?',
    dm: 'Send a DM on Instagram',
    instagram: 'Instagram',
    basedIn: 'Based in',
    basedValue: 'Novi Sad & Belgrade',
    localTime: 'Local time',
    inNoviSad: 'in Novi Sad',
    rights: (year: number, name: string) => `© ${year} ${name}. Photos by tofugao unless credited.`,
    top: 'Back to top',
  },
  lightbox: {
    close: 'Close',
    viewPost: 'View on Instagram',
    prev: '← Prev',
    next: 'Next →',
  },
}

export type Messages = typeof en
export default en
