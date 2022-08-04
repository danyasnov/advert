import {FC, useContext, useEffect, useRef, useState} from 'react'
import GoogleMapReact from 'google-map-react'
import {useTranslation} from 'next-i18next'
import {parseCookies} from 'nookies'
import IcMyLocation from 'icons/material/MyLocation.svg'
import {degradations} from 'front-api/src/models'
import {useRouter} from 'next/router'
import {toast} from 'react-toastify'
import {first, get} from 'lodash'
import {useWindowSize} from 'react-use'
import IcClose from 'icons/material/Close.svg'
import localforage from 'localforage'
import {SerializedCookiesState} from '../../types'
import {AdvertPages, WizardContext} from './AdvertWizard'
import Button from '../Buttons/Button'
import {getPosition} from '../../utils'
import MapRadiusSelector from '../MapRadiusSelector'
import SvgMapMarker from '../../assets/icons/SvgMapMarker'
import PlacesTextSearch from '../Selects/PlacesTextSearch'
import PrimaryButton from '../Buttons/PrimaryButton'
import {makeRequest} from '../../api'
import MobileMapSearch from './MobileMapSearch'

const zoomRadiusMap = {
  0: 15,
  1: 14,
  2: 13,
}

const MapPage: FC = () => {
  const {state, dispatch} = useContext(WizardContext)
  const {query, push} = useRouter()
  const hash = first(query.hash)
  const {width} = useWindowSize()
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
  const [label, setLabel] = useState('')
  const [radius, setRadius] = useState<number>(
    degradations.find((d) => d.key === state.draft.degradation)?.radius ?? 0,
  )
  const {t} = useTranslation()
  const initialLocation = useRef(null)
  useEffect(() => {
    const init = async () => {
      let locationValue
      if (state.draft.location) {
        const {latitude: lat, longitude: lng} = state.draft.location
        locationValue = {lat, lng}
      } else {
        const lastMapPosition = await localforage.getItem(`last_map_position`)
        if (lastMapPosition) {
          locationValue = lastMapPosition
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
      }
      initialLocation.current = locationValue
      setLocation(locationValue)
    }
    init()
  }, [])

  useEffect(() => {
    if (marker.current) {
      marker.current.visible = radius === 0
    }
  }, [radius])
  const circle = useRef(null)
  const marker = useRef(null)
  const mapRef = useRef(null)
  const mapsRef = useRef(null)

  const onChangeMap = ({center}) => {
    if (circle.current) circle.current.setCenter(center)
    if (marker.current) marker.current.setPosition(center)
    setLocation(center)
    makeRequest({
      url: '/api/fetch-place-info',
      method: 'post',
      data: {
        location: {
          latitude: center.lat,
          longitude: center.lng,
        },
      },
    }).then((res) => {
      const address = get(res, 'data.results[0].formatted_address')
      if (address) setLabel(address)
    })
  }
  const onChangeRadius = (value: number, key: string) => {
    setRadius(value)
    setDegradation(key)
    mapRef.current.setZoom(zoomRadiusMap[value])
    circle.current.setRadius(value * 1000)
  }

  const onSubmit = () => {
    const {lat: latitude, lng: longitude} = location
    localforage.setItem(`last_map_position`, location)
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
    }).then((data) => {
      const currencies = data.data.result
      if (!currencies) {
        toast.error(t('EMPTY_COORDS'))
        return Promise.reject()
      }
      newDraft.currencies = currencies
      if (hash) newDraft.hash = hash
      if (label) newDraft.addressDraft = label

      dispatch({
        type: 'setDraft',
        draft: newDraft,
      })
      if (hash) {
        return makeRequest({
          url: '/api/save-draft',
          method: 'post',
          data: {
            hash,
            draft: newDraft,
          },
        }).then(() => {
          dispatch({
            type: 'setPage',
            page: AdvertPages.categoryPage,
          })
        })
      }
      return dispatch({
        type: 'setPage',
        page: AdvertPages.categoryPage,
      })
    })
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
      strokeColor: '#7210FF',
      strokeWeight: 2,
      fillColor: '#7210FF',
      fillOpacity: 0.2,
      map,
      center: location,
      radius: radius * 1000,
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
  }

  const handleSelectLocation = (item) => {
    if (!item?.geometry?.location) return
    setLocation(item.geometry.location)
    circle.current.setCenter(item.geometry.location)
    marker.current.setPosition(item.geometry.location)
  }

  return (
    <div className='flex flex-col w-full'>
      <div className='flex flex-col s:hidden'>
        <div className='flex items-center p-4'>
          <Button
            onClick={() => {
              push('/')
            }}>
            <IcClose className='w-5 h-5 fill-current text-nc-icon mr-4' />
          </Button>
          <h2 className='text-nc-title font-medium text-body-14'>
            {t('NEW_AD')}
          </h2>
        </div>
      </div>
      <div className='flex flex-col w-full h-full'>
        <h3 className='text-h-5 text-hc-title font-bold mb-2 mt-8 hidden s:flex'>
          {t('INSPECTION_PLACE')}
        </h3>
        <span className='text-primary-500-text text-body-16 mb-6 hidden s:flex'>
          {t('INSPECTION_PLACE_TIP')}
        </span>

        <div className='relative min-h-full w-full mb-24'>
          {location && (
            <>
              <div className='absolute top-3 left-3 w-608px z-10 hidden s:flex'>
                <PlacesTextSearch
                  handleSelectLocation={handleSelectLocation}
                  label={label}
                />
              </div>
              <GoogleMapReact
                bootstrapURLKeys={{key: process.env.NEXT_PUBLIC_GOOGLE_API}}
                center={location}
                onChange={onChangeMap}
                yesIWantToUseGoogleMapApiInternals
                options={{
                  ...(width < 768
                    ? {
                        zoomControl: false,
                        fullscreenControl: false,
                        gestureHandling: 'greedy',
                      }
                    : {
                        zoomControlOptions: {
                          position: 8,
                        },
                        fullscreenControl: false,
                      }),
                }}
                margin={[1, 2, 3, 4]}
                defaultZoom={zoomRadiusMap[radius]}
                onGoogleApiLoaded={onGoogleApiLoaded}
              />
              <div className='absolute bottom-0 s:bottom-6 inset-x-0 s:left-0 s:inset-x-auto s:w-full'>
                <div className='flex items-center flex-col mx-2 s:w-full'>
                  <div className='w-full flex flex-col mr-4 s:flex-row s:justify-between s:items-center'>
                    <Button
                      className='bg-white w-10 h-10 s:w-12 s:h-12 rounded-full self-end mb-4 s:mb-0 s:order-last s:mr-2'
                      onClick={async () => {
                        try {
                          const center = await getPosition()
                          onChangeMap({center})
                          setLocation(center)
                        } catch (e) {
                          console.error(e)
                        }
                      }}>
                      <IcMyLocation className='fill-current text-nc-icon w-6 h-6' />
                    </Button>
                    <MapRadiusSelector
                      radius={radius}
                      setRadius={onChangeRadius}
                    />
                  </div>
                  <div className='s:hidden mt-2'>
                    <MobileMapSearch
                      label={label}
                      onSubmit={onSubmit}
                      handleSelectLocation={handleSelectLocation}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <div className='fixed inset-x-0 bottom-0 flex justify-end bg-white shadow-2xl px-8 m:px-10 l:px-29 py-2.5 justify-around hidden s:flex'>
          <div className='w-full l:w-1208px flex justify-end'>
            <PrimaryButton
              onClick={onSubmit}
              id='ad-apply-button'
              // disabled={!label}
            >
              {t('APPLY')}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapPage
