import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react'

import cn from 'clsx'

import { useScrollbar } from '@/components/scrollrig'
import { useLenisScroll } from '@/components/scrollrig/hooks/useLenisScroll'
import { useRect } from '@/components/scrollrig/hooks/useRect'
import { clamp } from '@/lib/utils/math'

import s from './scrollbar.module.css'

const Scrollbar = () => {
  const thumbRef = useRef<HTMLDivElement>() as MutableRefObject<HTMLDivElement>
  const innerRef = useRef<HTMLDivElement>() as MutableRefObject<HTMLDivElement>
  const { height: innerHeight } = useRect(innerRef)
  const { height: thumbHeight } = useRect(thumbRef)

  useLenisScroll(({ scroll, limit }) => {
    const progress = scroll / limit

    thumbRef.current.style.transform = `translate3d(0,${progress * (innerHeight - thumbHeight)}px,0)`
  })

  const {
    scroll: { limit, progress },
    scrollTo,
  } = useScrollbar()

  const [clicked, setClicked] = useState(false)
  const [startPoint, setStartPoint] = useState({
    progress: 0,
    y: 0,
  })

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!clicked) return

      e.preventDefault()
      e.stopPropagation()

      const startProgress = startPoint.progress
      const startY = startPoint.y
      const deltaY = e.clientY - startY

      const progress = clamp(0, startProgress + deltaY / innerHeight, 1)
      scrollTo(progress * limit, { immediate: true })
    },
    [clicked, startPoint.progress, startPoint.y, innerHeight, scrollTo, limit]
  )

  const onPointerUp = useCallback(() => {
    setClicked(false)
  }, [])

  useEffect(() => {
    window.addEventListener('pointermove', onPointerMove, false)
    window.addEventListener('pointerup', onPointerUp, false)

    return () => {
      window.removeEventListener('pointermove', onPointerMove, false)
      window.removeEventListener('pointerup', onPointerUp, false)
    }
  }, [onPointerMove, onPointerUp])

  return (
    <div className={cn(s.scrollbar)}>
      <div
        ref={innerRef}
        className={s.inner}
      >
        <div
          className={s.thumb}
          ref={thumbRef}
          onPointerDown={(e) => {
            setClicked(true)
            setStartPoint({ progress, y: e.clientY })
          }}
        />
      </div>
    </div>
  )
}

export default Scrollbar
