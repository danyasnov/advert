import React, {FC, useState} from 'react'
import {FieldProps} from 'formik'
import {get} from 'lodash'
import IcVisibility from 'icons/material/Visibility.svg'
import IcHidden from 'icons/material/Hidden.svg'
import Button from '../Buttons/Button'

const FormikPassword: FC<
  {
    placeholder: string
    value: number
    leftIcon?: JSX.Element
  } & FieldProps
> = ({field, form, placeholder, leftIcon}) => {
  const {name, value} = field
  const {setFieldValue, errors} = form
  const error = get(errors, name)
  const isValid = !error
  const [type, setType] = useState('password')
  return (
    <div className='flex flex-col'>
      <div className='relative'>
        {!!leftIcon && (
          <div className='absolute top-4.5 left-5'>{leftIcon}</div>
        )}
        <input
          data-test-id={name}
          type={type}
          value={value || ''}
          onChange={(e) => {
            setFieldValue(name, e.target.value)
          }}
          placeholder={placeholder}
          className={`border bg-greyscale-50 rounded-lg py-4 pr-5 pr-10 w-full text-greyscale-900 ym-disable-keys text-body-16 ${
            leftIcon ? 'pl-13' : ''
          }
             ${isValid ? 'border-greyscale-50' : 'border-error'}`}
        />
        <div className='absolute top-4 right-5'>
          {type === 'password' && (
            <Button onClick={() => setType('text')}>
              <IcVisibility className='fill-current text-black-c h-6 w-6' />
            </Button>
          )}
          {type === 'text' && (
            <Button onClick={() => setType('password')}>
              <IcHidden className='fill-current text-black-c h-6 w-6' />
            </Button>
          )}
        </div>
      </div>
      {!!error && <span className='text-body-12 text-error pt-3'>{error}</span>}
    </div>
  )
}

export default FormikPassword
