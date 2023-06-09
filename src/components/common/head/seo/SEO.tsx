import { WithTranslation, withTranslation } from 'next-i18next'
import { DefaultSeo } from 'next-seo'

import { CANONICAL_URL, INFO, OG_IMAGE } from '@/config'

const SEO = ({ t, i18n: { language } }: WithTranslation) => (
  <DefaultSeo
    {...{
      defaultTitle: t('defaultTitle') ?? undefined,
      titleTemplate: t('titleTemplate') ?? undefined,
      description: t('defaultDescription') ?? undefined,
      openGraph: {
        title: t('defaultTitle') ?? undefined,
        description: t('defaultDescription') ?? undefined,
        type: 'website',
        locale: language === 'en' ? 'en_US' : 'de_CH',
        url: CANONICAL_URL,
        site_name: INFO.name,
        images: [OG_IMAGE],
      },
    }}
  />
)

export default withTranslation()(SEO)
