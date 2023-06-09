import React, { PropsWithChildren } from 'react'

import cn from 'clsx'

import PageTransitionStack from './PageTransitionStack'

const PageWrapper = ({ children }: PropsWithChildren) => (
  <section className={cn('relative w-full min-h-screen')}>
    <PageTransitionStack
      customClassName='w-full'
      customInactiveClassName='top-0 left-0'
    >
      {children}
    </PageTransitionStack>
  </section>
)

export default PageWrapper
