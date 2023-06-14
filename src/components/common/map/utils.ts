import MapTypeStyle = google.maps.MapTypeStyle

// eslint-disable-next-line import/order
import { getRootCSSProperties } from '@/lib/utils'

export const getMapStyles = (): MapTypeStyle[] => {
  const [PRIMARY_COLOR, SECONDARY_COLOR, QUATERNARY_COLOR] = getRootCSSProperties('primary', 'secondary', 'quaternary')

  return [
    { featureType: 'all', elementType: 'all', stylers: [{ visibility: 'off' }] },
    {
      featureType: 'all',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }],
    },
    { featureType: 'all', elementType: 'labels.icon', stylers: [{ visibility: 'on' }] },
    {
      featureType: 'administrative',
      elementType: 'all',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'administrative',
      elementType: 'labels.text.fill',
      stylers: [{ color: QUATERNARY_COLOR }, { visibility: 'on' }],
    },
    {
      featureType: 'administrative',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#ffffff' }, { visibility: 'on' }, {weight: 4}],
    },
    {
      featureType: 'landscape',
      elementType: 'all',
      stylers: [{ color: PRIMARY_COLOR }, { visibility: 'on' }],
    },
    {
      featureType: 'landscape',
      elementType: 'geometry',
      stylers: [{ visibility: 'on' }, { color: PRIMARY_COLOR }],
    },
    {
      featureType: 'landscape.man_made',
      elementType: 'all',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'landscape.natural.landcover',
      elementType: 'geometry',
      stylers: [{ visibility: 'off' }, { color: PRIMARY_COLOR }],
    },
    {
      featureType: 'landscape.natural.terrain',
      elementType: 'geometry.fill',
      stylers: [{ color: PRIMARY_COLOR }],
    },
    { featureType: 'poi', elementType: 'all', stylers: [{ visibility: 'off' }] },
    {
      featureType: 'poi',
      elementType: 'geometry',
      stylers: [{ visibility: 'off' }],
    },
    { featureType: 'poi', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    {
      featureType: 'road',
      elementType: 'all',
      stylers: [{ visibility: 'on' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ visibility: 'on' }, { color: SECONDARY_COLOR }],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ weight: '0.01' }],
    },
    {
      featureType: 'road',
      elementType: 'labels.text',
      stylers: [{ visibility: 'on' }],
    },
    { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'on' }] },
    {
      featureType: 'road.highway',
      elementType: 'all',
      stylers: [{ visibility: 'simplified' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ visibility: 'on' }, { color: SECONDARY_COLOR }],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text',
      stylers: [{ visibility: 'off' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.icon',
      stylers: [{ visibility: 'off' }],
    },
    { featureType: 'road.arterial', elementType: 'all', stylers: [{ visibility: 'on' }] },
    {
      featureType: 'road.arterial',
      elementType: 'labels.text',
      stylers: [{ visibility: 'on' }],
    },
    {
      featureType: 'road.arterial',
      elementType: 'labels.icon',
      stylers: [{ visibility: 'on' }],
    },

    { featureType: 'transit', elementType: 'all', stylers: [{ visibility: 'off' }] },

    {
      featureType: 'transit.station.bus',
      elementType: 'all',
      stylers: [{ visibility: 'on' }, { color: QUATERNARY_COLOR }],
    },

    {
      featureType: 'water',
      elementType: 'all',
      stylers: [{ color: QUATERNARY_COLOR }, { visibility: 'on' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text',
      stylers: [{ visibility: 'on' }],
    },
  ]
}
