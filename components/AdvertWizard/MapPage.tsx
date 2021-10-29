import {FC, useEffect, useRef, useState} from 'react'
import GoogleMapReact from 'google-map-react'
import {useTranslation} from 'next-i18next'
import {parseCookies} from 'nookies'
import IcAim from 'icons/material/Aim.svg'
import ReactDOM from 'react-dom'
import {SerializedCookiesState} from '../../types'
import {AdvertPages, PageProps} from './AdvertWizard'
import Button from '../Buttons/Button'
import {getPosition} from '../../utils'
import MapRadiusSelector from '../MapRadiusSelector'
import SvgMapMarker from '../../assets/icons/SvgMapMarker'
import PlacesTextSearch from '../Selects/PlacesTextSearch'
import PrimaryButton from '../Buttons/PrimaryButton'

const zoomRadiusMap = {
  0: 15,
  1: 13,
  5: 11,
}

const MapPage: FC<PageProps> = ({dispatch, state}) => {
  const [location, setLocation] = useState<{lat: number; lng: number}>()
  const [radius, setRadius] = useState<number>(0)
  const {t} = useTranslation()
  const initialLocation = useRef(null)
  useEffect(() => {
    const cookies: SerializedCookiesState = parseCookies()
    const {searchLocation, userLocation} = cookies
    let loc
    if (userLocation) {
      loc = JSON.parse(userLocation)
    } else {
      loc = JSON.parse(searchLocation)
    }
    const value = {lat: loc.latitude, lng: loc.longitude}

    initialLocation.current = value
    setLocation(value)
  }, [])

  const circle = useRef(null)
  const marker = useRef(null)
  const mapRef = useRef(null)
  const mapsRef = useRef(null)

  const onChangeMap = ({center}) => {
    if (circle.current) circle.current.setCenter(center)
    if (marker.current) marker.current.setPosition(center)
    setLocation(center)
  }
  const onChangeRadius = (data) => {
    setRadius(data)
    mapRef.current.setZoom(zoomRadiusMap[data])
    circle.current.setRadius(data * 1000)
  }

  const onSubmit = () => {
    dispatch({
      type: 'setLocation',
      location,
    })
    dispatch({
      type: 'setPage',
      page: AdvertPages.categoryPage,
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
            setLocation(center)
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

  const onGoogleApiLoaded = ({map, maps}) => {
    mapRef.current = map
    mapsRef.current = maps
    map.addListener('center_changed', () => {
      const center = {
        lat: map.getCenter().lat(),
        lng: map.getCenter().lng(),
      }
      if (circle.current) circle.current.setCenter(center)
      if (marker.current) marker.current.setPosition(center)
    })
    map.addListener('drag_end', () => {
      const center = {
        lat: map.getCenter().lat(),
        lng: map.getCenter().lng(),
      }
      setLocation(center)
    })

    circle.current = new maps.Circle({
      strokeColor: '#FF9514',
      strokeWeight: 2,
      fillColor: '#FF9514',
      fillOpacity: 0.2,
      map,
      center: location,
      radius: radius * 1000,
    })
    const svgMarker = {
      path: SvgMapMarker,
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
  }

  const handleSelectLocation = (item) => {
    if (!item) return
    setLocation(item.geometry.location)
    circle.current.setCenter(item.geometry.location)
    marker.current.setPosition(item.geometry.location)
  }

  return (
    <div className='flex flex-col w-full'>
      <h3 className='text-headline-8 text-hc-title font-bold mb-2 mt-8'>
        {t('INSPECTION_PLACE')}
      </h3>
      <span className='text-nc-primary-text text-body-1 mb-6'>
        {t('INSPECTION_PLACE_TIP')}
      </span>

      <div style={{width: '100%', height: '500px'}} className='relative'>
        {location && (
          <>
            <div className='absolute top-3 left-3 w-608px z-10'>
              <PlacesTextSearch handleSelectLocation={handleSelectLocation} />
            </div>
            <GoogleMapReact
              bootstrapURLKeys={{key: process.env.NEXT_PUBLIC_GOOGLE_API}}
              center={location}
              onChange={onChangeMap}
              yesIWantToUseGoogleMapApiInternals
              margin={[1, 2, 3, 4]}
              defaultZoom={15}
              onGoogleApiLoaded={onGoogleApiLoaded}
            />
            <div className='absolute bottom-6 left-3'>
              <MapRadiusSelector radius={radius} setRadius={onChangeRadius} />
            </div>
          </>
        )}
      </div>
      <div className='flex w-full justify-end mt-4'>
        <PrimaryButton onClick={onSubmit} className='ml-4'>
          {t('APPLY')}
        </PrimaryButton>
      </div>
    </div>
  )
}

export default MapPage
