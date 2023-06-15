import React, { memo, MutableRefObject, useRef } from 'react'

import cn from 'clsx'

import { useStore } from '@/lib/store'

import AddendumContact from './contact'
import AddendumIntro from './intro'
import { useAddendumScrollThresholds } from './useAddendumScroll'

const Addendum = memo(() => {
  const rootElRef = useRef<HTMLDivElement>(null) as MutableRefObject<HTMLDivElement>

  useAddendumScrollThresholds(rootElRef)

  const isActive = useStore(({ addendumActive }) => addendumActive)

  return (
    <section
      ref={rootElRef}
      className={cn('relative w-full mt-[-100vh] md:h-[250vh] invisible opacity-0', {
        '!visible !opacity-100': isActive,
      })}
    >
      <div className='relative flex flex-col w-full md:h-full md:bg-secondary'>
        <AddendumIntro />
        <AddendumContact />
      </div>
    </section>
  )
})

export default Addendum
