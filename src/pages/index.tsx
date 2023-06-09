import React, { useCallback } from 'react'

import cn from 'clsx'
import { m, useMotionValue } from 'framer-motion'
import { useTranslation } from 'next-i18next'

import img from '@/assets/art-hair.jpg'
import CoverImage from '@/components/common/cover-image'
import { useScrollbar } from '@/components/scrollrig'
import { useLenisScroll } from '@/components/scrollrig/hooks/useLenisScroll'
import { useWindowSize } from '@/components/scrollrig/hooks/useWindowSize'
import { ScrollCallbackProps } from '@/components/scrollrig/scrollbar/SmoothScrollbar'
import Link from '@/components/ui/link'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { mapLinear } from '@/lib/utils/math'
import { getStaticProps } from '@/lib/utils/page-data'
import { down } from '@/lib/utils/screens'

const LINK_PROPS = {
  className: cn(
    'cursor-pointer font-serif !leading-none font-bold text-primary transition-colors duration-[1300ms] decoration-1 underline-offset-4'
  ),
  lineProps: {
    className: cn(
      'after:h-[.125rem] before:h-[.125rem] md:after:h-[.175rem] md:before:h-[.175rem] md:high-dpi:after:h-[.1rem] md:high-dpi:before:h-[.1rem] xl:after:h-[.2rem] xl:before:h-[.2rem] after:bottom-[.15rem] before:bottom-[.15rem] md:after:bottom-[0rem] md:before:bottom-[0rem] xl:after:bottom-[-.15rem] xl:before:bottom-[-.15rem]'
    ),
  },
}

export default function IndexPage() {
  const { t } = useTranslation()

  const screenMdDown = useMediaQuery(down('md'))

  const { height: windowHeight } = useWindowSize()

  const scrollCTAOpacity = useMotionValue(1)

  const handleScroll = useCallback(
    ({ scroll }: ScrollCallbackProps) => {
      if (scroll < windowHeight) {
        if (!screenMdDown) {
          scrollCTAOpacity.set(mapLinear(0, windowHeight / 4, scroll, 1, 0))
        }
      }
    },
    [screenMdDown, scrollCTAOpacity, windowHeight]
  )

  const { scrollTo } = useScrollbar()
  useLenisScroll(handleScroll)

  return (
    <div className={cn('relative w-full md:h-screen')}>
      <div className='relative flex flex-col-reverse w-full md:flex-row md:h-full fit-landing-nav-pt md:pt-0'>
        <div className='relative flex flex-col w-full md:justify-end md:h-full'>
          <div className='relative flex items-center justify-center w-full p-6 md:p-12 min-h-[10rem] md:h-[75vh] md:max-h-[calc(100vh-25vh-6rem)] xl:h-[calc(50vh)]'>
            <div className='max-w-2xl not-tall:max-w-3xl'>
              <h2 className='font-sans text-2xl font-medium text-justify text-special sm:text-3xl md:text-[clamp(16px,2.8vh,2rem)] xl:text-4xl xl:text-[clamp(16px,3vh,2.25rem)] !leading-[1.2] !xl:leading-[1.5]'>
                Nestled within the exquisite quarter of{' '}
                <Link
                  {...LINK_PROPS}
                  onClick={() => scrollTo('bottom')}
                >
                  Seefeld
                </Link>
                , we pride ourselves on delivering exceptional and specialized{' '}
                <Link
                  {...LINK_PROPS}
                  href='/services'
                >
                  services
                </Link>
                . Our talented artists bring their unique personal touch to each service they provide. From classic cuts
                to the most vibrant color palettes, we offer a diverse range of styles,{' '}
                <Link
                  {...LINK_PROPS}
                  href='/products'
                >
                  products
                </Link>{' '}
                and interpretations of the latest trends — tailored to your individual preferences and needs.
              </h2>
            </div>
          </div>
          <m.div
            className='absolute hidden bottom-6 right-1 md:block will-change-opacity'
            style={{ opacity: scrollCTAOpacity }}
          >
            <div className='text-lg font-bold -rotate-90'>scroll</div>
          </m.div>
        </div>
        <div className='relative flex-grow w-full h-[50vh] landscape:h-[75vh] md:!h-[200vh]'>
          <CoverImage src={img} />
        </div>
      </div>
    </div>
  )
}

export { getStaticProps }
