import Script from 'next/script'

import { GTM_ID } from '@/config'

const GTM = () => (
  <>
    <Script
      async
      strategy='worker'
      src={`https://www.googletagmanager.com/gtag/js?id=${GTM_ID}`}
    />
    <Script
      id='gtm-base'
      strategy='worker'
      dangerouslySetInnerHTML={{
        __html: `window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GTM_ID}');`,
      }}
    />
  </>
)

export default GTM
