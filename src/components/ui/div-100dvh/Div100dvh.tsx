import React, { forwardRef, useState, useEffect, HTMLAttributes } from 'react'

import { isClient } from '@/lib/utils/common'

let warned = false

type Div100vhProps = HTMLAttributes<HTMLDivElement> & {
  attribute?: 'height' | 'minHeight'
}

const Div100dvh = forwardRef<HTMLDivElement, Div100vhProps>(({ style, attribute = 'height', ...other }, ref) => {
  const height = use100vh()

  // TODO: warn only in development
  if (!warned && style?.[attribute]) {
    warned = true
    console.warn(`<Div100dvh /> overrides the ${attribute} property of the style prop`)
  }
  const styleWithRealHeight = {
    ...style,
    [attribute]: height ? `${height}px` : '100vh',
  }
  return (
    <div
      ref={ref}
      style={styleWithRealHeight}
      {...other}
    />
  )
})

Div100dvh.displayName = 'Div100vh'

export default Div100dvh

export function use100vh(): number | null {
  const [height, setHeight] = useState<number | null>(measureHeight)

  const wasRenderedOnClientAtLeastOnce = useWasRenderedOnClientAtLeastOnce()

  useEffect(() => {
    if (!wasRenderedOnClientAtLeastOnce) return

    function setMeasuredHeight() {
      const measuredHeight = measureHeight()
      setHeight(measuredHeight)
    }

    window.addEventListener('resize', setMeasuredHeight)
    return () => window.removeEventListener('resize', setMeasuredHeight)
  }, [wasRenderedOnClientAtLeastOnce])
  return wasRenderedOnClientAtLeastOnce ? height : null
}

export function measureHeight(): number | null {
  if (!isClient) return null
  return window.innerHeight
}

// Once we ended up on the client, the first render must look the same as on
// the server so hydration happens without problems. _Then_ we immediately
// schedule a subsequent update and return the height measured on the client.
// It's not needed for CSR-only apps, but is critical for SSR.
function useWasRenderedOnClientAtLeastOnce() {
  const [wasRenderedOnClientAtLeastOnce, setWasRenderedOnClientAtLeastOnce] = useState(false)

  useEffect(() => {
    if (isClient) {
      setWasRenderedOnClientAtLeastOnce(true)
    }
  }, [])
  return wasRenderedOnClientAtLeastOnce
}
