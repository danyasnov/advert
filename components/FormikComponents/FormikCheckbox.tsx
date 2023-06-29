import React, {FC} from 'react'
import {FieldProps} from 'formik'
import {get} from 'lodash'
import IcCheck from 'icons/material/Check.svg'
import {IFormikCheckbox} from '../../types'

const FormikCheckbox: FC<IFormikCheckbox & FieldProps> = ({
  field,
  form,
  label,
  hideLabel,
  labelClassname,
}) => {
  const {name, value} = field
  const {setFieldValue, errors} = form
  const error = get(errors, name)

  const input = (
    <>
      <input
        type='checkbox'
        name={name}
        checked={value}
        id={name}
        onChange={() => setFieldValue(name, !value)}
        className='opacity-0 absolute h-4.5 w-4.5 cursor-pointer'
      />
      <div
        className={`bg-white border-2 rounded h-4.5 w-4.5 flex
       shrink-0 justify-center items-center mr-2 ${
         error ? 'border-error' : 'border-black-d'
       }`}>
        <IcCheck className='fill-current text-black-c h-4.5 w-4.5 hidden' />
      </div>
    </>
  )
  return (
    <div>
      {hideLabel ? (
        input
      ) : (
        // eslint-disable-next-line jsx-a11y/label-has-associated-control
        <label
          className={`select-none cursor-pointer flex items-center ${labelClassname}`}>
          {input}
          <span
            dangerouslySetInnerHTML={{
              __html: label,
            }}
          />
        </label>
      )}
      <span className='text-body-12 text-error'>{error}</span>
    </div>
  )
}

export default FormikCheckbox
