import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import Button from '../Buttons/Button'

interface Props {
  items: {title: string; id: number}[]
  value: number
  onChange: (id: number) => void
}

const Tabs: FC<Props> = ({items, value, onChange}) => {
  const {t} = useTranslation()
  return (
    <div className='flex'>
      {items.map((i) => {
        return (
          <Button
            key={i.id}
            className={`text-body-2 w-1/2 pt-6 pb-2 border-b border-shadow-b outline-none ${
              value === i.id
                ? 'border-b-2 border-brand-a1 pb-7px text-black-b'
                : 'text-black-c'
            }`}
            onClick={() => onChange(i.id)}>
            {t(i.title)}
          </Button>
        )
      })}
    </div>
  )
}
export default Tabs
