import { isDev } from '@/lib/utils'

import GTM from './gtm'
import Meta from './meta'
import SEO from './seo'

const Head = () => {
  return (
    <>
      <SEO />
      <Meta />
      {!isDev && <GTM />}
    </>
  )
}

export default Head
