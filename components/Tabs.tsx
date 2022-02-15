import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {isEmpty} from 'lodash'
import Button from './Buttons/Button'

interface Props {
  items: {title: string; id: number}[]
  value: number
  onChange: (id: number) => void
}

const Tabs: FC<Props> = ({items, value, onChange}) => {
  const {t} = useTranslation()
  let widthClass
  switch (items.length) {
    case 1: {
      widthClass = 'w-full'
      break
    }
    case 2: {
      widthClass = 'w-1/2'
      break
    }
    case 3: {
      widthClass = 'w-1/3'
      break
    }
    case 4: {
      widthClass = 'w-1/4'
      break
    }
    default: {
      widthClass = ''
    }
  }
  if (isEmpty(items)) return null
  return (
    <div className='flex'>
      {items.map((i) => {
        return (
          <Button
            key={i.id}
            className={`text-body-2  pb-2 border-b border-shadow-b ${
              value === i.id
                ? 'border-b-2 border-brand-a1 pb-7px text-black-b'
                : 'text-black-c'
            } ${widthClass}`}
            onClick={() => onChange(i.id)}>
            {t(i.title)}
          </Button>
        )
      })}
    </div>
  )
}
export default Tabs
