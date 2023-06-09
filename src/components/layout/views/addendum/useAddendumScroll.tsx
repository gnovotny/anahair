import { MutableRefObject, useCallback, useEffect, useMemo } from 'react'

import { useLenisScroll } from '@/components/scrollrig/hooks/useLenisScroll'
import { useRect } from '@/components/scrollrig/hooks/useRect'
import { ScrollCallbackProps } from '@/components/scrollrig/scrollbar/SmoothScrollbar'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { useStore } from '@/lib/store'
import { down } from '@/lib/utils/screens'

export type AddendumScrollCallback = (props: ScrollCallbackProps, thresholds: any) => void
export const useAddendumScroll = (onScroll: AddendumScrollCallback) => {
  const thresholds = useStore(({ thresholds }) => thresholds)

  const addendumThresholds = useMemo(
    () =>
      Object.entries(thresholds).reduce((prev: any, [key, value]) => {
        if (key.startsWith('addendum-')) {
          const tKey = key.split('-')[1]
          prev[tKey] = value
        }
        return prev
      }, {}),
    [thresholds]
  )

  const fn = useCallback(
    (props: ScrollCallbackProps) => onScroll(props, addendumThresholds),
    [onScroll, addendumThresholds]
  )

  useLenisScroll(fn)
}

export const useAddendumScrollThresholds = (ref: MutableRefObject<HTMLDivElement>) => {
  const rootRect = useRect(ref)
  const screenMdDown = useMediaQuery(down('md'))

  const addThreshold = useStore(({ addThreshold }) => addThreshold)

  useEffect(() => {
    const top = rootRect.top
    const height = rootRect.height
    addThreshold({ id: 'addendum-start', value: top })
    addThreshold({
      id: 'addendum-end',
      value: top + height,
    })

    addThreshold({ id: 'addendum-startIntro', value: top + height * (screenMdDown ? 0.1 : 0.15) })

    addThreshold({
      id: 'addendum-endIntro',
      value: top + height * (screenMdDown ? 0.2 : 0.35),
    })

    addThreshold({ id: 'addendum-startOutro', value: top + height * (screenMdDown ? 0.25 : 0.4) })
    addThreshold({
      id: 'addendum-endOutro',
      value: top + height * (screenMdDown ? 0.4 : 0.875),
    })
  }, [addThreshold, rootRect, screenMdDown])

  const { addendumActive, setAddendumActive } = useStore()

  const cb = useCallback(
    ({ scroll }: ScrollCallbackProps, thresholds: Record<string, number>) => {
      const start = thresholds['start']
      const end = thresholds['end']

      const active = scroll >= start /* && scroll <= end*/

      if (addendumActive !== active) {
        setAddendumActive(active)
      }
    },
    [addendumActive, setAddendumActive]
  )

  useAddendumScroll(cb)
}
