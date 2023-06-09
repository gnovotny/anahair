import { CSSProperties } from 'react'

/**
 * For use in svg path length animations
 *
 * @param triggered
 * @param isFirstMount
 * @param length
 * @param duration
 * @param delay
 * @param initialDuration
 * @param initialDelay
 */
export const getAnimatedStrokeDashStyles = (
  triggered: boolean,
  isFirstMount: boolean,
  length: number,
  duration: number = 300,
  delay: number = 100,
  initialDuration: number | undefined,
  initialDelay: number | undefined
): CSSProperties => ({
  strokeDashoffset: triggered && !isFirstMount ? 0 : length,
  strokeDasharray: length,
  opacity: length > 0 ? 1 : 0,
  transitionDuration: `${isFirstMount ? initialDuration ?? duration : duration}ms`,
  transitionDelay: `${isFirstMount ? initialDelay ?? delay : delay}ms`,
  transitionProperty: 'stroke-dashoffset',
  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',

  ...(isFirstMount && triggered
    ? {
        animation: `pathLength ${initialDuration ?? duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        animationDelay: `${initialDelay ?? delay}ms`,
        animationFillMode: 'forwards',
      }
    : {}),
})

/**
 * set multiple styles on HTMLElement
 *
 * @param element
 * @param styles
 */
export const setStyles = (element: HTMLElement | SVGElement, styles: { [key: string]: string }): void => {
  if (styles !== undefined) {
    Object.keys(styles).forEach((key: string) => {
      element.style.setProperty(key, styles[key])
    })
  }
}

/**
 * get CSS vars from optional (default is document root's computed style) computed style
 * @param property
 * @param computedStyle
 */
export const getCSSProperty = (property: string, computedStyle?: CSSStyleDeclaration) =>
  (computedStyle ?? getComputedStyle(document.documentElement)).getPropertyValue(`--${property}`)

/**
 * retrieve specified CSS vars from document root's computed style
 * @param properties
 */
export const getRootCSSProperties = (...properties: string[]) => {
  const computedStyle = getComputedStyle(document.documentElement)
  return properties.map((property) => getCSSProperty(property, computedStyle))
}
