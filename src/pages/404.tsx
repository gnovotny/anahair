import cn from 'clsx'
import { useTranslation } from 'next-i18next'
import { NextSeo } from 'next-seo'

import img from '@/assets/outside.jpg'
import CoverImage from '@/components/common/cover-image'
import { getServerSideTranslationProps, GetStaticPropsArgs } from '@/lib/utils/page-data'

export default function Error404Page() {
  const { t } = useTranslation()

  return (
    <>
      <NextSeo
        title={t('error_404_not_found_title')}
        noindex
      />
      <div
        className={cn(
          'relative w-full fit-nav-pt md:pt-0 flex flex-col-reverse justify-start items-start md:flex-row md:h-screen'
        )}
      >
        <div className='relative flex items-center justify-center w-full h-full px-6 pb-6 pt-36 md:w-1/2 lg:px-20 lg:pt-48 lg:pb-20'>
          <div className='w-full max-w-sm lg:max-w-2xl'>
            <h2 className='font-sans text-xl font-medium  md:text-2xl xl:text-4xl !leading-[1.5]'>
              {t('error_404_not_found_description')}
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

export async function getStaticProps(props: GetStaticPropsArgs) {
  return {
    props: {
      ...(await getServerSideTranslationProps(props)),
      title: 'error_404_not_found_title',
    },
  }
}
