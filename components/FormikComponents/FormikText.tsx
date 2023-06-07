import React, {FC, useState} from 'react'
import {FieldProps} from 'formik'
import {get} from 'lodash'

const FormikText: FC<
  {
    placeholder: string
    value: number
    rows?: number
    maxLength?: number
    type?: string
    disabled: boolean
    isTextarea?: boolean
    disableTrack?: boolean
    submitOnEnter?: boolean
    filterStyle?: boolean
    leftIcon?: JSX.Element
  } & FieldProps
> = ({
  field,
  form,
  rows,
  placeholder,
  type = 'text',
  disabled,
  isTextarea,
  maxLength,
  disableTrack,
  submitOnEnter,
  filterStyle,
  leftIcon,
}) => {
  const {name, value} = field
  const {setFieldValue, errors, setFieldError} = form
  const error = get(errors, name)
  const isValid = !error
  const [active, setActive] = useState(false)
  const props = {
    'data-test-id': name,
    leftIcon,
    disabled,
    rows,
    type,
    value: value || '',
    onChange: (e) => {
      const str = e.target.value
      if (maxLength) {
        if (str.length <= maxLength) setFieldValue(name, str)
      } else {
        setFieldValue(name, str)
      }
      if (error) setFieldError(name, undefined)
    },
    placeholder,
    onBlur: () => setActive(false),
    onFocus: () => setActive(true),
    className: `manual-outline outline-none border bg-greyscale-50 rounded-xl w-full text-greyscale-900 ${
      filterStyle ? 'text-body-12 py-[13px] px-5' : 'text-body-16 py-4 px-5'
    } ${disableTrack ? 'ym-disable-keys' : ''} ${
      isValid ? 'border-greyscale-50' : 'border-error'
    } ${leftIcon ? 'pl-13' : ''}`,
    onKeyDown: (e) => {
      if (e.keyCode === 13 && e.shiftKey === false && submitOnEnter) {
        e.preventDefault()
        form.handleSubmit()
      }
    },
  }

  const Component = isTextarea ? (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <textarea {...props} />
  ) : (
    <div className='relative'>
      {!!leftIcon && (
        <div
          className={`${
            active ? 'text-primary-500' : ''
          } absolute top-4.5 left-5`}>
          {leftIcon}
        </div>
      )}
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <input {...props} />
    </div>
  )
  return (
    <div className='flex flex-col'>
      {Component}
      {!!error && <span className='text-body-12 text-error pt-3'>{error}</span>}
    </div>
  )
}

export default FormikText
