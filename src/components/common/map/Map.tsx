import { memo, useCallback, useRef } from 'react'

import { GoogleMap as GoogleMapLib, Marker, useJsApiLoader } from '@react-google-maps/api'

import { INFO, GOOGLE_MAPS_API_KEY } from '@/config'
import { useMediaQuery } from '@/lib/hooks/useMediaQuery'
import { down } from '@/lib/utils/media-query'

import { CENTER_LARGE, CENTER_SMALL, CUSTOM_BOUNDS, LAT, LNG, MARKER_ICON_URL, ZOOM_LARGE, ZOOM_SMALL } from './consts'
import { getMapStyles } from './utils'

const Map = memo(({ onLoad: customOnLoad }: { onLoad?: (map: google.maps.Map) => void }) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    preventGoogleFontsLoading: true,
  })

  const screenMdDown = useMediaQuery(down('md'))

  const markerRef = useRef<Marker>(null)

  const onLoad = useCallback(
    (map: google.maps.Map) => {
      customOnLoad?.(map)
    },
    [customOnLoad]
  )

  return isLoaded ? (
    <GoogleMapLib
      mapContainerClassName='w-full h-[calc(100%+20px)]'
      center={screenMdDown ? CENTER_SMALL : CENTER_LARGE}
      zoom={screenMdDown ? ZOOM_SMALL : ZOOM_LARGE}
      onLoad={onLoad}
      options={{
        minZoom: (screenMdDown ? ZOOM_SMALL : ZOOM_LARGE) - 3,
        maxZoom: (screenMdDown ? ZOOM_SMALL : ZOOM_LARGE) + 2,
        styles: getMapStyles(),
        disableDefaultUI: true,
        gestureHandling: screenMdDown ? 'none' : 'greedy',
        restriction: {
          latLngBounds: CUSTOM_BOUNDS,
        },
      }}
    >
      <Marker
        ref={markerRef}
        position={{ lat: LAT, lng: LNG }}
        icon={MARKER_ICON_URL}
        clickable
        animation={0.0}
        onClick={() => {
          window.open(INFO.googlePlaceUrl, '_blank', 'noreferrer')
        }}
        label={{
          text: 'Ana Hair',
          color: '#233347',
          className: '-translate-y-[3rem] font-black !text-xl text-primary gm-ana-label',
        }}
      />
    </GoogleMapLib>
  ) : null
})

export default Map
