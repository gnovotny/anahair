import NextHead from 'next/head'

const Meta = () => (
  <NextHead>
    <meta
      name='viewport'
      content='width=device-width, initial-scale=1'
    />
    <link
      rel='manifest'
      href='/site.webmanifest'
      key='site-manifest'
    />
    <meta
      name='msapplication-config'
      content='/browserconfig.xml'
    />
    <link
      rel='shortcut icon'
      href='/favicon.ico?v=2'
    />
    <link
      rel='apple-touch-icon'
      sizes='180x180'
      href='/icons/apple-touch-icon.png?v=2'
    />
    <link
      rel='icon'
      type='image/png'
      sizes='32x32'
      href='/icons/favicon-32x32.png?v=2'
    />
    <link
      rel='icon'
      type='image/png'
      sizes='16x16'
      href='/icons/favicon-16x16.png?v=2'
    />
    <link
      rel='mask-icon'
      href='/icons/safari-pinned-tab.svg?v=2'
      color='#233347'
    />
    <meta
      name='msapplication-TileColor'
      content='#2b5797'
    />
    <meta
      name='theme-color'
      content='#cccac0'
    />
  </NextHead>
)

export default Meta
