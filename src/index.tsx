import React from 'react';
import ReactDOM from 'react-dom/client';
import _keys from 'lodash/keys'
import _isFinite from 'lodash/isFinite'

import CSTTest from './cst_test';
import data from './CarbonSpaceTech-demo-account-data.json'
import './index.css';

// TODO: Expand type definitions, remove 'any'
interface GeoFeature {
  name: string
  data: any
  coordinates: any
  properties: any
}

interface GeoFeatures {
  [id: string]: GeoFeature
}

const rawFeatures = data.features.filter(({ type }) => type === 'Feature')
const features: GeoFeatures = {}

rawFeatures.forEach(({ properties, geometry }) => {
  const { id, name } = properties
  const { coordinates } = geometry
  const propertyKeys = _keys(properties)
  const dataKeys = propertyKeys.filter(k => _isFinite(+k))

  dataKeys.sort((a: string, b: string) => +a - +b)

  const data = dataKeys.map((k) => {
    const year = k.slice(0, 4)
    const month = k.slice(4, 6)
    const x = new Date()

    x.setUTCFullYear(+year, +month, 1)

    return {
      y: +properties[k as keyof typeof properties],
      x,
    }
  })

  features[id] = {
    name,
    data,
    coordinates,
    properties
  }
})

const onMapsAPILoaded = () => {
  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  )

  root.render(
    <React.StrictMode>
      <CSTTest features={features} />
    </React.StrictMode>
  )
}

declare global {
  interface Window {
    onMapsAPILoaded: () => void
  }
}

window.onMapsAPILoaded = onMapsAPILoaded
