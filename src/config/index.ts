export const WEBGL_ENABLED = true
export const PORTAL_WEBGL_ENABLED = true
export const INFO = {
  name: 'Ana Novotny Hair',
  googlePlaceUrl: 'https://g.page/ana-novotny-hair',
  streetAddress: 'Wildbachstrasse 43',
  streetAddress2: '8008 Zürich',
  tel: '+41 44 550 44 77',
  email: 'info@ananovotny.ch',
  instagramUrl: 'https://www.instagram.com/ananovotnyhair',
}

export const CANONICAL_URL = 'https://www.ananovotny.ch'
export const OG_IMAGE_URL = '/images/og_square.png'
export const OG_IMAGE = {
  url: OG_IMAGE_URL,
  width: 512,
  height: 512,
  alt: INFO.name,
  type: 'image/png',
}

export const GOOGLE_MAPS_API_KEY = 'AIzaSyCfYrlcQ1mfcbVP_sONxy448EWAu0eY_4k'

export const PRELOAD_FONTS = [
  {
    id: 'apercu-bold-pro',
    href: '/fonts/apercu/apercu-bold-pro.woff2',
    type: 'font/woff2',
  },
  {
    id: 'apercu-regular-pro',
    href: '/fonts/apercu/apercu-regular-pro.woff2',
    type: 'font/woff2',
  },
  {
    id: 'apercu-medium-pro',
    href: '/fonts/apercu/apercu-medium-pro.woff2',
    type: 'font/woff2',
  },
]
export const GTM_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || 'G-DGK1VWJZTB'
