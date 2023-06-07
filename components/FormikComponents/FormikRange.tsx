import React, {FC, useEffect, useRef, useState} from 'react'
import {FieldProps} from 'formik'
import {useTranslation} from 'next-i18next'
import {get, isEmpty, toNumber} from 'lodash'
import NumberFormat from 'react-number-format'
import IcArrowDown from 'icons/material/ArrowDown.svg'
import useOnClickOutside from '../../hooks/useOnClickOutside'
import Button from '../Buttons/Button'
import PrimaryButton from '../Buttons/PrimaryButton'
import {IFormikRange} from '../../types'

const FormikRange: FC<FieldProps & IFormikRange> = ({
  field,
  form,
  placeholder,
}) => {
  const {name, value} = field
  const {setFieldValue, errors} = form
  const {t} = useTranslation()
  const error = get(errors, name)
  const isValid = !error
  const commonClass = `px-5 py-[13px] text-greyscale-900 text-body-12 rounded-lg bg-greyscale-50 ${
    isValid ? '' : 'border-error'
  }`
  const ref = useRef()
  const [show, setShow] = useState(false)
  const [newValue, setNewValue] = useState(value ?? [])
  const [popupError, setPopupError] = useState('')
  const mappedValue = Array.isArray(value) ? value : ['', '']
  useOnClickOutside(ref, () => {
    setShow(false)
    setPopupError('')
    setNewValue(value)
  })
  useEffect(() => {
    setNewValue(value)
  }, [value])
  const formatMaxValue = (v) => {
    if (v[0] && (v[1] === 1000000000 || !v[1])) return t('MAX')
    return v[1]
  }
  let displayValue = ''
  if (mappedValue[0] && mappedValue[1]) {
    displayValue = `${mappedValue[0]} - ${mappedValue[1]}`
  } else if (mappedValue[0] || mappedValue[1]) {
    displayValue = `${mappedValue[0] || 0} - ${formatMaxValue(mappedValue)}`
  }

  return (
    <div
      className='relative w-full bg-greyscale-50 rounded-xl py-2.5 h-fit'
      ref={ref}>
      <Button
        onClick={() => setShow(!show)}
        className='w-full pl-5 pr-6 s:pr-7'>
        <div className='flex justify-between w-full text-body-12'>
          {displayValue ? (
            <span className='text-greyscale-900 flex items-center'>
              {displayValue}
            </span>
          ) : (
            <span
              className={`${
                placeholder.length > 12 ? 'text-body-10 line-clamp-2' : ''
              } text-greyscale-500 flex items-center text-left`}>
              {placeholder}
            </span>
          )}

          <IcArrowDown
            className={`fill-current text-greyscale-900 h-5 w-5 shrink-0 -mr-2 ${
              show ? 'rotate-180' : ''
            }`}
          />
        </div>
      </Button>
      {show && (
        <div className='absolute flex flex-col p-5 rounded-2xl shadow-1 w-full top-14 bg-white z-10'>
          <span className='font-semibold text-body-14 text-greyscale-900 mb-1'>
            {t('FROM')}
          </span>
          <NumberFormat
            value={newValue?.[0]}
            onValueChange={({value: min}) => {
              setPopupError('')
              setNewValue([min, newValue?.[1]])
            }}
            thousandSeparator={' '}
            placeholder={t('FROM')}
            className={`${commonClass} mb-4`}
          />
          <span className='font-semibold text-body-14 text-greyscale-900 mb-1'>
            {t('UP_TO')}
          </span>
          <NumberFormat
            value={newValue?.[1]}
            onValueChange={({value: max}) => {
              setPopupError('')
              setNewValue([newValue?.[0], max])
            }}
            thousandSeparator={' '}
            placeholder={t('UP_TO')}
            className={`${commonClass} mb-5`}
          />
          <span className='text-body-12 text-error mb-1'>{popupError}</span>
          <PrimaryButton
            onClick={() => {
              if (
                newValue[1]?.length > 0 &&
                toNumber(newValue[0]) > toNumber(newValue[1])
              ) {
                return setPopupError(t('FILTER_PRICE_ERROR'))
              }
              setShow(false)
              setNewValue([])
              setFieldValue(name, [
                isEmpty(newValue[0]) ? 0 : newValue[0],
                newValue[1],
              ])
            }}>
            {t('APPLY')}
          </PrimaryButton>
        </div>
      )}
    </div>
  )
}

export default FormikRange
