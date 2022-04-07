import {FC, useEffect, useState} from 'react'
import {useTranslation} from 'next-i18next'
import IcLocation from 'icons/location/Location.svg'
import IcLocationSmall from 'icons/location/LocationSmall.svg'
import IcLocationBig from 'icons/location/LocationBig.svg'
import IcLocationHover from 'icons/location/LocationHover.svg'
import IcLocationSmallHover from 'icons/location/LocationSmallHover.svg'
import IcLocationBigHover from 'icons/location/LocationBigHover.svg'
import IcLocationActive from 'icons/location/LocationActive.svg'
import IcLocationSmallActive from 'icons/location/LocationSmallActive.svg'
import IcLocationBigActive from 'icons/location/LocationBigActive.svg'
import {
  DEGRADATION_TYPE_ABSENT,
  DEGRADATION_TYPE_HIGH,
  DEGRADATION_TYPE_LOW,
  TypeOfDegradation,
} from 'front-api/src/models/index'
import {parseCookies} from 'nookies'
import IcClear from 'icons/material/Clear.svg'
import IcRadius from 'icons/material/Radius.svg'
import {useWindowSize} from 'react-use'
import Button from './Buttons/Button'
import {SerializedCookiesState} from '../types'
import {setCookiesObject} from '../helpers'

interface Props {
  radius: number
  setRadius: (radius: number, key: TypeOfDegradation) => void
}

const options = [
  {
    title: DEGRADATION_TYPE_ABSENT.title,
    value: DEGRADATION_TYPE_ABSENT.radius,
    key: DEGRADATION_TYPE_ABSENT.key,
    icon: IcLocation,
    iconActive: IcLocationActive,
    iconHover: IcLocationHover,
  },
  {
    title: DEGRADATION_TYPE_LOW.title,
    value: DEGRADATION_TYPE_LOW.radius,
    key: DEGRADATION_TYPE_LOW.key,
    icon: IcLocationSmall,
    iconActive: IcLocationSmallActive,
    iconHover: IcLocationSmallHover,
  },
  {
    title: DEGRADATION_TYPE_HIGH.title,
    value: DEGRADATION_TYPE_HIGH.radius,
    key: DEGRADATION_TYPE_HIGH.key,
    icon: IcLocationBig,
    iconActive: IcLocationBigActive,
    iconHover: IcLocationBigHover,
  },
]

const MapRadiusSelector: FC<Props> = ({radius, setRadius}) => {
  const {t} = useTranslation()
  const {width} = useWindowSize()
  const [showPanel, setShowPanel] = useState(width >= 768)
  const [showHint, setShowHint] = useState(false)
  useEffect(() => {
    const state: SerializedCookiesState = parseCookies()
    const {showCreateAdvMapHint} = state
    setShowHint(showCreateAdvMapHint !== 'false')
  }, [])
  const hideHint = () => {
    setShowHint(false)
    setCookiesObject({showCreateAdvMapHint: false})
  }
  return (
    <div className='relative w-full '>
      {!showPanel && (
        <div className='s:hidden absolute bottom-1 right-2 '>
          <Button
            className='h-10 w-10 rounded-full bg-white'
            onClick={() => {
              setShowPanel(!showPanel)
              hideHint()
            }}>
            <IcRadius className='fill-current text-black-c w-6 h-6' />
          </Button>
        </div>
      )}
      {showHint && (
        <div className='relative w-full'>
          <div className='right-16 absolute bottom-1 s:bottom-4 s:left-2'>
            <div
              className={`bg-nc-link flex flex-col w-56 s:w-362px rounded-2xl p-4 items-start ${
                width < 768
                  ? 'map-hint-arrow-mobile-right'
                  : 's:map-hint-arrow-bottom'
              }`}>
              <div className='flex text-white items-start mb-4'>
                <div className='text-body-1'>{t('TIP_MAP_CREATE_ADS')}</div>
                <Button onClick={hideHint}>
                  <IcClear className='fill-current h-4 w-4' />
                </Button>
              </div>
              <Button
                onClick={hideHint}
                className='text-nc-link rounded-lg bg-white px-3 py-1.5 text-body-1'>
                {t('CLEAR')}
              </Button>
            </div>
          </div>
        </div>
      )}
      {showPanel && (
        <div className='flex justify-center'>
          <div className='flex rounded-xl p-1 bg-white space-x-0.5 w-81 s:w-auto '>
            {options.map((o) => {
              const isCurrent = radius === o.value
              const Icon = isCurrent ? o.iconActive : o.icon
              return (
                <Button
                  key={o.key}
                  id={`location-radius-selector-${o.key}`}
                  onClick={() => {
                    setRadius(o.value, o.key)
                    if (width < 768) {
                      setShowPanel(false)
                    }
                  }}
                  className={`flex px-1 s:px-4 py-2 s:py-3 justify-center items-center hover:bg-nc-accent rounded-lg h-10 ${
                    isCurrent ? 'bg-nc-accent' : ''
                  }`}>
                  <Icon className='h-5 w-5 mr-1' />
                  <span className='text-body-4 s:text-body-1 font-normal'>
                    {t(o.title, {n: o.value})}
                  </span>
                </Button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default MapRadiusSelector
