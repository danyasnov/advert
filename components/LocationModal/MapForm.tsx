import {FC, useEffect, useRef, useState} from 'react'
import GoogleMapReact from 'google-map-react'
import axios from 'axios'
import Slider from 'rc-slider'

const getMark = (label) => ({
  style: {
    color: '#7C7E83',
    lineHeight: '12px',
    fontSize: '10px',
  },
  label,
})

const marks = {
  0: getMark('1'),
  14: getMark('5'),
  28: getMark('10'),
  42: getMark('25'),
  56: getMark('50'),
  70: getMark('100'),
  84: getMark('200'),
  100: getMark('>200'),
}

const marksMap = {
  0: 1,
  14: 5,
  28: 10,
  42: 25,
  56: 50,
  70: 100,
  84: 200,
  100: 300,
}

const MapForm: FC = () => {
  const [location, setLocation] = useState(null)
  const marker = useRef()
  useEffect(() => {
    axios.get('/api/mylocation').then(({data: {data}}) => {
      setLocation({lat: data.latitude, lng: data.longitude})
    })
  }, [])

  const onChangeMap = ({center}) => {
    if (!marker?.current) return
    // @ts-ignore
    marker.current.setCenter(center)
  }
  const onChangeRadius = (data) => {
    if (!marker?.current) return
    // @ts-ignore
    marker.current.setRadius(marksMap[data] * 1000)
  }

  return (
    <div className='pt-4'>
      <div style={{height: '288px', width: '432px'}} className='mb-4'>
        {location && (
          <GoogleMapReact
            bootstrapURLKeys={{key: 'AIzaSyBuqsOfkbNgAGPkzTRU1OrpSuS_85p-3D8'}}
            defaultCenter={location}
            onChange={onChangeMap}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({map, maps}) => {
              marker.current = new maps.Circle({
                strokeColor: '#FF9514',
                strokeWeight: 2,
                fillColor: '#FF9514',
                fillOpacity: 0.2,
                map,
                center: location,
                radius: 25000,
              })
            }}
            defaultZoom={8}
          />
        )}
      </div>
      <Slider
        trackStyle={{backgroundColor: '#FF9514', height: 4}}
        railStyle={{backgroundColor: 'rgba(12, 13, 13, 0.1)', height: 4}}
        marks={marks}
        defaultValue={42}
        onChange={onChangeRadius}
        dotStyle={{border: 'none', backgroundColor: 'transparent'}}
        activeDotStyle={{border: 'none', backgroundColor: 'transparent'}}
        step={null}
        handleStyle={{
          height: 20,
          width: 20,
          marginTop: -8,
          backgroundColor: '#FF9514',
          border: '1px solid #CE7A13',
          boxShadow: 'none',
        }}
      />
    </div>
  )
}

export default MapForm
