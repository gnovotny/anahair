import cn from 'clsx'
import { useTranslation } from 'next-i18next'
import { NextSeo } from 'next-seo'

import scissorsImg from '@/assets/scissors.jpg'
import CoverImage from '@/components/common/cover-image'
import { buildStaticPropsGetterWithTitle } from '@/lib/utils/page-data'

export default function ServicesPage() {
  const { t } = useTranslation()

  return (
    <>
      <NextSeo title={t('services')} />
      <div
        className={cn(
          'relative w-full fit-nav-pt md:pt-0 flex flex-col-reverse justify-start items-start md:flex-row md:min-h-screen'
        )}
      >
        <div className='relative flex items-center justify-center w-full h-full px-6 pt-6 pb-6 md:w-1/2 md:pt-56 lg:px-12 lg:pt-64 lg:pb-12'>
          <div className='w-full max-w-2xl'>
            <div className='font-sans leading-normal text-[#333] md:text-xl'>
              <div className='flex-col space-y-6'>
                <div className='flex flex-col w-full space-y-6'>
                  <div className='flex-1 space-y-6'>
                    <div className='relative inline-block 2xl:-translate-x-[3rem]'>
                      <h3 className='font-serif text-xl text-primary md:text-2xl lg:text-2xl xl:text-3xl !leading-[1.5] '>
                        {t('women')}
                      </h3>
                    </div>
                    <dl className={cn('grid grid-cols-7 gap-x-3')}>
                      <dt className='col-span-3'>Cut</dt>
                      <dd className='italic text-center'></dd>
                      <dd className='text-right col-span-3'>182.-</dd>
                      <dt className='col-span-3'>Brushing</dt>
                      <dd className='italic text-center'>{t('from')}</dd>
                      <dd className='text-right col-span-3'>90.-</dd>
                      <dt className='col-span-3'>Form</dt>
                      <dd className='italic text-center'>{t('from')}</dd>
                      <dd className='text-right col-span-3'>90.-</dd>
                      <dt className='col-span-3'>Color</dt>
                      <dd className='italic text-center'>{t('from')}</dd>
                      <dd className='text-right col-span-3'>150.-</dd>
                      <dt className='col-span-3'>Glossing</dt>
                      <dd className='italic text-center'>{t('from')}</dd>
                      <dd className='text-right col-span-3'>90.-</dd>
                      <dt className='col-span-3'>Highlights</dt>
                      <dd className='italic text-center'>{t('from')}</dd>
                      <dd className='text-right col-span-3'>200.-</dd>
                      <dt className='col-span-3'>Balayage</dt>
                      <dd className='italic text-center'>{t('from')}</dd>
                      <dd className='text-right col-span-3'>200.-</dd>
                      <dt className='col-span-3'>Intensive Care</dt>
                      <dd className='italic text-center'>{t('from')}</dd>
                      <dd className='text-right col-span-3'>30.-</dd>
                      <dt className='col-span-3'>Olaplex</dt>
                      <dd className='italic text-center'>{t('from')}</dd>
                      <dd className='text-right col-span-3'>40.-</dd>
                      <dt className='col-span-3'>Keratin / BB</dt>
                      <dd className='italic text-center'></dd>
                      <dd className='text-right col-span-3'>{t('cost_basis')}</dd>
                      <dt className='col-span-3'>Tape-in</dt>
                      <dd className='italic text-center'></dd>
                      <dd className='text-right col-span-3'>{t('cost_basis')}</dd>
                      <dt className='col-span-4'>Keratin Extensions</dt>
                      <dd className='text-right col-span-3'>{t('cost_basis')}</dd>
                    </dl>
                  </div>
                  <div className='flex-1 space-y-6'>
                    <div className='relative inline-block 2xl:-translate-x-[3rem]'>
                      <h3 className='font-serif text-xl text-primary md:text-2xl lg:text-2xl xl:text-3xl !leading-[1.5]'>
                        {t('men')}
                      </h3>
                    </div>
                    <dl className={cn('grid grid-cols-7 gap-x-2')}>
                      <dt className='col-span-3'>Cut</dt>
                      <dd className='italic text-center'>{t('from')}</dd>
                      <dd className='text-right col-span-3'>95.-</dd>
                      <dt className='col-span-3'>Color</dt>
                      <dd className='italic text-center'>{t('from')}</dd>
                      <dd className='text-right col-span-3'>65.-</dd>
                    </dl>
                  </div>
                  <div className='flex-1 space-y-6'>
                    <div className='relative inline-block 2xl:-translate-x-[3rem]'>
                      <h3 className='font-serif text-xl text-primary md:text-2xl lg:text-2xl xl:text-3xl !leading-[1.5]'>
                        {t('under_25')}
                      </h3>
                    </div>
                    <div>30% {t('discount')}</div>
                  </div>
                </div>
                <div className='italic'>{t('all_prices_in_chf')}</div>
              </div>
            </div>
          </div>
        </div>
        <div className='relative w-full h-72 md:w-1/2 md:h-screen'>
          <div className='relative w-full h-full md:w-full md:h-[200vh]'>
            <CoverImage src={scissorsImg} />
          </div>
        </div>
      </div>
    </>
  )
}

export const getStaticProps = buildStaticPropsGetterWithTitle('services')
