import React, { memo, MouseEvent, useCallback } from 'react'

import { m, useMotionValue } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useTranslation } from 'next-i18next'
import { useInView } from 'react-intersection-observer'

import { Contact, OpeningHours } from '@/components/common/info'
import { useLenisScroll } from '@/components/scrollrig/hooks/useLenisScroll'
import { useWindowSize } from '@/components/scrollrig/hooks/useWindowSize'
import { ScrollCallbackProps } from '@/components/scrollrig/scrollbar/SmoothScrollbar'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { useStore } from '@/lib/store'
import { clamp, lerp, mapLinear } from '@/lib/utils/math'
import { down } from '@/lib/utils/screens'

const Map = dynamic(() => import('@/components/common/map').then((m) => m.default), {
  ssr: false,
})

export const AddendumContactBlock = memo(() => {
  const { t } = useTranslation()
  const { height: wHeight, width: wWidth } = useWindowSize()
  const screenMdDown = useMediaQuery(down('md'))

  const { ref: mapContainerRef, inView: mapContainerInView } = useInView({ triggerOnce: true })

  const gMapX = useMotionValue(0)
  const gMapY = useMotionValue(0)

  const isActive = useStore(({ addendumActive }) => addendumActive)

  const handleScroll = useCallback(
    ({ scroll, direction, limit }: ScrollCallbackProps) => {
      if (!isActive) return

      if (scroll > limit - wHeight / (screenMdDown ? 1 : 2)) {
        const newGMapY = clamp(
          0,
          mapLinear(limit - wHeight / (screenMdDown ? 1 : 2), limit, scroll, wHeight / 4, 0),
          wHeight / 4
        )
        gMapY.set(screenMdDown ? newGMapY : lerp(gMapY.get(), newGMapY, 0.1))
      }
    },
    [isActive, screenMdDown, wHeight, gMapY]
  )

  useLenisScroll(handleScroll)

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const { clientX, clientY } = e
      const offsetFactor = 30
      const newX = (clientX - wWidth / 2) / offsetFactor
      const newY = (clientY - wHeight / 2) / offsetFactor

      gMapX.set(lerp(gMapX.get(), newX, 0.1))
      gMapY.set(lerp(gMapY.get(), newY, 0.1))
    },
    [gMapX, gMapY, wHeight, wWidth]
  )

  return (
    <div
      ref={mapContainerRef}
      className='sticky bottom-0 flex flex-col-reverse w-full h-screen md:w-screen md:flex-row md:h-[50vh] bg-secondary'
    >
      <div className='relative flex w-full overflow-hidden pointer-events-none z-[1] h-2/3 landscape:h-full md:h-full landscape:w-1/2 md:w-1/2 xl:w-1/2 xl:items-center xl:justify-center p-9 landscape:p-6 md:!p-12 md:high-dpi:!p-6 xl:!pr-12 bg-[linear-gradient(0deg,rgba(35,51,71,1)35%,rgba(35,51,71,0))] landscape:bg-[linear-gradient(90deg,rgba(35,51,71,1)35%,rgba(35,51,71,0))] md:!bg-[linear-gradient(90deg,rgba(35,51,71,1)35%,rgba(35,51,71,0))] lg:!bg-[linear-gradient(90deg,rgba(35,51,71,1)25%,rgba(35,51,71,0))]'>
        <div className='flex flex-col justify-end w-full h-full text-xl font-medium landscape:text-lg md:!text-xl md:high-dpi:!text-base md:very-high-dpi:!text-sm md:justify-between items-between md:items-start space-y-6 landscape:space-y-3 md:!space-y-6 text-secondary md:max-w-[30vw] xl:max-w-2xl'>
          <Contact className='justify-between w-full pointer-events-auto xl:w-auto space-y-6 landscape:space-y-3 md:space-y-3 md:justify-start' />
          <OpeningHours className='w-full font-medium xl:w-96' />
        </div>
      </div>
      <div className='absolute inset-0 w-full h-full overflow-hidden'>
        <div className='relative w-full h-full'>
          <m.div
            className='w-full h-full md:w-[110%] md:h-[110%] md:absolute md:inset-[-5%] will-change-[transform]'
            onMouseMove={(e) => handleMouseMove(e)}
            style={{
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              x: gMapX,
              y: gMapY,
            }}
          >
            {mapContainerInView && <Map />}
          </m.div>
        </div>
      </div>
    </div>
  )
})
