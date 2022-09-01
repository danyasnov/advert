import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {
  DEGRADATION_TYPE_ABSENT,
  DEGRADATION_TYPE_HIGH,
  DEGRADATION_TYPE_LOW,
  TypeOfDegradation,
} from 'front-api/src/models'
import {Location} from 'react-iconly'
import Button from './Buttons/Button'

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
            className={`p-2 -m-px rounded-full border border-primary-500 space-x-0.5 s:space-x-2 ${
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
