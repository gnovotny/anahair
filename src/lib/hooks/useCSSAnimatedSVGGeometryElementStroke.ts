import { useEffect, useState } from 'react'

import { getAnimatedStrokeDashStyles } from '@/lib/utils'

import useFirstMountState from './useFirstMountState'

type UseCSSAnimatedSVGGeometryElementStrokeProps = {
  triggered?: boolean
  className?: string
  delay?: number
  initialDelay?: number
  duration?: number
  initialDuration?: number
  length?: number
  scaling?: number
  nonScalingStroke?: boolean
}
const useCSSAnimatedSVGGeometryElementStroke = ({
  triggered = true,
  initialDelay,
  delay = 0,
  duration = 2200,
  initialDuration,
  nonScalingStroke = false,
  length = 100,
  scaling = 1,
}: UseCSSAnimatedSVGGeometryElementStrokeProps) => {
  const isFirstMount = useFirstMountState()
  const [animationActive, setAnimationActive] = useState(true)

  // hack for nonScalingStroke because can't solve the issue with the parent svg width animation not triggering useMeasure, so won't correct path, so just disable all stroke styles when animation complete (sadly no non-js support)
  useEffect(() => {
    if (nonScalingStroke && triggered) {
      setTimeout(() => setAnimationActive(false), delay + duration)
    }
  }, [delay, duration, triggered, nonScalingStroke])

  return {
    style: animationActive
      ? getAnimatedStrokeDashStyles(triggered, isFirstMount, length, duration, delay, initialDuration, initialDelay)
      : undefined,
    vectorEffect: nonScalingStroke ? 'non-scaling-stroke' : 'none',
    pathLength: length * scaling,
  }
}

export default useCSSAnimatedSVGGeometryElementStroke
