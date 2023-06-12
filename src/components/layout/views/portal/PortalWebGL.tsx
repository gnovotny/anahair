import { MutableRefObject } from 'react'

import { useTexture } from '@react-three/drei'

import { ScrollScene, UseCanvas, useImageAsTexture } from '@/components/scrollrig'
import { ScrollSceneChildProps } from '@/components/scrollrig/components/ScrollScene'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { down, orientation } from '@/lib/utils/screens'

import { IMG_URLS } from './consts'
import PortalScene from './scene/PortalScene'

type PortalWebGLElementProps = {
  containerEl: MutableRefObject<HTMLElement>
  imgEl?: MutableRefObject<HTMLImageElement>
  imgMobileEl?: MutableRefObject<HTMLImageElement>
  imgDepthEl?: MutableRefObject<HTMLImageElement>
}

const PortalWebGLRoot = ({ containerEl, ...imageProps }: PortalWebGLElementProps) => (
  <UseCanvas>
    <ScrollScene
      track={containerEl}
      customYTransform={2}
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

const PortalWebGL = ({ imgEl, imgMobileEl, ...props }: Omit<PortalWebGLElementProps, 'containerEl'>) => {
  const isSmallScreen = useMediaQuery(down('md'))
  const isLandscapeScreen = useMediaQuery(orientation('landscape'))
  /* eslint-disable react-hooks/rules-of-hooks */
  const texture =
    !isSmallScreen || isLandscapeScreen
      ? imgEl
        ? useImageAsTexture(imgEl)
        : useTexture(IMG_URLS.main)
      : imgMobileEl
      ? useImageAsTexture(imgMobileEl)
      : useTexture(IMG_URLS.mainMobile)
  /* eslint-enable react-hooks/rules-of-hooks */
  const depthTexture = useTexture(IMG_URLS.depth)
  const maskTexture = useTexture(isSmallScreen && !isLandscapeScreen ? IMG_URLS.maskMobile : IMG_URLS.mask)

  return (
    <PortalScene
      texture={texture}
      depthTexture={depthTexture}
      maskTexture={maskTexture}
      faux3D={!isSmallScreen}
      zoom={isSmallScreen && !isLandscapeScreen ? 2.0 : 1.5}
      zoomOrigin={isSmallScreen && !isLandscapeScreen ? [0.5, 0.2] : [0.5, 0.5]}
      {...props}
    />
  )
}

export default PortalWebGLRoot
