import React, { FC, useRef } from 'react'

import cn from 'clsx'

import { Contact, OpeningHours } from '@/components/common/info'
import { useEscapeKeyHandler } from '@/lib/hooks'

import s from './InfoOverlay.module.css'

interface InfoOverlayProps {
  className?: string
  open?: boolean
  onClose: () => void
}

const InfoOverlay: FC<InfoOverlayProps> = ({ open, onClose }) => {
  const ref = useRef() as React.MutableRefObject<HTMLDivElement>

  useEscapeKeyHandler(open, onClose)

  return (
    <div className={cn(s.root, { [s.open]: open })}>
      <div
        className={s.inner}
        ref={ref}
        onWheel={(event) => event.stopPropagation()} // don't propagate to lenis
        onScroll={(event) => event.stopPropagation()} // don't propagate to lenis
        onTouchStart={(event) => event.stopPropagation()} // don't propagate to lenis
        onTouchEnd={(event) => event.stopPropagation()} // don't propagate to lenis
        onTouchMove={(event) => event.stopPropagation()} // don't propagate to lenis
      >
        <div className={cn(s.primary)}>
          <Contact
            className='w-full text-lg font-medium space-y-3 md:space-y-3 xl:space-y-6'
            primaryClassName={cn(s.item, s.second)}
            secondaryClassName={cn(s.item, s.first)}
            secondaryInnerClassName='space-y-0'
            secondaryAlignRight
          />
          <OpeningHours className={cn('w-full text-lg font-medium grid', s.item, s.third)} />
        </div>
      </div>
    </div>
  )
}

export default InfoOverlay
