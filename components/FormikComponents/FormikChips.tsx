import React, {FC} from 'react'
import {FieldProps} from 'formik'
import {get} from 'lodash'
import Button from '../Buttons/Button'
import {IFormikCheckbox} from '../../types'
import ChipButton from '../Buttons/ChipButton'

const FormikChips: FC<IFormikCheckbox & FieldProps> = ({
  field,
  form,
  label,
}) => {
  const {name, value} = field
  const {setFieldValue, errors} = form
  const error = get(errors, name)

  return (
    <div className='mb-2 mr-3'>
      <ChipButton
        onClick={() => {
          setFieldValue(name, !value)
        }}
        selected={value}>
        {label}
      </ChipButton>
      <span className='text-body-12 text-error'>{error}</span>
    </div>
  )
}

export default FormikChips
