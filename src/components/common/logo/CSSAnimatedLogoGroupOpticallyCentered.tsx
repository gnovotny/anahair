import React, { ForwardedRef, forwardRef } from 'react'

import cn from 'clsx'

import { AnaNovotnyCSSAnimatedLogo, HairCSSAnimatedLogo } from '@/components/common/logo/index'

type CSSAnimatedHeroLogoGroupProps = {
  className?: string
  aNLogoClassName?: string
  hairLogoClassName?: string
  triggered?: boolean
  delay?: number
}

const CSSAnimatedLogoGroupOpticallyCentered = forwardRef(
  (
    {
      className = '',
      aNLogoClassName = '',
      hairLogoClassName = '',
      triggered = true,
      delay = 0,
    }: CSSAnimatedHeroLogoGroupProps,
    ref: ForwardedRef<HTMLDivElement>
  ) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-center justify-center h-auto transition-transform will-change-transform duration-700 scale-100',
        className
      )}
    >
      <h1 className='relative flex flex-col items-center justify-center uppercase text-7xl'>
        <AnaNovotnyCSSAnimatedLogo
          className={cn('w-full', aNLogoClassName)}
          triggered={triggered}
          delay={delay}
        />
        <HairCSSAnimatedLogo
          className={cn('absolute w-1/6 pt-1 md:pt-2 top-full', hairLogoClassName)}
          triggered={triggered}
          delay={delay + 1000}
        />
      </h1>
    </div>
  )
)

export default CSSAnimatedLogoGroupOpticallyCentered
