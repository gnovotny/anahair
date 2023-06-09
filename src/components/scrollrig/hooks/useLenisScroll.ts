import { useEffect } from 'react'

import { ScrollCallback } from '../scrollbar/SmoothScrollbar'
import { useCanvasStore } from '../store'

export const useLenisScroll = (cb: ScrollCallback) => {
  const onScroll = useCanvasStore(({ onScroll }) => onScroll)

  useEffect(() => onScroll(cb), [onScroll, cb])
}
