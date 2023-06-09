import { useCallback, useEffect } from 'react'

const useEscapeKeyHandler = (active = false, handleEscape: () => void) => {
  const handleKey = useCallback((e: KeyboardEvent) => e.key === 'Escape' && handleEscape(), [handleEscape])

  useEffect(() => {
    active && window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [active, handleKey])
}

export default useEscapeKeyHandler
