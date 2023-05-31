import {FC} from 'react'
import {FieldProps} from 'formik'
import {useTranslation} from 'next-i18next'
import {get} from 'lodash'
import {IFormikRange} from '../../types'
import Range from '../Range'

const FormikRangeInline: FC<FieldProps & IFormikRange> = ({
  field,
  form,
  placeholder,
}) => {
  const {name, value} = field
  const {setFieldValue, errors} = form
  const {t} = useTranslation()
  const error = get(errors, name)
  const isValid = !error
  const mappedValue = Array.isArray(value) ? value : ['', '']
  return (
    <div className='flex flex-col'>
      <span className='font-bold text-body-16 text-greyscale-900 mb-2'>
        {placeholder}
      </span>
      {/* @ts-ignore */}
      <Range value={mappedValue} onChange={(v) => setFieldValue(name, v)} />
    </div>
  )
}

export default FormikRangeInline
