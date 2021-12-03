import {FC} from 'react'
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
import Button from './Buttons/Button'

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
  return (
    <div className='flex rounded-xl p-1 bg-white space-x-0.5'>
      {options.map((o) => {
        const isCurrent = radius === o.value
        const Icon = isCurrent ? o.iconActive : o.icon
        return (
          <Button
            key={o.key}
            onClick={() => setRadius(o.value, o.key)}
            className={`flex px-4 py-3 justify-center items-center hover:bg-nc-accent rounded-lg h-10 ${
              isCurrent ? 'bg-nc-accent' : ''
            }`}>
            <Icon className='h-5 w-5 mr-1' />
            <span className='text-body-1 font-normal'>
              {t(o.title, {n: o.value})}
            </span>
          </Button>
        )
      })}
    </div>
  )
}

export default MapRadiusSelector
