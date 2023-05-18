import {FC} from 'react'
import {FieldProps} from 'formik'
import {get} from 'lodash'
import NumberFormat, {NumberFormatProps} from 'react-number-format'
import {IFormikNumber} from '../../types'

const FormikNumber: FC<IFormikNumber & FieldProps> = ({
  field,
  form,
  maxLength,
  placeholder,
  mask,
  format,
  allowEmptyFormatting,
  thousandSeparator = ' ',
  disableTrack,
}) => {
  const {name, value} = field
  const {setFieldValue, errors, setFieldError} = form
  const error = get(errors, name)
  const isValid = !error
  const isAllowed = (p: NumberFormatProps) => {
    if (!maxLength) return true
    if (p.value.toString().length > maxLength) return false
    return true
  }
  return (
    <div data-test-id={name}>
      <NumberFormat
        value={value}
        onValueChange={({value: inputValue}) => {
          setFieldValue(name, inputValue)
          if (error) setFieldError(name, undefined)
        }}
        isAllowed={isAllowed}
        mask={mask}
        allowEmptyFormatting={allowEmptyFormatting}
        format={format}
        thousandSeparator={thousandSeparator}
        placeholder={placeholder}
        className={`rounded-xl bg-greyscale-50 py-4 px-5 w-full text-greyscale-900 text-body-16 ${
          disableTrack ? 'ym-disable-keys' : ''
        } ${isValid ? '' : 'border border-error text-error'}`}
      />
      <span className='text-body-12 text-error'>{error}</span>
    </div>
  )
}

export default FormikNumber
