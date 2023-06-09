import tailwindScreens from '../../../tailwind.screens.config'

export type Screen = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
export const SCREENS = tailwindScreens

// The maximum value is calculated as the minimum of the next one less 0.02px.
// @see https://www.w3.org/TR/mediaqueries-4/#mq-min-max
const getNextBpValue = (bp: string) => {
  return `${parseInt(bp) - 0.02}px`
}

export const up = (bp: Screen) => {
  const screen = SCREENS[bp]
  return `@media only screen and (min-width: ${screen})`
}

export const down = (bp: Screen) => {
  const screen = getNextBpValue(SCREENS[bp])
  return `@media only screen and (max-width: ${screen})`
}

export const between = (bpMin: Screen, bpMax: Screen) => {
  const screenMin = SCREENS[bpMin]
  const screenMax = getNextBpValue(SCREENS[bpMax])
  return `@media only screen and (min-width: ${screenMin}) and (max-width: ${screenMax})`
}

export const only = (bp: Screen) => {
  const screenKeys = Object.keys(SCREENS) as Screen[]
  const currentKeyIndex = screenKeys.indexOf(bp)
  const nextBp = screenKeys[currentKeyIndex + 1]
  return nextBp ? between(bp, nextBp) : up(bp)
}

export const orientation = (orientation: 'landscape' | 'portrait') => {
  return `@media only screen and (orientation: ${orientation})`
}
