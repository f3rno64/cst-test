import _min from 'lodash/min'
import _max from 'lodash/max'

interface CSTLatLng {
  lat: number
  lng: number
}

const getLatLngCenter = (data: CSTLatLng[]): CSTLatLng => {
  const lats = data.map(({ lat }) => +lat)
  const lngs = data.map(({ lng }) => +lng)

  const minLat = _min(lats)
  const maxLat = _max(lats)

  const minLng = _min(lngs)
  const maxLng = _max(lngs)

  const latD = maxLat - minLat
  const lngD = maxLng - minLng

  return {
    lat: minLat + (latD / 2),
    lng: minLng + (lngD / 2)
  }
}

export default getLatLngCenter
