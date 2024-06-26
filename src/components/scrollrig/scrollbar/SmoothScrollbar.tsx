import { useEffect, useRef, useCallback, ReactElement, forwardRef, useImperativeHandle } from 'react'

import Lenis from 'lenis'

import { useLayoutEffect } from '../hooks/useIsomorphicLayoutEffect'
import { useCanvasStore } from '../store'

export type ScrollCallbackProps = {
  scroll: number
  limit: number
  velocity: number
  direction: number
  progress: number
}

export type ScrollCallback = (props: ScrollCallbackProps) => void

export type ScrollToTarget = number | HTMLElement | string
export type ScrollToConfig = {
  offset: number
  immediate: boolean
  duration: number
  easing: (t: number) => number
}

export interface ISmoothScrollbar {
  children: (props: any) => ReactElement
  enabled?: boolean
  locked?: boolean
  scrollRestoration?: ScrollRestoration
  disablePointerOnScroll?: boolean
  horizontal?: boolean
  scrollInContainer?: boolean
  updateGlobalState?: boolean
  onScroll?: ScrollCallback
  config?: object
  invalidate?: () => void
  addEffect?: (cb: any) => () => void
}

const POINTER_EVENTS_ENABLE_VELOCITY = 1
const POINTER_EVENTS_DISABLE_VELOCITY = 1.5

const SmoothScrollbarImpl = (
  {
    children,
    enabled = true,
    locked = false,
    scrollRestoration = 'auto',
    disablePointerOnScroll = true,
    horizontal = false,
    scrollInContainer = false,
    updateGlobalState = true,
    onScroll,
    config = {},
    invalidate = () => {},
    addEffect,
  }: ISmoothScrollbar,
  ref: any
) => {
  const innerRef = useRef<HTMLElement>()
  const lenis = useRef<Lenis>()
  const preventPointer = useRef(false)
  const globalScrollState = useCanvasStore((s) => s.scroll)

  // Expose lenis imperative API
  useImperativeHandle(ref, () => ({
    start: () => lenis.current?.start(),
    stop: () => lenis.current?.stop(),
    on: (event: string, cb: ScrollCallback) => lenis.current?.on(event, cb),
    // @ts-expect-error emit is private
    notify: () => lenis.current?.emit(), // backwards compatible
    // @ts-expect-error emit is private
    emit: () => lenis.current?.emit(),
    scrollTo: (target: ScrollToTarget, props: ScrollToConfig) => lenis.current?.scrollTo(target, props),
    raf: (time: number) => lenis.current?.raf(time),
    __lenis: lenis.current,
  }))

  // disable pointer events while scrolling to avoid slow event handlers
  const preventPointerEvents = useCallback(
    (prevent: boolean) => {
      if (!disablePointerOnScroll) return
      if (innerRef.current && preventPointer.current !== prevent) {
        preventPointer.current = prevent
        innerRef.current.style.pointerEvents = prevent ? 'none' : 'auto'
      }
    },
    [disablePointerOnScroll, innerRef, preventPointer]
  )

  // apply chosen scroll restoration
  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = scrollRestoration
    }
  }, [])

  // INIT LENIS
  useLayoutEffect(() => {
    // Set up scroll containers - allows scrolling without resizing window on iOS/mobile
    const html = document.documentElement
    const wrapper = document.body
    const content = document.body.firstElementChild

    html.classList.toggle('ScrollRig-scrollHtml', scrollInContainer)
    wrapper.classList.toggle('ScrollRig-scrollWrapper', scrollInContainer)

    if (scrollInContainer) {
      Object.assign(config, {
        smoothTouch: true,
        wrapper,
        content,
      })
    }

    lenis.current = new Lenis({
      orientation: horizontal ? 'horizontal' : 'vertical',
      ...config,
    })

    // let r3f drive the frameloop
    let removeEffect: () => void
    if (addEffect) {
      removeEffect = addEffect((time: number) => lenis.current?.raf(time))
    } else {
      // manual animation frame
      // TODO use framer motion / popmotion render loop?
      let _raf: number
      function raf(time: number) {
        lenis.current?.raf(time)
        _raf = requestAnimationFrame(raf)
      }
      _raf = requestAnimationFrame(raf)
      removeEffect = () => cancelAnimationFrame(_raf)
    }

    return () => {
      removeEffect()
      lenis.current?.destroy()
    }
  }, [])

  // BIND TO LENIS SCROLL EVENT
  useLayoutEffect(() => {
    const _onScroll = ({ scroll, limit, velocity, direction, progress }: any) => {
      const y = !horizontal ? scroll : 0
      const x = horizontal ? scroll : 0

      // update global scroll store
      if (updateGlobalState) {
        globalScrollState.y = y
        globalScrollState.x = x
        globalScrollState.limit = limit
        globalScrollState.velocity = velocity
        globalScrollState.direction = direction
        globalScrollState.progress = progress || 0 // avoid NaN from Lenis
      }

      if (Math.abs(velocity) > POINTER_EVENTS_DISABLE_VELOCITY) {
        preventPointerEvents(true)
      }
      if (Math.abs(velocity) < POINTER_EVENTS_ENABLE_VELOCITY) {
        preventPointerEvents(false)
      }

      onScroll && onScroll({ scroll, limit, velocity, direction, progress })

      invalidate() // demand a R3F frame on scroll
    }

    lenis.current?.on('scroll', _onScroll)

    // update global state
    if (updateGlobalState) {
      globalScrollState.scrollDirection = horizontal ? 'horizontal' : 'vertical'

      // expose global scrollTo and onScroll function to subscribe to scroll events
      useCanvasStore.setState({
        scrollTo: (...args) => {
          lenis.current?.scrollTo(...args)
        },
        onScroll: (cb: ScrollCallback) => {
          lenis.current?.on('scroll', cb)
          // @ts-expect-error emit is private
          lenis.current?.emit() // send current scroll to new subscriber
          return () => lenis.current?.off('scroll', cb)
        },
      })

      // Set current scroll position on load in case reloaded further down
      useCanvasStore.getState().scroll.y = window.scrollY
      useCanvasStore.getState().scroll.x = window.scrollX
    }

    // fire our internal scroll callback to update globalState
    // @ts-expect-error emit is private
    lenis.current?.emit()
    return () => {
      lenis.current?.off('scroll', _onScroll)
      // reset store
      useCanvasStore.setState({
        onScroll: () => () => {},
        scrollTo: () => {},
      })
    }
  }, [])

  // Interaction events - invalidate R3F loop and enable pointer events
  useLayoutEffect(() => {
    const invalidateOnWheelEvent = () => invalidate()
    const onPointerInteraction = () => preventPointerEvents(false)
    window.addEventListener('pointermove', onPointerInteraction)
    window.addEventListener('pointerdown', onPointerInteraction)
    window.addEventListener('wheel', invalidateOnWheelEvent)
    return () => {
      window.removeEventListener('pointermove', onPointerInteraction)
      window.removeEventListener('pointerdown', onPointerInteraction)
      window.removeEventListener('wheel', invalidateOnWheelEvent)
    }
  }, [])

  // Mark as enabled in global state
  useEffect(() => {
    if (updateGlobalState) {
      document.documentElement.classList.toggle('js-smooth-scrollbar-enabled', enabled)
      document.documentElement.classList.toggle('js-smooth-scrollbar-disabled', !enabled)
      useCanvasStore.setState({ hasSmoothScrollbar: enabled })
    }
  }, [enabled])

  useEffect(() => {
    locked ? lenis.current?.stop() : lenis.current?.start()
  }, [locked])

  {
    /* Use function child so we can spread props
    - for instance disable pointer events while scrolling */
  }
  return children({ ref: innerRef })
}

export const SmoothScrollbar = forwardRef<any, ISmoothScrollbar>(SmoothScrollbarImpl)
