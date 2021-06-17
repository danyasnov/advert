import {FC} from 'react'
import {FieldProps} from 'formik'
import {useTranslation} from 'next-i18next'
import NumberFormat from 'react-number-format'
import IcCheck from 'icons/material/Check.svg'
import Select, {SelectItem} from '../Selects/Select'
import Button from '../Buttons/Button'

interface IFormikSegmented {
  options: SelectItem[]
}
interface IFormikCheckbox {
  label: string
}

export const FormikSegmented: FC<IFormikSegmented & FieldProps> = ({
  field,
  form,
  options,
}) => {
  const {name, value} = field
  const {setFieldValue} = form
  return (
    <div className='flex divide-x'>
      {options.map((o) => (
        <Button
          key={o.label + o.value}
          onClick={() => setFieldValue(name, o)}
          className={`h-7 text-body-2 text-black-c flex-1 border-t border-b
           border-shadow-b first:rounded-l-2xl last:rounded-r-2xl first:border-l
            last:border-r segmented-option-border-fix ${
              o?.value === value?.value ? 'bg-brand-a2' : ''
            }`}>
          {o.label}
        </Button>
      ))}
    </div>
  )
}

export const FormikRange: FC<FieldProps> = ({field, form}) => {
  const {name, value} = field
  const {setFieldValue, errors} = form
  const {t} = useTranslation()
  const isValid = !errors[name]
  const commonClass = `w-1/2 py-3 px-3.5 ${isValid ? '' : 'border-error'}`
  return (
    <div className='flex text-black-b text-body-2'>
      <NumberFormat
        value={value?.priceMin}
        onValueChange={({value: priceMin}) => {
          setFieldValue(name, {priceMin, priceMax: value?.priceMax})
        }}
        thousandSeparator={' '}
        placeholder={t('PRICE_FROM')}
        className={`border rounded-l-2xl ${commonClass}`}
      />
      <NumberFormat
        value={value?.priceMax}
        onValueChange={({value: priceMax}) => {
          setFieldValue(name, {priceMin: value?.priceMin, priceMax})
        }}
        thousandSeparator={' '}
        placeholder={t('UP_TO')}
        className={`border-t border-b border-r rounded-r-2xl ${commonClass}`}
      />
    </div>
  )
}

export const FormikCheckbox: FC<IFormikCheckbox & FieldProps> = ({
  field,
  form,
  label,
}) => {
  const {name, value} = field
  const {setFieldValue} = form
  return (
    <div className='flex items-center'>
      <input
        type='checkbox'
        name={name}
        checked={value}
        id={name}
        onChange={() => setFieldValue(name, !value)}
        className='opacity-0 absolute h-4.5 w-4.5 cursor-pointer'
      />
      <div
        className='bg-white border-2 rounded border-black-d h-4.5 w-4.5 flex
       flex-shrink-0 justify-center items-center mr-2'>
        <IcCheck className='fill-current text-black-c h-4.5 w-4.5 hidden' />
      </div>
      <label className='select-none text-black-b cursor-pointer' htmlFor={name}>
        {label}
      </label>
    </div>
  )
}
