import { MutableRefObject } from 'react'

import { useTexture } from '@react-three/drei'

import { ScrollScene, UseCanvas, useImageAsTexture } from '@/components/scrollrig'
import { ScrollSceneChildProps } from '@/components/scrollrig/components/ScrollScene'
import { useMediaQuery } from '@/lib/hooks'
import { down, orientation } from '@/lib/utils/media-query'

import { IMG_URLS } from './consts'
import PortalScene from './scene/PortalScene'

type PortalWebGLElementProps = {
  containerElRef: MutableRefObject<HTMLElement>
  imgElRef?: MutableRefObject<HTMLImageElement>
  imgSmallPortraitElRef?: MutableRefObject<HTMLImageElement>
  imgDepthElRef?: MutableRefObject<HTMLImageElement>
}

const PortalWebGLRoot = ({ containerElRef, ...imageProps }: PortalWebGLElementProps) => (
  <UseCanvas>
    <ScrollScene
      track={containerElRef}
      customPositioning
      customScaleFactor={{ y: 1 / 2 }}
    >
      {(scrollProps: ScrollSceneChildProps) => (
        <PortalWebGL
          {...scrollProps}
          {...imageProps}
        />
      )}
    </ScrollScene>
  </UseCanvas>
)

const PortalWebGL = ({
  imgElRef,
  imgSmallPortraitElRef,
  ...props
}: Omit<PortalWebGLElementProps, 'containerElRef'>) => {
  const isSmallPortraitScreen = useMediaQuery([down('md'), orientation('portrait')])
  /* eslint-disable react-hooks/rules-of-hooks */
  const texture = !isSmallPortraitScreen
    ? imgElRef
      ? useImageAsTexture(imgElRef)
      : useTexture(IMG_URLS.main)
    : imgSmallPortraitElRef
      ? useImageAsTexture(imgSmallPortraitElRef)
      : useTexture(IMG_URLS.mainMobile)
  /* eslint-enable react-hooks/rules-of-hooks */
  const depthTexture = useTexture(IMG_URLS.depth)
  const maskTexture = useTexture(isSmallPortraitScreen ? IMG_URLS.maskMobile : IMG_URLS.mask)

  return (
    <PortalScene
      texture={texture}
      depthTexture={depthTexture}
      maskTexture={maskTexture}
      faux3D={!isSmallPortraitScreen}
      zoom={isSmallPortraitScreen ? 2.0 : 1.5}
      zoomOrigin={isSmallPortraitScreen ? [0.5, 0.2] : [0.5, 0.5]}
      {...props}
    />
  )
}

export default PortalWebGLRoot
