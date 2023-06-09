import React, { ForwardedRef, forwardRef } from 'react'

import cn from 'clsx'
import Link from 'next/link'

import { AnaNovotnyCSSAnimatedLogo, HairCSSAnimatedLogo } from '@/components/common/logo/index'
import useIsHome from '@/lib/hooks/useIsHome'

type CSSAnimatedHeroLogoGroupProps = {
  className?: string
  triggered?: boolean
  delay?: number
}

const CSSAnimatedLogoGroup = forwardRef(
  (
    { className = '', triggered = true, delay = 0 }: CSSAnimatedHeroLogoGroupProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-center justify-center h-auto transition-transform will-change-transform duration-700 scale-100',
        className
      )}
    >
      <Link
        href='/'
        className={cn('w-full', { 'pointer-events-none': useIsHome() })}
      >
        <h1 className='flex flex-col items-center justify-center uppercase text-7xl'>
          <AnaNovotnyCSSAnimatedLogo
            className='w-full mb-2'
            triggered={triggered}
            delay={delay + 1000}
          />
          <HairCSSAnimatedLogo
            className='w-1/6'
            triggered={triggered}
            delay={delay}
          />
        </h1>
      </Link>
    </div>
  )
)

export default CSSAnimatedLogoGroup
