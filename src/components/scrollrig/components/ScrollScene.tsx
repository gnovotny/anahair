import React, { memo, useState, useCallback, MutableRefObject, ReactNode, useMemo } from 'react'

import { useFrame, createPortal } from '@react-three/fiber'
import { Scene } from 'three'
import vecn from 'vecn'

import { config } from '../config'
import { useLayoutEffect } from '../hooks/useIsomorphicLayoutEffect'
import { useScrollRig } from '../hooks/useScrollRig'
import { useTracker } from '../hooks/useTracker'
import type { ScrollState } from '../hooks/useTracker'
import { useCanvasStore } from '../store'

import { DebugMesh } from './DebugMesh'

export interface ScrollSceneChildProps {
  track: MutableRefObject<HTMLElement>
  margin: number
  priority: number
  scale: vec3 | undefined
  scrollState: ScrollState
  inViewport: boolean
}

interface ScrollScene {
  track: MutableRefObject<HTMLElement>
  children: (state: ScrollSceneChildProps) => ReactNode
  margin?: number
  inViewportMargin?: string
  inViewportThreshold?: number
  visible?: boolean
  hideOffscreen?: boolean
  scissor?: boolean
  debug?: boolean
  as?: string
  priority?: number

  customPositioning?: boolean
  customScaleFactor?: {
    x?: number
    y?: number
  }
}

/**
 * Generic THREE.js Scene that tracks the dimensions and position of a DOM element while scrolling
 * Scene is positioned and scaled exactly above DOM element
 *
 * @author david@14islands.com
 */
const ScrollSceneImpl = ({
  track,
  children,
  margin = 0, // Margin outside scissor to avoid clipping vertex displacement (px)
  inViewportMargin,
  inViewportThreshold,
  visible = true,
  hideOffscreen = true,
  scissor = false,
  debug = false,
  as = 'scene',
  priority = config.PRIORITY_SCISSORS,
  customPositioning,
  customScaleFactor,
  ...props
}: ScrollScene) => {
  const inlineSceneRef = useCallback((node: any) => {
    if (node !== null) {
      setScene(node)
    }
  }, [])

  const [scene, setScene] = useState<Scene | null>(scissor ? new Scene() : null)
  const { requestRender, renderScissor } = useScrollRig()
  const globalRender = useCanvasStore((state) => state.globalRender)

  const { bounds, scale, position, scrollState, inViewport } = useTracker(track, {
    rootMargin: inViewportMargin,
    threshold: inViewportThreshold,
  })

  // Hide scene when outside of viewport if `hideOffscreen` or set to `visible` prop
  useLayoutEffect(() => {
    if (scene) scene.visible = hideOffscreen ? inViewport && visible : visible
  }, [scene, inViewport, hideOffscreen, visible])

  // RENDER FRAME
  useFrame(
    ({ gl, camera }) => {
      if (!scene) return

      if (scene.visible) {
        // move scene
        if (!customPositioning) {
          scene.position.y = position.y
          scene.position.x = position.x
        }

        if (scissor) {
          renderScissor({
            gl,
            scene,
            camera,
            left: bounds.left - margin,
            top: bounds.positiveYUpBottom - margin,
            width: bounds.width + margin * 2,
            height: bounds.height + margin * 2,
          })
        } else {
          requestRender()
        }
      }
    },
    globalRender ? priority : undefined
  )

  const customScale = useMemo(
    () =>
      !scale || !customScaleFactor
        ? scale
        : vecn.vec3(scale.x * (customScaleFactor?.x ?? 1), scale.y * (customScaleFactor?.y ?? 1), scale.z),
    [scale, customScaleFactor]
  )

  const content = (
    <>
      {(!children || debug) && scale && <DebugMesh scale={scale} />}
      {children &&
        scene &&
        scale &&
        children({
          // inherited props
          track,
          margin,
          // new props
          scale: customScale,
          scrollState,
          inViewport,
          // useFrame render priority (in case children need to run after)
          priority: priority,
          // tunnel the rest
          ...props,
        })}
    </>
  )

  // portal if scissor or inline nested scene
  const InlineElement: any = as
  // @ts-ignore
  return scissor && scene ? createPortal(content, scene) : <InlineElement ref={inlineSceneRef}>{content}</InlineElement>
}

const ScrollScene = memo(ScrollSceneImpl)

export { ScrollScene }
