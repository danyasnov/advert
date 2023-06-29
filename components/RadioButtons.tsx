import {FC} from 'react'

interface Option {
  title: string
  value: string
}

interface Props {
  options: Option[]
  value: string
  name: string
  onChange: (val: string) => void
}

const RadioButtons: FC<Props> = ({options, value, onChange, name}) => {
  return (
    <div className='flex flex-col justify-center'>
      {options.map((o, index) => {
        const id = `${name}-${index}`
        return (
          <div className='flex items-center mr-4 mb-6' key={o.value}>
            <input
              id={id}
              type='radio'
              name={name}
              className='hidden'
              checked={value === o.value}
              onChange={() => {
                onChange(o.value)
              }}
            />
            <label
              htmlFor={id}
              className='flex items-center cursor-pointer text-body-14 text-greyscale-900'>
              <div className='w-5 h-5 flex items-center justify-center mr-2 rounded-full border-2 border-primary-500'>
                {value === o.value && (
                  <span className='block rounded-full w-2.5 h-2.5 bg-black' />
                )}
              </div>
              {o.title}
            </label>
          </div>
        )
      })}
    </div>
  )
}

export default RadioButtons
