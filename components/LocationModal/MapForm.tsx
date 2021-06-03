import {FC, useEffect, useRef, useState, useCallback} from 'react'
import GoogleMapReact from 'google-map-react'
import Slider from 'rc-slider'
import {useTranslation} from 'next-i18next'
import debounce from 'lodash.debounce'
import {setCookie} from 'nookies'
import Autocomplete from '../Selects/Autocomplete'
import SecondaryButton from '../Buttons/SecondaryButton'
import PrimaryButton from '../Buttons/PrimaryButton'
import {makeRequest} from '../../api'

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
  const {t} = useTranslation()
  const [location, setLocation] = useState(null)
  const [radius, setRadius] = useState(42)
  const circle = useRef(null)
  const marker = useRef(null)
  const mapRef = useRef(null)
  const mapsRef = useRef(null)
  const initialLocation = useRef(null)
  const loadOptions = useCallback(
    debounce((inputValue, callback) => {
      if (!inputValue) {
        callback([])
      } else {
        makeRequest({
          method: 'get',
          url: '/api/location-text-search',
          params: {query: inputValue},
        }).then((res) => {
          callback(
            res.data.results.map((l) => ({
              label: l.formatted_address,
              value: l.place_id,
              geometry: l.geometry,
            })),
          )
        })
      }
    }, 500),
    [],
  )
  useEffect(() => {
    makeRequest({method: 'get', url: '/api/mylocation'}).then(
      ({data: {data}}) => {
        const center = {lat: data.latitude, lng: data.longitude}
        setLocation(center)
        initialLocation.current = center
      },
    )
  }, [])

  const onChangeMap = ({center}) => {
    if (!circle?.current) return
    setLocation(center)
    // @ts-ignore
    circle.current.setCenter(center)
    marker.current.setPosition(center)
  }
  const onChangeRadius = (data) => {
    if (!circle?.current) return
    setRadius(data)
    // @ts-ignore
    circle.current.setRadius(marksMap[data] * 1000)
  }
  const onChangeSearch = (item) => {
    if (!item) return
    setLocation(item.geometry.location)
    circle.current.setCenter(item.geometry.location)
    marker.current.setPosition(item.geometry.location)
  }

  const onSubmit = () => {
    setCookie(null, 'searchLocation', JSON.stringify(location))
    setCookie(null, 'searchRadius', marksMap[radius])
  }

  return (
    <div className='flex flex-col justify-between h-full'>
      <div className='pt-4 px-6'>
        <Autocomplete
          placeholder={t('ENTER_ADDRESS')}
          isClearable
          loadOptions={loadOptions}
          onChange={onChangeSearch}
        />
        <div style={{height: '288px', width: '432px'}} className='my-4'>
          {location && (
            <GoogleMapReact
              bootstrapURLKeys={{key: process.env.NEXT_PUBLIC_GOOGLE_API}}
              center={location}
              onChange={onChangeMap}
              yesIWantToUseGoogleMapApiInternals
              margin={[1, 2, 3, 4]}
              defaultZoom={8}
              onGoogleApiLoaded={({map, maps}) => {
                mapRef.current = map
                mapsRef.current = maps
                circle.current = new maps.Circle({
                  strokeColor: '#FF9514',
                  strokeWeight: 2,
                  fillColor: '#FF9514',
                  fillOpacity: 0.2,
                  map,
                  center: location,
                  radius: 25000,
                })
                const svgMarker = {
                  path:
                    'M14 39L13.6274 39.3334L14 39.7499L14.3726 39.3334L14 39ZM14 39C14.3726 39.3334 14.3727 39.3333 14.3729 39.3331L14.3734 39.3325L14.3754 39.3302L14.3829 39.3218L14.4117 39.2894C14.437 39.2608 14.4741 39.2187 14.5224 39.1635C14.6189 39.0532 14.7599 38.8906 14.9391 38.6804C15.2974 38.2602 15.8084 37.6495 16.4213 36.8855C17.6465 35.358 19.281 33.2152 20.9164 30.7547C22.5509 28.2956 24.1923 25.5102 25.4266 22.6982C26.6582 19.8922 27.5 17.025 27.5 14.4118C27.5 6.75161 21.4624 0.5 14 0.5C6.53761 0.5 0.5 6.75161 0.5 14.4118C0.5 17.025 1.34179 19.8922 2.57341 22.6982C3.80766 25.5102 5.44909 28.2956 7.08359 30.7547C8.719 33.2152 10.3535 35.358 11.5787 36.8855C12.1916 37.6495 12.7026 38.2602 13.0609 38.6804C13.2401 38.8906 13.3811 39.0532 13.4776 39.1635C13.5259 39.2187 13.563 39.2608 13.5883 39.2894L13.6171 39.3218L13.6246 39.3302L13.6266 39.3325L13.6271 39.3331C13.6273 39.3333 13.6274 39.3334 14 39Z',
                  fillColor: '#FF9514',
                  fillOpacity: 1,
                  strokeColor: '#FFFFFF',
                  strokeOpacity: 1,
                  anchor: new maps.Point(14, 35),
                }
                marker.current = new maps.Marker({
                  position: map.getCenter(),
                  icon: svgMarker,
                  map,
                })
              }}
            />
          )}
        </div>
        <Slider
          trackStyle={{backgroundColor: '#FF9514', height: 4}}
          railStyle={{backgroundColor: 'rgba(12, 13, 13, 0.1)', height: 4}}
          marks={marks}
          value={radius}
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
        <p className='mt-8 text-body-2 text-black-b'>
          {t('LOCATION_BY_MAP_TIP')}
        </p>
      </div>
      <div className='flex w-full border-t border-shadow-b mb-6 pt-4 justify-end'>
        <SecondaryButton
          onClick={() => {
            setLocation(initialLocation.current)
            onChangeRadius(42)
            mapRef.current.setCenter(
              new mapsRef.current.LatLng(initialLocation.current),
            )
          }}>
          {t('CLEAN')}
        </SecondaryButton>
        <PrimaryButton onClick={onSubmit} className='ml-4 mr-6'>
          {t('APPLY')}
        </PrimaryButton>
      </div>
    </div>
  )
}

export default MapForm
