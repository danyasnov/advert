import {FC} from 'react'
import IcClear from 'icons/material/Clear.svg'
import Button from './Buttons/Button'

interface Props {
  value: string
  placeholder: string
  isClearable: boolean
  className?: string
  onChange: (value: string) => void
}
const TextInput: FC<Props> = ({value, onChange, placeholder, className}) => {
  return (
    <div className='relative'>
      <input
        type='text'
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-10 w-full border border-shadow-b rounded-lg pl-3.5 pr-8 py-3 text-body-2 text-black-b ${className}`}
      />
      <Button onClick={() => onChange('')} className='absolute top-2 right-2'>
        <IcClear className='max-h-6 h-6 w-6 fill-current text-black-c' />
      </Button>
    </div>
  )
}

export default TextInput
