import React from 'react'
import _keys from 'lodash/keys'
import Card from '@mui/material/Card'
import _isFinite from 'lodash/isFinite'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { Line as LineChart } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

interface CSTFeatureDataPoint {
  x: Date
  y: number
}

interface CSTFeature {
  properties: any
  data: CSTFeatureDataPoint[]
}

interface FeatureDetailsProps {
  feature: CSTFeature
}

class FeatureDetails extends React.PureComponent<FeatureDetailsProps, any> {
  render() {
    const { feature } = this.props
    const { properties, data } = feature
    const { name } = properties
    const propertyKeys = _keys(properties).filter(k => !_isFinite(+k))

    return (
      <Card>
        <CardContent>
          {propertyKeys.map(k => (
            <Typography key={k} sx={{ fontSize: 14 }}>
              {k}: {properties[k]}
            </Typography>
          ))}
          <br />
          <LineChart data={{
            datasets: [{
              label: name,
              data: data.map(({ x, y }) => ({ x: x.toLocaleString(), y })),
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.5)'
            }]
          }} />
        </CardContent>
      </Card>
    )
  }
}

export default FeatureDetails
