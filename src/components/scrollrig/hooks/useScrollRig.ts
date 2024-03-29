import { useEffect } from 'react'

import type { Scene, Camera } from 'three'

import { preloadScene, requestRender, renderScissor, renderViewport } from '../renderer-api'
import { useCanvasStore } from '../store'

export interface ScrollRigState {
  debug: boolean
  isCanvasAvailable: boolean
  hasSmoothScrollbar: boolean
  scaleMultiplier: number
  preloadScene: (scene: Scene, camera: Camera, layer?: number, callback?: any) => void
  requestRender: (layers?: number[]) => void
  renderScissor: (args: any) => void
  renderViewport: (args: any) => void
  reflow: () => void
}

/**
 * Public interface for ScrollRig
 */
export const useScrollRig = () => {
  const isCanvasAvailable = useCanvasStore((state) => state.isCanvasAvailable)
  const hasSmoothScrollbar = useCanvasStore((state) => state.hasSmoothScrollbar)
  const requestReflow = useCanvasStore((state) => state.requestReflow)
  const pageReflow = useCanvasStore((state) => state.pageReflow)
  const debug = useCanvasStore((state) => state.debug)
  const scaleMultiplier = useCanvasStore((state) => state.scaleMultiplier)

  useEffect(() => {
    if (debug) {
      // @ts-ignore
      window._scrollRig = window._scrollRig || {}
      // @ts-ignore
      window._scrollRig.reflow = requestReflow
    }
  }, [])

  return {
    // boolean state
    debug,
    isCanvasAvailable,
    hasSmoothScrollbar,
    // scale
    scaleMultiplier,
    // render API
    preloadScene,
    requestRender,
    renderScissor,
    renderViewport,
    // recalc all tracker positions
    reflow: requestReflow,
    reflowCompleted: pageReflow,
  } as ScrollRigState
}
