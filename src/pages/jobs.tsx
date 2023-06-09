import cn from 'clsx'
import { Trans, useTranslation } from 'next-i18next'
import { NextSeo } from 'next-seo'

import img from '@/assets/kitchen.jpg'
import CoverImage from '@/components/common/cover-image'
import { EmailLink, TelLink } from '@/components/common/links'
import { buildStaticPropsGetterWithTitle } from '@/lib/utils/page-data'

const LINK_PROPS = {
  className: cn(
    'font-serif font-bold text-primary transition-colors duration-[1300ms] decoration-1 underline-offset-4'
  ),
  lineProps: {
    className: cn(
      'after:h-[.125rem] before:h-[.125rem] md:after:h-[.175rem] md:before:h-[.175rem] xl:after:h-[.225rem] xl:before:h-[.225rem] after:bottom-[.15rem] before:bottom-[.15rem] md:after:bottom-[.1rem] md:before:bottom-[.1rem] xl:after:bottom-[.05rem] xl:before:bottom-[.05rem]'
    ),
  },
}

export default function JobsPage() {
  const { t } = useTranslation()

  return (
    <>
      <NextSeo title={t('jobs')} />
      <div
        className={cn(
          'relative w-full fit-nav-pt md:pt-0 flex flex-col-reverse justify-start items-start md:flex-row md:h-screen'
        )}
      >
        <div className='relative flex items-center justify-center w-full h-full px-6 pt-6 pb-6 md:w-1/2 md:pt-36 lg:px-12 lg:pt-48 lg:pb-12'>
          <div className='w-full md:max-w-sm lg:max-w-2xl'>
            <h2 className='font-sans text-xl font-medium text-special md:text-2xl md:text-[clamp(16px,4vh,2rem)] lg:text-3xl lg:text-[clamp(16px,4vh,2rem)] xl:text-4xl !leading-[1.5]'>
              <p>
                <Trans
                  i18nKey='jobs_text'
                  components={{
                    send_link: <EmailLink {...LINK_PROPS} />,
                    call_link: <TelLink {...LINK_PROPS} />,
                  }}
                />
              </p>
            </h2>
          </div>
        </div>
        <div className='relative w-full h-72 md:w-1/2 md:h-[200vh]'>
          <CoverImage src={img} />
        </div>
      </div>
    </>
  )
}

export const getStaticProps = buildStaticPropsGetterWithTitle('jobs')
