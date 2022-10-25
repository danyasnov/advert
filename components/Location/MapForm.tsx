import {FC, useRef, useState} from 'react'
import GoogleMapReact from 'google-map-react'
import Slider from 'rc-slider'
import {useTranslation} from 'next-i18next'
import {parseCookies} from 'nookies'
import {useRouter} from 'next/router'
import IcAim from 'icons/material/Aim.svg'
import ReactDOM from 'react-dom'
import {observer} from 'mobx-react-lite'
import {isAndroid} from 'react-device-detect'
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
import {getPosition} from '../../utils'
import SvgMapMarker from '../../assets/icons/SvgMapMarker'
import {useGeneralStore} from '../../providers/RootStoreProvider'

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

interface Props {
  onClose: () => void
}
const MapForm: FC<Props> = observer(({onClose}) => {
  const router = useRouter()
  const cookies: SerializedCookiesState = parseCookies()
  const {searchLocation, userLocation, searchRadius} = cookies
  const {t} = useTranslation()
  const initialLocation = useRef(null)

  const {isProduct} = useGeneralStore()
  const [location, setLocation] = useState<{lat: number; lng: number}>(() => {
    let loc = {
      latitude: 34.6841,
      longitude: 33.0379,
    }
    if (searchLocation) {
      loc = JSON.parse(searchLocation)
    } else if (userLocation) {
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
      const {city, country} = getLocationQuery(res.data.result)
      if (
        router.pathname === '/[country]/[city]/[[...categories]]' &&
        !isProduct
      ) {
        const urlArray = window.location.pathname.split('/')
        urlArray[1] = country
        urlArray[2] = city
        router.push(`${urlArray.join('/')}${window.location.search}`)
      } else {
        router.push(router)
      }

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
    <div
      className='flex flex-col justify-between h-full'
      data-test-id='location-modal-map'>
      <div className=' px-4 s:px-6'>
        <p className='mt-6 mb-4.5 text-body-14 text-greyscale-800'>
          {t('LOCATION_BY_MAP_TIP')}
        </p>
        <div className='my-4 -mx-4 s:-mx-0 relative h-[359px] overflow-hidden rounded-3xl'>
          {location && (
            <div className='h-[275px]'>
              <GoogleMapReact
                bootstrapURLKeys={{key: process.env.NEXT_PUBLIC_GOOGLE_API}}
                center={location}
                onChange={onChangeMap}
                yesIWantToUseGoogleMapApiInternals
                margin={[1, 2, 3, 4]}
                defaultZoom={6}
                onGoogleApiLoaded={({map, maps}) => {
                  mapRef.current = map
                  mapsRef.current = maps
                  circle.current = new maps.Circle({
                    strokeColor: '#ffffff',
                    strokeWeight: 2,
                    fillColor: '#7210FF',
                    fillOpacity: 0.2,
                    map,
                    center: location,
                    radius: marksMap[radius] * 1000,
                  })
                  const svgMarker = {
                    path: SvgMapMarker,
                    fillColor: '#7210FF',
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
            </div>
          )}
          <div className='h-[84px] bg-greyscale-50 pt-7 px-5'>
            <Slider
              className='data-test-id-location-modal-map-slider'
              trackStyle={{backgroundColor: '#7210FF', height: 4}}
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
                backgroundColor: '#7210FF',
                border: '1px solid #7210FF',
                boxShadow: 'none',
              }}
            />
          </div>
        </div>
      </div>
      <div
        className={`flex px-4 s:px-6 w-full mt-8 s:mt-0 pt-4 ${
          isAndroid ? 'mb-20' : 'mb-6'
        }`}>
        <SecondaryButton
          id='location-modal-map-clean'
          className='w-full'
          onClick={() => {
            setLocation(initialLocation.current)
            onChangeRadius(42)
            mapRef.current.setCenter(
              new mapsRef.current.LatLng(initialLocation.current),
            )
          }}>
          {t('CLEAN')}
        </SecondaryButton>
        <PrimaryButton
          className='ml-2 w-full'
          id='location-modal-map-apply'
          onClick={onSubmit}>
          {t('APPLY')}
        </PrimaryButton>
      </div>
    </div>
  )
})

export default MapForm
