import React, {FC} from 'react'
import {FieldProps} from 'formik'
import Button from '../Buttons/Button'
import {IFormikSegmented} from '../../types'

const FormikSegmented: FC<IFormikSegmented & FieldProps> = ({
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
          className={`h-7 px-3 py-1 border-t border-b
            first:rounded-l-lg last:rounded-r-lg first:border-l
            last:border-r segmented-option-border-fix ${
              o?.value === value?.value
                ? 'bg-[#F4ECFF] text-primary-500'
                : 'text-greyscale-900 border-greyscale-200'
            }`}>
          <span className='text-body-12 whitespace-nowrap'>{o.label}</span>
        </Button>
      ))}
    </div>
  )
}

export default FormikSegmented
