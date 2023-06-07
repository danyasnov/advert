import React from 'react'
import {SelectItem} from '../Selects/Select'
import Button from '../Buttons/Button'

interface Props {
  title: string
  items: SelectItem[]
  onClick: (item: SelectItem) => void
}

const HeaderButtonColumn: React.FC<Props> = ({title, items, onClick}) => {
  return (
    <div className='flex flex-col'>
      <p className='text-body-14 font-medium text-greyscale-900 mb-4'>
        {title}
      </p>
      <div className='grid grid-cols-4'>
        {items.map((i) => (
          <Button key={i.value} onClick={() => onClick(i)}>
            {i.label}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default HeaderButtonColumn
