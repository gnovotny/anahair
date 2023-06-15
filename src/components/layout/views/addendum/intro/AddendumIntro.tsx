import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react'

import cn from 'clsx'
import { m, useAnimationFrame, useMotionValue } from 'framer-motion'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'

import outsideImg from '@/assets/outside.jpg'
import peopleImg from '@/assets/people-alt.jpg'
import { useLenisScroll } from '@/components/scrollrig/hooks/useLenisScroll'
import { useWindowSize } from '@/components/scrollrig/hooks/useWindowSize'
import { ScrollCallbackProps } from '@/components/scrollrig/scrollbar/SmoothScrollbar'
import { useMediaQuery } from '@/lib/hooks'
import { useStore } from '@/lib/store'
import { clamp, mapLinear, down } from '@/lib/utils'

import AddendumWordSplit from './AddendumWordSplit'

const AddendumIntro = memo(() => {
  const { t } = useTranslation()
  const { height: realWindowHeight } = useWindowSize()
  const windowHeightRef = useRef<number>(realWindowHeight)
  const scrollLimitRef = useRef<number>(0)
  const scrollPositionRef = useRef<number>(0)
  const realScrollLimitRef = useRef<number>(0)
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

  useAnimationFrame(() => {
    let triggerScrollHandler = false
    const LERP = 0.08
    if (windowHeightRef.current !== realWindowHeight) {
      if (isActive) {
        windowHeightRef.current += (realWindowHeight - windowHeightRef.current) * LERP
        windowHeightRef.current = ((100 * (windowHeightRef.current + 0.01)) | 0) / 100
        triggerScrollHandler = true
      } else {
        windowHeightRef.current = realWindowHeight
      }
    }

    if (scrollLimitRef.current !== realScrollLimitRef.current) {
      if (scrollLimitRef.current > 0 && isActive) {
        scrollLimitRef.current += (realScrollLimitRef.current - scrollLimitRef.current) * LERP
        scrollLimitRef.current = ((100 * (scrollLimitRef.current + 0.01)) | 0) / 100
        triggerScrollHandler = true
      } else {
        scrollLimitRef.current = realScrollLimitRef.current
      }
    }

    triggerScrollHandler && handleScroll()
  })

  const handleScroll = useCallback(() => {
    const scroll = scrollPositionRef.current
    const wHeight = windowHeightRef.current
    const limit = scrollLimitRef.current

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
  }, [
    screenMdDown,
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
  ])

  const onScroll = useCallback(
    ({ scroll, limit }: ScrollCallbackProps) => {
      scrollPositionRef.current = scroll
      realScrollLimitRef.current = limit

      if (!isActive) return

      handleScroll()
    },
    [handleScroll, isActive]
  )

  useLenisScroll(onScroll)

  useEffect(() => {
    if (!screenMdDown) {
      wordsY.set(0)
      wordsInnerY.set(0)
    }
  }, [screenMdDown, wordsInnerY, wordsY])

  return (
    <div className='relative z-10 flex flex-col w-full md:border-b md:flex-row md:border-secondary h-[200vh] md:h-auto'>
      <m.div
        className='fixed top-0 z-10 w-full h-screen overflow-hidden md:overflow-visible md:relative md:top-auto md:h-[200vh] md:w-1/2 bg-secondary will-change-transform'
        style={{
          y: isFinite(wordsY.get()) ? wordsY : 0,
        }}
      >
        <m.div
          className='fixed top-0 flex flex-col items-start justify-end w-full h-screen md:sticky md:justify-start md:h-[50vh] md:top-1/2 will-change-transform'
          style={{
            y: isFinite(wordsInnerY.get()) ? wordsInnerY : 0,
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
              y: isFinite(imageY.get()) ? imageY : 0,
              scale: isFinite(imageScale.get()) ? imageScale : 1,
            }}
          >
            <m.div
              className='relative w-full h-full will-change-transform md:origin-top'
              style={{
                y: isFinite(imageInnerY.get()) ? imageInnerY : 0,
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
              style={{ y: isFinite(imageCover2Y.get()) ? imageCover2Y : 0 }}
            />
          </div>
        </div>
        <div className='sticky top-0 flex-col items-end hidden w-full md:flex h-[50vh] md:h-screen md:mt-[50vh]'>
          <div className='relative w-full h-full md:h-1/2'>
            <div className='relative w-full h-full overflow-hidden'>
              <m.div
                className='relative w-full h-full will-change-transform md:bg-secondary origin-bottom'
                style={{
                  y: isFinite(image2Y.get()) ? image2Y : 0,
                  scale: isFinite(image2Scale.get()) ? image2Scale : 1,
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
  )
})

export default AddendumIntro
