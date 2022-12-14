import React from 'react'
import _keys from 'lodash/keys'

import Sidebar from './components/sidebar'
import getLatLngCenter from './util/get_lat_lng_center'
import './cst_test.css'

interface CSTLatLng {
  lat: number
  lng: number
}

interface CSTTest {
  map: google.maps.Map
}

interface CSTPolygon {
  featureId: string
  polygon: google.maps.Polygon
  data: CSTLatLng[]
}

interface CSTTestProps {
  features: any
}

interface CSTTestState {
  selectedFeatureId: string
  polygons: CSTPolygon[]
}

class CSTTest extends React.Component<CSTTestProps, CSTTestState> {
  constructor(props: CSTTestProps) {
    super(props)

    this.map = null
    this.state = {
      selectedFeatureId: null,
      polygons: [],
    }
  }

  static getDerivedStateFromProps(props: CSTTestProps, state: CSTTestState) {
    const { polygons: existingPolygons } = state
    const { features } = props

    const featureIds = _keys(features)
    const polygons: CSTPolygon[] = []

    // Remove existing polygons from map
    existingPolygons.forEach(({ polygon }) => polygon.setMap(null))

    featureIds.forEach((featureId) => {
      const feature = features[featureId]
      const { coordinates } = feature

      coordinates.forEach((coordinateData: number[][][]) => {
        coordinateData.forEach((polygonDataRaw: number[][]) => {
          const data = polygonDataRaw.map(([lng, lat]) => ({ lat, lng }))
          const polygon = new google.maps.Polygon({
            paths: data,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
          })

          polygons.push({
            featureId,
            polygon,
            data,
          })
        })
      })
    })

    return { polygons }
  }

  componentDidMount(): void {
    if (this.map !== null) {
      return
    }

    const { polygons } = this.state
    const polygonCenters = polygons.map(({ data }) => getLatLngCenter(data))
    const mapCenter = getLatLngCenter(polygonCenters)

    this.map = new google.maps.Map(
      document.getElementById('cst-test-map') as HTMLElement, {
        zoom: 14,
        center: mapCenter,
        mapTypeId: 'terrain',
      }
    )

    this.renderPolygons()
  }

  onPolygonSelected(polygonData: CSTPolygon) {
    if (this.map === null) {
      return
    }

    const { featureId, data } = polygonData
    const center = getLatLngCenter(data)
    const centerGoogleLatLng = new google.maps.LatLng(center.lat, center.lng)

    this.map.panTo(centerGoogleLatLng)

    this.setState(() => ({ selectedFeatureId: featureId }))
  }

  renderPolygons() {
    const { polygons = [] } = this.state

    polygons.forEach((polygonData: CSTPolygon) => {
      const { polygon } = polygonData

      polygon.addListener('click', this.onPolygonSelected.bind(this, polygonData))
      polygon.setMap(this.map)
    })
  }

  render() {
    const { features = {} } = this.props
    const { selectedFeatureId, polygons } = this.state
    const selectedFeature = features[selectedFeatureId]

    this.renderPolygons()

    return (
      <div id="cst-test">
        <Sidebar
          features={features}
          polygons={polygons}
          selectedFeature={selectedFeature}
          onSelectFeature={this.onPolygonSelected.bind(this)}
        />

        <div id="cst-test-content">
          <div id="cst-test-map"></div>
        </div>
      </div>
    );
  }
}

export default CSTTest
