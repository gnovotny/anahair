import React, { memo, MutableRefObject, useCallback, useEffect, useMemo, useRef } from 'react'

import cn from 'clsx'
import { m, useMotionValue } from 'framer-motion'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'

import outsideImg from '@/assets/outside.jpg'
import peopleImg from '@/assets/people-alt.jpg'
import { useLenisScroll } from '@/components/scrollrig/hooks/useLenisScroll'
import { useWindowSize } from '@/components/scrollrig/hooks/useWindowSize'
import { ScrollCallbackProps } from '@/components/scrollrig/scrollbar/SmoothScrollbar'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { useStore } from '@/lib/store'
import { clamp, lerp, mapLinear } from '@/lib/utils/math'
import { down } from '@/lib/utils/screens'

import { AddendumContactBlock } from './AddendumContactBlock'
import { AddendumWordSplit } from './AddendumWordSplit'
import { useAddendumScrollThresholds } from './useAddendumScroll'

const Addendum = memo(() => {
  const rootElRef = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement>

  // const { bounds, scale, position, scrollState, inViewport } = useTracker(rootElRef, {
  //   // rootMargin: inViewportMargin,
  //   // threshold: inViewportThreshold,
  // })

  useAddendumScrollThresholds(rootElRef)

  const addendumActive = useStore(({ addendumActive }) => addendumActive)

  const { t } = useTranslation()
  const { height: realWindowHeight } = useWindowSize()
  const windowHeightRef = useRef<number>(realWindowHeight)
  const scrollLimitRef = useRef<number>(0)
  const screenMdDown = useMediaQuery(down('md'))

  const maxImgScale = useMemo(() => (screenMdDown ? 2 : 1.5), [screenMdDown])

  const imageY = useMotionValue(0)
  const imageInnerY = useMotionValue(0)
  const imageScale = useMotionValue(1)
  const imageCoverY = useMotionValue(0)
  const image2Y = useMotionValue(0)
  const image2Scale = useMotionValue(1)
  const imageCover2Y = useMotionValue(0)
  const wordsY = useMotionValue(0)
  const wordsInnerY = useMotionValue(0)

  const isActive = useStore(({ addendumActive }) => addendumActive)

  const handleScroll = useCallback(
    ({ scroll, limit: realLimit }: ScrollCallbackProps) => {
      // console.log('scrollState.progress', scrollState.progress)

      if (windowHeightRef.current !== realWindowHeight) {
        windowHeightRef.current = isActive ? lerp(windowHeightRef.current, realWindowHeight, 0.01) : realWindowHeight
      }

      if (scrollLimitRef.current !== realLimit) {
        scrollLimitRef.current =
          scrollLimitRef.current > 0 && isActive ? lerp(scrollLimitRef.current, realLimit, 0.01) : realLimit
      }

      const wHeight = windowHeightRef.current
      const limit = scrollLimitRef.current

      if (!isActive) return

      if (!screenMdDown) {
        const imageYScrollStart = limit - wHeight * 1.5
        if (scroll > imageYScrollStart) {
          imageY.set(
            clamp(
              -wHeight * 0.125,
              mapLinear(imageYScrollStart, limit - wHeight * 0.5, scroll, wHeight, -wHeight * 0.125),
              wHeight * 1.25
            )
          )

          imageCoverY.set(clamp(-wHeight * 2, mapLinear(limit - wHeight * 1.5, limit, scroll, 0, -wHeight * 2), 0))
        }
      } else {
        if (scroll > limit - wHeight * 2) {
          wordsY.set(clamp(-wHeight, mapLinear(limit - wHeight * 1.25, limit - wHeight * 0.75, scroll, 0, -wHeight), 0))

          if (scroll <= limit - wHeight * 1.25) {
            wordsInnerY.set(
              clamp(
                -wHeight * 0.25,
                mapLinear(limit - wHeight * 2, limit - wHeight * 1.25, scroll, wHeight * 0.25, -wHeight * 0.25),
                wHeight * 0.25
              )
            )
          } else if (scroll > limit - wHeight * 1.25) {
            wordsInnerY.set(
              clamp(
                -wHeight * 0.25,
                mapLinear(limit - wHeight * 1.25, limit - wHeight * 0.75, scroll, -wHeight * 0.25, wHeight * 0.25),
                wHeight * 0.25
              )
            )
          }

          imageY.set(
            clamp(-wHeight, mapLinear(limit - wHeight * 1.25, limit, scroll, wHeight / 2, -wHeight), wHeight / 2)
          )

          imageInnerY.set(
            clamp(
              -wHeight / 8,
              mapLinear(limit - wHeight * 1.25, limit, scroll, -wHeight / 8, wHeight * 0.75),
              wHeight * 0.75
            )
          )
        }
      }

      if (scroll > limit - wHeight * 2) {
        imageScale.set(
          clamp(
            1,
            mapLinear(
              screenMdDown ? wHeight / 2 : wHeight * 1.25,
              screenMdDown ? -wHeight : -wHeight * 0.125,
              imageY.get(),
              maxImgScale,
              1
            ),
            maxImgScale
          )
        )
      }

      if (!screenMdDown) {
        if (scroll > limit - wHeight) {
          image2Y.set(mapLinear(limit - wHeight / 2, limit, scroll, wHeight / 2, 0))
          image2Scale.set(clamp(1, mapLinear(wHeight / 2, 0, image2Y.get(), maxImgScale, 1), maxImgScale))

          imageCover2Y.set(clamp(-wHeight, mapLinear(limit - wHeight * 0.9, limit, scroll, wHeight, -wHeight), wHeight))
        }
      }
    },
    [
      isActive,
      screenMdDown,
      realWindowHeight,
      imageY,
      imageCoverY,
      wordsY,
      imageInnerY,
      wordsInnerY,
      imageScale,
      maxImgScale,
      image2Y,
      image2Scale,
      imageCover2Y,
    ]
  )

  useLenisScroll(handleScroll)

  useEffect(() => {
    if (!screenMdDown) {
      wordsY.set(0)
      wordsInnerY.set(0)
    }
  }, [screenMdDown, wordsInnerY, wordsY])

  return (
    <section
      ref={rootElRef}
      className={cn('relative w-full mt-[-100vh] md:h-[250vh] invisible opacity-0', {
        '!visible !opacity-100': addendumActive,
      })}
    >
      <div className='relative flex flex-col w-full md:h-full md:bg-secondary'>
        <div className='relative z-10 flex flex-col w-full md:border-b md:flex-row md:border-secondary h-[200vh] md:h-auto'>
          <m.div
            className='fixed top-0 z-10 w-full h-screen overflow-hidden md:overflow-visible md:relative md:top-auto md:h-[200vh] md:w-1/2 bg-secondary will-change-transform'
            style={{
              y: typeof wordsY?.get() === 'number' ? wordsY : 0,
            }}
          >
            <m.div
              className='fixed top-0 flex flex-col items-start justify-end w-full h-screen md:sticky md:justify-start md:h-[50vh] md:top-1/2 will-change-transform'
              style={{
                y: typeof wordsInnerY?.get() === 'number' ? wordsInnerY : 0,
              }}
            >
              <div className={cn('flex items-center justify-center w-full h-[50vh] md:h-full p-6 md:p-12')}>
                <AddendumWordSplit className='max-w-2xl font-sans text-2xl font-medium not-tall:max-w-3xl text-special md:text-3xl md:text-[clamp(16px,5vh,2rem)] xl:text-4xl xl:text-[clamp(16px,5vh,2.5rem)] !leading-[1.2] !xl:leading-[1.5]'>
                  {t('addendum_text')}
                </AddendumWordSplit>
              </div>
            </m.div>
          </m.div>
          <div className='fixed top-0 left-0 w-full h-screen overflow-hidden pointer-events-none md:relative md:w-1/2 md:h-[200vh] md:bg-primary md:overflow-visible'>
            <m.div
              className='absolute left-0 hidden w-full md:block h-[50vh] md:h-screen z-[10] top-[25vh] md:top-[100vh] bg-primary will-change-transform'
              style={{ y: imageCoverY }}
            />
            <div className={cn('md:sticky w-full md:overflow-hidden top-0 md:top-0 h-screen md:h-screen')}>
              <m.div
                className='relative w-full h-full overflow-hidden md:overflow-visible will-change-transform md:origin-top'
                style={{
                  y: typeof imageY?.get() === 'number' ? imageY : 0,
                  scale: typeof imageScale?.get() === 'number' ? imageScale : 1,
                }}
              >
                <m.div
                  className='relative w-full h-full will-change-transform md:origin-top'
                  style={{
                    y: typeof imageInnerY?.get() === 'number' ? imageInnerY : 0,
                  }}
                >
                  <Image
                    className='object-cover'
                    fill
                    sizes='(max-width: 768px) 100vw,50vw'
                    quality={100}
                    src={peopleImg}
                    placeholder='blur'
                    alt=''
                  />
                </m.div>
              </m.div>
            </div>
            <div className='absolute bottom-0 z-20 hidden w-full md:block md:bottom-auto md:top-0 h-[50vh] md:h-full'>
              <div className='relative w-full h-full md:overflow-hidden'>
                <m.div
                  className='absolute top-0 left-0 flex items-center justify-center w-full h-[50vh] md:h-screen md:top-3/4 bg-primary will-change-transform'
                  style={{ y: typeof imageCover2Y?.get() === 'number' ? imageCover2Y : 0 }}
                />
              </div>
            </div>
            <div className='sticky top-0 flex-col items-end hidden w-full md:flex h-[50vh] md:h-screen md:mt-[50vh]'>
              <div className='relative w-full h-full md:h-1/2'>
                <div className='relative w-full h-full overflow-hidden'>
                  <m.div
                    className='relative w-full h-full will-change-transform md:bg-secondary origin-bottom'
                    style={{
                      y: typeof image2Y?.get() === 'number' ? image2Y : 0,
                      scale: typeof image2Scale?.get() === 'number' ? image2Scale : 1,
                    }}
                  >
                    <Image
                      className='object-cover'
                      fill
                      sizes='50vw'
                      quality={70}
                      src={outsideImg}
                      placeholder='blur'
                      alt=''
                    />
                  </m.div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AddendumContactBlock />
      </div>
    </section>
  )
})

export default Addendum
