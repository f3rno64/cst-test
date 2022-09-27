import React from 'react'
import _keys from 'lodash/keys'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

import FeatureDetails from '../feature_details'

const SidebarItem = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(1),
}))

interface CSTLatLng {
  lat: number
  lng: number
}

interface CSTPolygon {
  featureId: string
  polygon: google.maps.Polygon
  data: CSTLatLng[]
}

interface SidebarProps {
  features: any
  polygons: CSTPolygon[]
  selectedFeature: any
  onSelectFeature: Function
}

class Sidebar extends React.PureComponent<SidebarProps, any> {
  render() {
    const {
      features, polygons, selectedFeature, onSelectFeature
    } = this.props

    return (
      <div id="cst-test-sidebar">
        <Box sx={{ width: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Geo Features
          </Typography>

          <Stack spacing={2}>
            {_keys(features).map((featureId) => {
              const feature = features[featureId]
              const { name } = feature
              const polygonData = polygons.find(({ featureId: pFId }) => (
                pFId === featureId
              ))

              return (
                <SidebarItem
                  onClick={() => onSelectFeature(polygonData)}
                  key={name}
                >{name}</SidebarItem>
              )
            })}
          </Stack>

          {selectedFeature && (
            <>
              <br/>
              <Typography variant="h6">Selected Feature</Typography>
              <FeatureDetails feature={selectedFeature} />
            </>
          )}
        </Box>
      </div>
    )
  }
}

export default Sidebar
