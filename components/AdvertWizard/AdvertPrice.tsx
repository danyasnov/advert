import {FC, useRef, useState} from 'react'
import {FieldProps} from 'formik'
import NumberFormat from 'react-number-format'
import {CurrencyModel} from 'front-api/src/models'
import {get, size} from 'lodash'
import Button from '../Buttons/Button'
import useOnClickOutside from '../../hooks/useOnClickOutside'

interface Props {
  currencies: CurrencyModel[]
}
const AdvertPrice: FC<FieldProps & Props> = ({field, form, currencies}) => {
  const {setFieldValue, values, errors, setFieldError} = form
  const {currency} = values
  const {name, value} = field

  const error = get(errors, name)
  const [show, setShow] = useState(false)
  const ref = useRef()
  useOnClickOutside(ref, () => {
    setShow(false)
  })
  return (
    <div className=''>
      <div
        ref={ref}
        className={`border flex flex-col relative ${
          error ? 'border-error' : 'border-transparent'
        }`}>
        <NumberFormat
          name={name}
          value={value}
          onValueChange={({value: newValue}) => {
            setFieldValue(name, newValue)
            if (error) setFieldError(name, undefined)
          }}
          isAllowed={({value: priceValue}) => {
            return priceValue.split('.')[0].length < 16
          }}
          allowNegative={false}
          thousandSeparator={' '}
          decimalScale={2}
          placeholder={currency?.code}
          className='w-full text-greyscale-900 text-body-16 outline-none manual-outline bg-greyscale-50 py-4 pl-5 pr-10 rounded-2xl'
        />
        <div className='absolute inset-y-0 right-5 '>
          <Button
            onClick={() => {
              if (size(currencies) > 1) {
                setShow(!show)
              }
            }}
            className='flex items-center h-full text-body-14'>
            {currency?.symbol}
          </Button>
        </div>
        {show && (
          <div className='absolute top-16 flex flex-col z-20 bg-white rounded-2xl shadow-2xl w-full '>
            {currencies.map((i, index) => (
              <Button
                onClick={() => {
                  setFieldValue('currency', i)
                  setShow(false)
                }}
                className={`hover:text-primary-500 text-greyscale-900 mx-5 ${
                  index === currencies.length - 1
                    ? ''
                    : 'border-b border-greyscale-200'
                }`}>
                <div className='my-4 flex justify-start w-full text-body-16'>
                  {i.code} ({i.symbol})
                </div>
              </Button>
            ))}
          </div>
        )}
      </div>
      <span className='text-body-12 text-error'>{error}</span>
    </div>
  )
}

export default AdvertPrice
