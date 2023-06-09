import { useMemo } from 'react'

import { useRouter } from 'next/router'

const useIsHome = () => {
  const router = useRouter()

  return useMemo(() => router.pathname === '/', [router.pathname])
}

export default useIsHome
