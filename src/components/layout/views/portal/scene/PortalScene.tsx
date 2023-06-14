import { ForwardedRef, forwardRef, MutableRefObject, useEffect, useRef } from 'react'

import { shaderMaterial } from '@react-three/drei'
import { Color, extend, useFrame, useThree } from '@react-three/fiber'
import { Mesh, ShaderMaterial, Color as ThreeColor, Texture } from 'three'

import { ScrollSceneChildProps } from '@/components/scrollrig/components/ScrollScene'

import { fragment, vertex } from './shaders'

const MOUSE_LERP = 0.08

export type PortalSceneProps = Omit<JSX.IntrinsicElements['mesh'], 'scale'> & {
  segments?: number
  scale?: number | [number, number]
  color?: Color
  zoom?: number
  zoomOrigin?: [number, number]
  faux3D?: boolean
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
  zoom?: number
  zoomOrigin?: number[]
  faux3D?: boolean
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
    opacity: 1,

    map: null,
    depthMap: null,
    maskMap: null,

    zoom: 1.5,
    zoomOrigin: [0.5, 0.5],
    faux3D: true,
    faux3dThreshold: [65, 80],
    maskMaxScale: 7,

    mousePosition: [0, 0],
    time: 0,
    progress: 0,
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
      zoomOrigin = [0.5, 0.5],
      opacity = 1,
      texture,
      depthTexture,
      maskTexture,
      portalTexture,
      faux3D = true,
      scrollState,
      ...props
    }: Omit<PortalSceneProps, 'url'> & { scrollState?: ScrollSceneChildProps['scrollState'] },
    ref: ForwardedRef<Mesh>
  ) => {
    const portalImageMaterialRef = useRef<ShaderMaterial>() as MutableRefObject<ShaderMaterial>

    extend({ PortalImageMaterial: PortalImageMaterialImpl })
    const { gl, viewport } = useThree()
    const planeBounds = Array.isArray(scale) ? [scale[0], scale[1]] : [scale, scale]
    const imageBounds = [texture!.image.width, texture!.image.height]

    const mousePositionRef = useRef({ x: 0, y: 0, smoothX: 0, smoothY: 0 })

    useEffect(() => {
      if (!faux3D) return

      const onMouseMove = (event: MouseEvent) => {
        if (!portalImageMaterialRef.current) return

        const pos = mousePositionRef.current
        pos.x = event.clientX
        pos.y = event.clientY
      }

      window.addEventListener('mousemove', onMouseMove)
      return () => window.removeEventListener('mousemove', onMouseMove)
    }, [faux3D])

    useFrame(() => {
      if (!portalImageMaterialRef.current) return

      const progress = scrollState?.progress ?? 0
      portalImageMaterialRef.current.uniforms.progress.value = progress

      if (faux3D && progress > 1 / 3) {
        const pos = mousePositionRef.current
        pos.smoothX += (pos.x - pos.smoothX) * MOUSE_LERP
        pos.smoothX = ((100 * (pos.smoothX + 0.01)) | 0) / 100

        pos.smoothY += (pos.y - pos.smoothY) * MOUSE_LERP
        pos.smoothY = ((100 * (pos.smoothY + 0.01)) | 0) / 100

        const halfX = gl.domElement.offsetWidth / 2
        const halfY = gl.domElement.offsetHeight / 2

        // Convert to shader coords
        const x = (halfX - pos.smoothX) / halfX
        const y = (halfY - pos.smoothY) / halfY

        portalImageMaterialRef.current.uniforms.mousePosition.value = [x, y]
      }
    })

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
          faux3D={faux3D}
          maskMap={maskTexture!}
          maskMap-colorSpace={gl.outputColorSpace}
          zoom={zoom}
          zoomOrigin={zoomOrigin}
          opacity={opacity}
          scale={planeBounds}
          imageBounds={imageBounds}
        />

        {children}
      </mesh>
    )
  }
)

export default PortalScene
