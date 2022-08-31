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
import {Location} from 'react-iconly'
import Button from './Buttons/Button'
import {SerializedCookiesState} from '../types'
import {setCookiesObject} from '../helpers'

interface Props {
  radius: number
  setRadius: (radius: number, key: TypeOfDegradation) => void
}

const options = [
  {
    title: 'MY_POSITION',
    value: DEGRADATION_TYPE_ABSENT.radius,
    key: DEGRADATION_TYPE_ABSENT.key,
  },
  {
    title: '1_KM_RADIUS',
    value: DEGRADATION_TYPE_LOW.radius,
    key: DEGRADATION_TYPE_LOW.key,
  },
  {
    title: '5_KM_RADIUS',
    value: DEGRADATION_TYPE_HIGH.radius,
    key: DEGRADATION_TYPE_HIGH.key,
  },
]

const InlineMapRadiusSelector: FC<Props> = ({radius, setRadius}) => {
  const {t} = useTranslation()
  return (
    <div className='flex rounded-full bg-white space-x-1'>
      {options.map((o) => {
        const isCurrent = radius === o.value
        return (
          <Button
            key={o.key}
            id={`location-radius-selector-${o.key}`}
            onClick={() => {
              setRadius(o.value, o.key)
            }}
            className={`p-2 -m-px s:py-3 rounded-full border border-primary-500 space-x-0.5 ${
              isCurrent ? 'bg-primary-500 text-white' : 'text-primary-500'
            }`}>
            <div className='hidden s:block'>
              <Location size={16} />
            </div>
            <span className='text-body-12 whitespace-nowrap	'>
              {t(o.title, {n: o.value})}
            </span>
          </Button>
        )
      })}
    </div>
  )
}

export default InlineMapRadiusSelector
