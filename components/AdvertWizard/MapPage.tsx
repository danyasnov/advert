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
import localforage from 'localforage'
import {isAndroid} from 'react-device-detect'
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
import InlineMapRadiusSelector from '../InlineMapRadiusSelector'
import {handleMetrics, setCookiesObject} from '../../helpers'
import {useGeneralStore} from '../../providers/RootStoreProvider'

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
  const [showHint, setShowHint] = useState(false)

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
    const cookies: SerializedCookiesState = parseCookies()
    const {showCreateAdvMapHint} = cookies
    setShowHint(showCreateAdvMapHint !== 'false')
  }, [])

  const hideHint = () => {
    setShowHint(false)
    setCookiesObject({showCreateAdvMapHint: false})
  }
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
      // newDraft.currencies = []
      if (hash) newDraft.hash = hash
      if (label) newDraft.addressDraft = label

      dispatch({
        type: 'setDraft',
        draft: newDraft,
      })
      handleMetrics('addAdvt_adress')
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
      strokeColor: '#FFFFFF',
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
    if (!item?.placeId) return
    makeRequest({
      method: 'post',
      url: '/api/find-place-id',
      data: {placeId: item.placeId},
    }).then((res) => {
      const loc = res.data?.location
        ? {lat: res.data.location.latitude, lng: res.data.location.longitude}
        : null
      if (loc) {
        setLocation(loc)
        circle.current.setCenter(loc)
        marker.current.setPosition(loc)
      }
      if (res.data?.address) {
        setLabel(res.data.address)
      }
    })
  }

  const locationButton = (
    <Button
      className='bg-white w-11 h-11 rounded-full'
      onClick={async () => {
        try {
          const center = await getPosition()
          onChangeMap({center})
          setLocation(center)
        } catch (e) {
          console.error(e)
        }
      }}>
      <IcMyLocation className='fill-current text-primary-500 w-6 h-6' />
    </Button>
  )
  return (
    <div className='flex flex-col w-full'>
      <div className='flex flex-col w-full ios-height-hack firefox:min-h-full'>
        <h3 className='text-h-5 text-hc-title font-bold mb-2 mt-8 hidden s:flex'>
          {t('INSPECTION_PLACE')}
        </h3>
        <span className='text-greyscale-900 text-body-16 mb-6 hidden s:flex'>
          {t('INSPECTION_PLACE_INFO')}
        </span>

        <div className='relative w-full s:rounded-3xl s:overflow-hidden ios-height-hack firefox:min-h-full [-webkit-mask-image:-webkit-radial-gradient(white,black)]'>
          {location && (
            <>
              <div className='absolute top-8 z-10 hidden s:flex justify-between w-full space-x-8 inset-x-0 px-8'>
                <div className='flex flex-col w-full space-y-3'>
                  <div className='flex'>
                    <PlacesTextSearch
                      handleSelectLocation={handleSelectLocation}
                      label={label}
                      radius={radius}
                      setRadius={onChangeRadius}
                    />
                  </div>
                  <div className='m:hidden flex py-1.5 px-2 bg-white rounded-full w-min'>
                    <InlineMapRadiusSelector
                      radius={radius}
                      setRadius={onChangeRadius}
                    />
                  </div>
                  {showHint && (
                    <div className='w-[280px] flex flex-col p-6 bg-white flex flex-col rounded-3xl m:absolute m:right-44 m:top-12'>
                      <span className='font-normal text-greyscale-900 text-body-16 mb-6 text-center'>
                        {t('TIP_MAP_CREATE_ADS')}
                      </span>
                      <PrimaryButton onClick={hideHint}>
                        {t('CLEAR')}
                      </PrimaryButton>
                    </div>
                  )}
                </div>
                <div>{locationButton}</div>
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
              <div className='s:hidden absolute top-10 inset-x-0 w-full px-4'>
                <MobileMapSearch
                  label={label}
                  handleSelectLocation={handleSelectLocation}
                  radius={radius}
                  setRadius={onChangeRadius}
                />
              </div>
              <div
                className={`s:hidden absolute  inset-x-0 w-full px-4 flex flex-col  ${
                  isAndroid ? 'bottom-20' : 'bottom-6'
                }`}>
                <div className='self-end mb-4'>{locationButton}</div>
                <Button
                  className='w-full bg-primary-500 rounded-full text-body-16 py-4 text-white font-bold s:hidden'
                  onClick={onSubmit}>
                  {t('CONTINUE')}
                </Button>
              </div>
            </>
          )}
        </div>
        <div className='fixed inset-x-0 flex justify-end bg-white bottom-0 shadow-2xl px-8 m:px-10 l:px-29 py-2.5 justify-around hidden s:flex'>
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
