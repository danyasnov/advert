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
import Button from './Buttons/Button'

interface Props {
  radius: number
  setRadius: (value: number) => void
}

const options = [
  {
    title: 'MY_POSITION',
    value: 0,
    icon: IcLocation,
    iconActive: IcLocationActive,
    iconHover: IcLocationHover,
  },
  {
    title: 'RADIUS_N_KM',
    value: 1,
    icon: IcLocationSmall,
    iconActive: IcLocationSmallActive,
    iconHover: IcLocationSmallHover,
  },
  {
    title: 'RADIUS_N_KM',
    value: 5,
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
            key={o.value}
            onClick={() => setRadius(o.value)}
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
