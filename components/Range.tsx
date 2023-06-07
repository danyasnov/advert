import React, {FC} from 'react'
import {useTranslation} from 'next-i18next'
import NumberFormat from 'react-number-format'

const Range: FC<{
  value: [number, number]
  onChange: (val) => void
}> = ({value, onChange}) => {
  const {t} = useTranslation()

  return (
    <div className='flex space-x-2'>
      <RangeInput
        value={value?.[0]}
        onChange={(v) => onChange([v, value?.[1]])}
        placeholder={t('FROM')}
      />
      <RangeInput
        value={value?.[1]}
        onChange={(v) => onChange([value?.[0], v])}
        placeholder={t('UP_TO')}
      />
    </div>
  )
}

const RangeInput: FC<{
  placeholder: string
  value: number
  onChange: (val) => void
}> = ({placeholder, value, onChange}) => {
  const {t} = useTranslation()
  return (
    <div className='bg-greyscale-50 rounded-xl px-4 py-2.5 flex flex-col'>
      <span className='font-medium text-body-12 text-greyscale-500'>
        {placeholder}
      </span>
      <NumberFormat
        placeholder={t('SELECT')}
        value={value}
        onValueChange={({value: v}) => {
          onChange(v)
        }}
        thousandSeparator={' '}
        className='text-body-16 text-greyscale-900 bg-greyscale-50 manual-outline outline-none w-full'
      />
    </div>
  )
}

export default Range
