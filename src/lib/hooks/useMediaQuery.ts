import { useEffect, useState } from 'react'

import { matchMediaQuery, isClient, combineMediaQueries } from '@/lib/utils'

const match = (query: string | string[]) =>
  matchMediaQuery(Array.isArray(query) ? combineMediaQueries(...query) : query)

export const useMediaQuery = (query: string | string[], defaultState = false) => {
  const [state, setState] = useState(isClient ? () => match(query).matches : defaultState)

  useEffect(() => {
    let mounted = true
    const mql = match(query)

    const onChange = () => {
      if (!mounted) return
      setState(mql.matches)
    }

    if (mql.addEventListener) {
      mql.addEventListener('change', onChange)
    } else {
      mql.addListener(onChange) // iOS 13 and below
    }

    setState(mql.matches)

    return () => {
      mounted = false

      if (mql.removeEventListener) {
        mql.removeEventListener('change', onChange)
      } else {
        mql.removeListener(onChange) // iOS 13 and below
      }
    }
  }, [query])

  return state
}
