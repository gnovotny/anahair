import { ForwardedRef, forwardRef, MutableRefObject, useRef } from 'react'

import { shaderMaterial } from '@react-three/drei'
import { Color, extend, useFrame, useThree } from '@react-three/fiber'
import { Mesh, ShaderMaterial, Color as ThreeColor, Texture } from 'three'

import { ScrollSceneChildProps } from '@/components/scrollrig/components/ScrollScene'

// import Mouse from './Mouse'
import fragment from './shaders/fragment.glsl'
import vertex from './shaders/vertex.glsl'

export type PortalSceneProps = Omit<JSX.IntrinsicElements['mesh'], 'scale'> & {
  segments?: number
  scale?: number | [number, number]
  color?: Color
  zoom?: number
  zoomCenter?: [number, number]
  grayscale?: number
  toneMapped?: boolean
  transparent?: boolean
  withDepth?: boolean
  opacity?: number
} & (
    | {
        texture: Texture
        url?: never
        depthTexture: Texture
        depthUrl?: never
        maskTexture: Texture
        maskUrl?: never
        portalTexture?: Texture
        portalUrl?: never
      }
    | {
        texture?: never
        url: string
        depthTexture?: never
        depthUrl: string
        maskTexture?: never
        maskUrl: string
        portalTexture?: never
        portalUrl?: string
      }
  ) // {texture: Texture} XOR {url: string}

type PortalImageMaterialType = JSX.IntrinsicElements['shaderMaterial'] & {
  scale?: number[]
  imageBounds?: number[]
  color?: Color
  map: Texture
  depthMap?: Texture
  maskMap: Texture
  portalMap?: Texture
  zoom?: number
  zoomCenter?: number[]
  grayscale?: number
  useDepthMap?: boolean
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      portalImageMaterial: PortalImageMaterialType
    }
  }
}

const PortalImageMaterialImpl = shaderMaterial(
  {
    color: new ThreeColor('white'),
    scale: [1, 1],
    imageBounds: [1, 1],
    map: null,
    depthMap: null,
    zoom: 1.5,
    zoomCenter: [0.5, 0.5],
    grayscale: 0,
    opacity: 1,

    mousePosition: [0, 0],
    fake3dThreshold: [65, 80],
    uTime: 0,

    maskProgress: 0,
    maskIdle: 0,
    maskMaxScale: 7,
    maskMap: null,
    portalMap: null,

    scrollProgress: 0,
  },
  vertex,
  fragment
)
const PortalScene = forwardRef(
  (
    {
      children,
      color,
      segments = 1,
      scale = 1,
      zoom = 1.5,
      zoomCenter = [0.5, 0.5],
      grayscale = 0,
      opacity = 1,
      texture,
      depthTexture,
      maskTexture,
      portalTexture,
      toneMapped,
      transparent = true,
      withDepth = true,
      ...props
    }: Omit<PortalSceneProps, 'url'> & { scrollState?: ScrollSceneChildProps['scrollState'] },
    ref: ForwardedRef<Mesh>
  ) => {
    const portalImageMaterialRef = useRef<ShaderMaterial>() as MutableRefObject<ShaderMaterial>

    extend({ PortalImageMaterial: PortalImageMaterialImpl })
    const { gl, viewport } = useThree()
    const planeBounds = Array.isArray(scale) ? [scale[0], scale[1]] : [scale, scale]
    const imageBounds = [texture!.image.width, texture!.image.height]

    useFrame(() => {
      if (!portalImageMaterialRef.current) return

      // handleMouseMove({
      //   x: Mouse.x,
      //   y: Mouse.y,
      //   smoothX: Mouse.smoothX,
      //   smoothY: Mouse.smoothY,
      // })

      portalImageMaterialRef.current.uniforms.scrollProgress.value = props.scrollState?.progress ?? 0
    })

    const handleMouseMove = (mouseCoords: any) => {
      if (!portalImageMaterialRef.current) return

      let { x, y, smoothX, smoothY } = mouseCoords

      const halfX = gl.domElement.offsetWidth / 2
      const halfY = gl.domElement.offsetHeight / 2

      // Convert to shader coords
      x = (halfX - smoothX) / halfX
      y = (halfY - smoothY) / halfY

      portalImageMaterialRef.current.uniforms.mousePosition.value = [x, y]
    }

    return (
      <mesh
        ref={ref}
        scale={Array.isArray(scale) ? [...scale, 1] : scale}
      >
        <planeGeometry args={[1, 1, segments, segments]} />
        <portalImageMaterial
          ref={portalImageMaterialRef}
          color={color}
          map={texture!}
          map-colorSpace={gl.outputColorSpace}
          depthMap={depthTexture!}
          depthMap-colorSpace={gl.outputColorSpace}
          useDepthMap={withDepth}
          maskMap={maskTexture!}
          maskMap-colorSpace={gl.outputColorSpace}
          // portalMap={portalTexture!}
          // portalMap-colorSpace={gl.outputColorSpace}
          zoom={zoom}
          zoomCenter={zoomCenter}
          grayscale={grayscale}
          opacity={opacity}
          scale={planeBounds}
          imageBounds={imageBounds}
          toneMapped={toneMapped}
          transparent={transparent}
          // depthWrite={false}
        />

        {children}
      </mesh>
    )
  }
)

export default PortalScene
