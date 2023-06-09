import { Head, Html, Main, NextScript } from 'next/document'

import { PRELOAD_FONTS } from '@/config'
import { isDev } from '@/lib/utils'

const Document = () => (
  <Html className={isDev ? 'dev' : undefined}>
    <Head>
      <meta charSet='UTF-8' />
      {PRELOAD_FONTS?.map(({ href, type, id }) => (
        <link
          key={id}
          href={href}
          as='font'
          rel='preload prefetch'
          type={type}
          crossOrigin='anonymous'
        />
      ))}
    </Head>
    <body className='loading'>
      <Main />
      <NextScript />
    </body>
  </Html>
)

export default Document
