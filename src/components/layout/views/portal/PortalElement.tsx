import React, { memo, MutableRefObject, useRef } from 'react'

import cn from 'clsx'
import dynamic from 'next/dynamic'
import Image from 'next/image'

import { WEBGL_ENABLED, PORTAL_WEBGL_ENABLED } from '@/config'

import { IMG_URLS } from './consts'

const PortalWebGLElement = dynamic(() => import('./PortalWebGL').then((m) => m.default), {
  ssr: false,
})

const PortalElement = ({ className }: { className?: string }) => {
  const containerElRef = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement>
  const imgElRef = useRef<HTMLImageElement>(null) as MutableRefObject<HTMLImageElement>
  const imgMobileElRef = useRef<HTMLImageElement>(null) as MutableRefObject<HTMLImageElement>

  return (
    <section
      ref={containerElRef}
      className={cn(
        'relative z-10 w-full h-[200vh] mt-[-20vh] pointer-events-none',
        {
          '!h-[150vh]': !WEBGL_ENABLED || !PORTAL_WEBGL_ENABLED,
        },
        className
      )}
    >
      <div className={cn('sticky top-0 w-full h-screen', WEBGL_ENABLED && PORTAL_WEBGL_ENABLED && 'hidden')}>
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
            ref={imgMobileElRef}
            fill
            className='object-cover landscape:hidden md:hidden'
            loading='eager'
            src={IMG_URLS.mainMobile}
            sizes='(max-width: 768px) 100vw,100vw'
            alt=''
          />
        </div>
      </div>
      {WEBGL_ENABLED && PORTAL_WEBGL_ENABLED && (
        <PortalWebGLElement
          containerEl={containerElRef}
          imgEl={imgElRef}
          imgMobileEl={imgMobileElRef}
        />
      )}
    </section>
  )
}

export default memo(PortalElement)
