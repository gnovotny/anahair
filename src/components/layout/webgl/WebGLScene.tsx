import { memo, MutableRefObject } from 'react'

import { GlobalCanvas } from '@/components/scrollrig'

type WebGLSceneProps = {
  eventSource?: HTMLElement | MutableRefObject<HTMLElement>
}

const WebGLScene = ({ eventSource }: WebGLSceneProps) => (
  <GlobalCanvas
    className='z-20 !pointer-events-none !fixed !inset-0 !w-screen !h-screen'
    eventSource={eventSource}
    eventPrefix='client'
  />
)

export default memo(WebGLScene, () => true)
