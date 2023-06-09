import { useRef, useState, MutableRefObject } from 'react'

import { useCanvasStore } from '../store'

import { useLayoutEffect } from './useIsomorphicLayoutEffect'
import { TrackerOptions, Rect } from './useTracker'
import { useWindowSize } from './useWindowSize'

function useRect(track: MutableRefObject<HTMLElement>, options?: TrackerOptions): Rect {
  const size = useWindowSize()
  const pageReflow = useCanvasStore((state) => state.pageReflow)

  // DOM rect (initial position in pixels offset by scroll value on page load)
  // Using ref so we can calculate bounds & position without a re-render
  const rect = useRef({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  }).current

  // expose internal ref as a reactive state as well
  const [reactiveRect, setReactiveRect] = useState<Rect>(rect)

  // Calculate bounding Rect as soon as it's available
  useLayoutEffect(() => {
    const _rect = track.current?.getBoundingClientRect()
    if (!_rect) return
    const initialY = options?.wrapper ? (options?.wrapper as HTMLElement).scrollTop : window.scrollY
    const initialX = options?.wrapper ? (options?.wrapper as HTMLElement).scrollLeft : window.scrollX
    rect.top = _rect.top + initialY
    rect.bottom = _rect.bottom + initialY
    rect.left = _rect.left + initialX
    rect.right = _rect.right + initialX
    rect.width = _rect.width
    rect.height = _rect.height
    rect.x = rect.left + _rect.width * 0.5
    rect.y = rect.top + _rect.height * 0.5
    setReactiveRect({ ...rect })
  }, [track, size, pageReflow])

  return reactiveRect
}

export { useRect }
