import React, { useCallback } from 'react'

import cn from 'clsx'
import { m, useMotionValue, useTransform } from 'framer-motion'
import Image, { ImageProps } from 'next/image'

import { useLenisScroll } from '@/components/scrollrig/hooks/useLenisScroll'
import { useWindowSize } from '@/components/scrollrig/hooks/useWindowSize'
import { ScrollCallbackProps } from '@/components/scrollrig/scrollbar/SmoothScrollbar'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { down } from '@/lib/utils/screens'

type CoverImageProps = Omit<ImageProps, 'alt'> & { alt?: string }

const CoverImage = (props: CoverImageProps) => {
  const screenMdDown = useMediaQuery(down('md'))

  const { height: windowHeight } = useWindowSize({ debounce: 200 })
  const imageY = useMotionValue(0)
  const imageScale = useTransform(imageY, [0, -windowHeight], [1, 1.5])
  const coverY = useMotionValue(0)

  const handleScroll = useCallback(
    ({ scroll }: ScrollCallbackProps) => {
      if (scroll < windowHeight) {
        imageY.set((scroll / 3) * (screenMdDown ? 1 : -1))
        if (!screenMdDown) {
          coverY.set(-scroll / 4)
        }
      }
    },
    [coverY, imageY, screenMdDown, windowHeight]
  )

  useLenisScroll(handleScroll)

  return (
    <>
      <div className={cn('sticky w-full overflow-hidden top-0 h-full md:h-screen')}>
        <m.div
          className='relative w-full h-full will-change-transform'
          style={{ y: imageY, scale: imageScale?.get() ? imageScale : 1 }}
        >
          <Image
            className='object-cover'
            fill
            sizes='(max-width: 768px) 100vw,
                    50vw'
            quality={100}
            priority
            loading='eager'
            placeholder='blur'
            {...props}
            alt={props.alt ?? ''}
          />
        </m.div>
      </div>
      <m.div
        className='absolute left-0 hidden w-full top-[100vh] md:block h-[200vh] bg-secondary will-change-transform'
        style={{ y: coverY }}
      />
    </>
  )
}

export default CoverImage
