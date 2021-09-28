import {FC, useRef, useState} from 'react'
import GoogleMapReact from 'google-map-react'
import Slider from 'rc-slider'
import {useTranslation} from 'next-i18next'
import {parseCookies} from 'nookies'
import {useRouter} from 'next/router'
import IcAim from 'icons/material/Aim.svg'
import ReactDOM from 'react-dom'
import SecondaryButton from '../Buttons/SecondaryButton'
import PrimaryButton from '../Buttons/PrimaryButton'
import {makeRequest} from '../../api'
import {
  getLocationQuery,
  getShortAddress,
  objectFlip,
  setCookiesObject,
} from '../../helpers'
import {SerializedCookiesState} from '../../types'
import Button from '../Buttons/Button'

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
  100: 5000,
}

const zoomMarksMap = {
  0: 13,
  14: 11,
  28: 10,
  42: 9,
  56: 8,
  70: 7,
  84: 6,
  100: 1,
}

const invertedMarksMap = objectFlip(marksMap)

const getPosition = (): Promise<{
  lat: number
  lng: number
}> => {
  return new Promise((resolve, reject) =>
    navigator.geolocation.getCurrentPosition((position) => {
      resolve({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      })
    }, reject),
  )
}

interface Props {
  onClose: () => void
}
const MapForm: FC<Props> = ({onClose}) => {
  const router = useRouter()
  const cookies: SerializedCookiesState = parseCookies()
  const {searchLocation, userLocation, searchRadius} = cookies
  const {t} = useTranslation()
  const initialLocation = useRef(null)

  const [location, setLocation] = useState(() => {
    let loc
    if (searchLocation) {
      loc = JSON.parse(searchLocation)
    } else {
      loc = JSON.parse(userLocation)
    }
    const value = {lat: loc.latitude, lng: loc.longitude}
    initialLocation.current = value
    return value
  })
  const [radius, setRadius] = useState(invertedMarksMap[searchRadius])
  const circle = useRef(null)
  const marker = useRef(null)
  const mapRef = useRef(null)
  const mapsRef = useRef(null)

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
    mapRef.current.setZoom(zoomMarksMap[data])
    circle.current.setRadius(marksMap[data] * 1000)
  }

  const onSubmit = () => {
    const resultLocation = {latitude: location.lat, longitude: location.lng}
    setCookiesObject({
      searchLocation: resultLocation,
      searchRadius: marksMap[radius],
      searchBy: 'coords',
    })
    makeRequest({
      url: '/api/address-by-location',
      method: 'post',
      data: {
        location: resultLocation,
      },
    }).then((res) => {
      setCookiesObject({
        address: getShortAddress(res.data.result),
      })
      router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          ...getLocationQuery(res.data.result),
        },
      })
      onClose()
    })
  }

  const handleOnLoad = (map, maps) => {
    const controlButtonDiv = document.createElement('div')
    ReactDOM.render(
      <Button
        className='bg-white w-10 h-10 absolute right-2.5 top-20 rounded'
        onClick={async () => {
          try {
            const center = await getPosition()
            onChangeMap({center})
          } catch (e) {
            console.error(e)
          }
        }}>
        <IcAim className='fill-current text-black-c w-6 h-6' />
      </Button>,
      controlButtonDiv,
    )
    map.controls[maps.ControlPosition.TOP_RIGHT].push(controlButtonDiv)
  }

  return (
    <div className='flex flex-col justify-between h-full'>
      <div className='pt-4 px-4 s:px-6'>
        <div style={{height: '288px'}} className='my-4 -mx-4 s:-mx-0 relative'>
          {location && (
            <>
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
                    radius: marksMap[radius] * 1000,
                  })
                  const svgMarker = {
                    path: 'M14 39L13.6274 39.3334L14 39.7499L14.3726 39.3334L14 39ZM14 39C14.3726 39.3334 14.3727 39.3333 14.3729 39.3331L14.3734 39.3325L14.3754 39.3302L14.3829 39.3218L14.4117 39.2894C14.437 39.2608 14.4741 39.2187 14.5224 39.1635C14.6189 39.0532 14.7599 38.8906 14.9391 38.6804C15.2974 38.2602 15.8084 37.6495 16.4213 36.8855C17.6465 35.358 19.281 33.2152 20.9164 30.7547C22.5509 28.2956 24.1923 25.5102 25.4266 22.6982C26.6582 19.8922 27.5 17.025 27.5 14.4118C27.5 6.75161 21.4624 0.5 14 0.5C6.53761 0.5 0.5 6.75161 0.5 14.4118C0.5 17.025 1.34179 19.8922 2.57341 22.6982C3.80766 25.5102 5.44909 28.2956 7.08359 30.7547C8.719 33.2152 10.3535 35.358 11.5787 36.8855C12.1916 37.6495 12.7026 38.2602 13.0609 38.6804C13.2401 38.8906 13.3811 39.0532 13.4776 39.1635C13.5259 39.2187 13.563 39.2608 13.5883 39.2894L13.6171 39.3218L13.6246 39.3302L13.6266 39.3325L13.6271 39.3331C13.6273 39.3333 13.6274 39.3334 14 39Z',
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
                  handleOnLoad(map, maps)
                }}
              />
            </>
          )}
        </div>
        <Slider
          trackStyle={{backgroundColor: '#FF9514', height: 4}}
          railStyle={{backgroundColor: 'rgba(12, 13, 13, 0.1)', height: 4}}
          marks={marks}
          value={radius}
          defaultValue={radius}
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
      <div className='flex justify-between px-4 s:px-6 w-full border-t border-shadow-b mt-6 s:mt-0 mb-6 pt-4 s:justify-end'>
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
        <PrimaryButton onClick={onSubmit} className='ml-4'>
          {t('APPLY')}
        </PrimaryButton>
      </div>
    </div>
  )
}

export default MapForm
