import {FC, useEffect, useRef, useState} from 'react'
import GoogleMapReact from 'google-map-react'
import {useTranslation} from 'next-i18next'
import {parseCookies} from 'nookies'
import IcAim from 'icons/material/Aim.svg'
import ReactDOM from 'react-dom'
import {degradations} from 'front-api/src/models/index'
import {useRouter} from 'next/router'
import {toast} from 'react-toastify'
import {SerializedCookiesState} from '../../types'
import {AdvertPages, PageProps} from './AdvertWizard'
import Button from '../Buttons/Button'
import {getPosition} from '../../utils'
import MapRadiusSelector from '../MapRadiusSelector'
import SvgMapMarker from '../../assets/icons/SvgMapMarker'
import PlacesTextSearch from '../Selects/PlacesTextSearch'
import PrimaryButton from '../Buttons/PrimaryButton'
import {makeRequest} from '../../api'

const zoomRadiusMap = {
  0: 15,
  1: 14,
  2: 13,
}

const MapPage: FC<PageProps> = ({dispatch, state}) => {
  const {query} = useRouter()
  const [location, setLocation] = useState<{lat: number; lng: number}>(() => {
    if (state.draft.location) {
      const {latitude: lat, longitude: lng} = state.draft.location
      return {lat, lng}
    }
    return null
  })
  const [degradation, setDegradation] = useState<string>(() => {
    if (state.draft.degradation) {
      return state.draft.degradation
    }
    return 'absent'
  })
  const [radius, setRadius] = useState<number>(
    degradations.find((d) => d.key === state.draft.degradation)?.radius ?? 0,
  )
  const {t} = useTranslation()
  const initialLocation = useRef(null)
  useEffect(() => {
    let locationValue
    if (state.draft.location) {
      locationValue = state.draft.location
    } else {
      const cookies: SerializedCookiesState = parseCookies()
      const {searchLocation, userLocation} = cookies
      let loc
      if (userLocation) {
        loc = JSON.parse(userLocation)
      } else {
        loc = JSON.parse(searchLocation)
      }
      locationValue = {lat: loc.latitude, lng: loc.longitude}
    }
    initialLocation.current = locationValue
    setLocation(locationValue)
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
  const onChangeRadius = (value: number, key: string) => {
    setRadius(value)
    setDegradation(key)
    mapRef.current.setZoom(zoomRadiusMap[value])
    circle.current.setRadius(value * 1000)
  }

  const onSubmit = () => {
    const {lat: latitude, lng: longitude} = location
    const {draft} = state
    const newDraft = {
      ...draft,
      location: {
        latitude,
        longitude,
      },
      degradation,
    }
    makeRequest({
      url: '/api/currencies-by-gps',
      method: 'post',
      data: {
        location: {latitude, longitude},
      },
    })
      .then((data) => {
        const currencies = data.data.result
        if (!currencies) {
          toast.error(t('EMPTY_COORDS'))
          return Promise.reject()
        }
        return makeRequest({
          url: '/api/save-draft',
          method: 'post',
          data: {
            hash: query.hash,
            draft: {...newDraft, currencies},
          },
        })
      })
      .then(() => {
        dispatch({
          type: 'setLocation',
          location: {
            latitude,
            longitude,
          },
        })
        dispatch({
          type: 'setDegradation',
          degradation,
        })
        dispatch({
          type: 'setPage',
          page: AdvertPages.categoryPage,
        })
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
              defaultZoom={zoomRadiusMap[radius]}
              onGoogleApiLoaded={onGoogleApiLoaded}
            />
            <div className='absolute bottom-6 left-3'>
              <MapRadiusSelector radius={radius} setRadius={onChangeRadius} />
            </div>
          </>
        )}
      </div>
      <div className='fixed inset-x-0 bottom-0 flex justify-end bg-white shadow-2xl px-29 py-2.5'>
        <PrimaryButton onClick={onSubmit}>{t('APPLY')}</PrimaryButton>
      </div>
    </div>
  )
}

export default MapPage
