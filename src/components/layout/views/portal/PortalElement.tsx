import React, { memo, MutableRefObject, useRef } from 'react'

import cn from 'clsx'
import Image from 'next/image'

import { WEBGL_ENABLED, PORTAL_WEBGL_ENABLED } from '@/config'

import { IMG_URLS } from './consts'
import PortalWebGL from './PortalWebGL'

// const PortalWebGL = dynamic(() => import('./PortalWebGL').then((m) => m.default), {
//   ssr: false,
// })

const USE_WEBGL = WEBGL_ENABLED && PORTAL_WEBGL_ENABLED

const PortalElement = ({ className }: { className?: string }) => {
  const rootElRef = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement>
  const imgElRef = useRef<HTMLImageElement>(null) as MutableRefObject<HTMLImageElement>
  const imgSmallPortraitElRef = useRef<HTMLImageElement>(null) as MutableRefObject<HTMLImageElement>

  return (
    <section
      ref={rootElRef}
      className={cn(
        'relative z-10 w-full h-[200vh] mt-[-20vh] pointer-events-none',
        {
          '!h-[150vh]': !USE_WEBGL,
        },
        className
      )}
    >
      <div className={cn('sticky top-0 w-full h-screen', USE_WEBGL && 'hidden')}>
        <div className='relative w-full h-full'>
          <Image
            ref={imgElRef}
            fill
            className='hidden object-cover landscape:block md:block'
            loading='eager'
            src={IMG_URLS.main}
            sizes='(max-width: 768px) 100vw,100vw'
            alt=''
          />
          <Image
            ref={imgSmallPortraitElRef}
            fill
            className='object-cover landscape:hidden md:hidden'
            loading='eager'
            src={IMG_URLS.mainMobile}
            sizes='(max-width: 768px) 100vw,100vw'
            alt=''
          />
        </div>
      </div>
      {USE_WEBGL && (
        <PortalWebGL
          containerElRef={rootElRef}
          imgElRef={imgElRef}
          imgSmallPortraitElRef={imgSmallPortraitElRef}
        />
      )}
    </section>
  )
}

export default memo(PortalElement)
