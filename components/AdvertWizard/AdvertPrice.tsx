import {FC, useState} from 'react'
import {FieldProps} from 'formik'
import NumberFormat from 'react-number-format'
import {CurrencyModel} from 'front-api/src/models'
import {useTranslation} from 'next-i18next'
import {get, size} from 'lodash'
import RadioButtons from '../RadioButtons'

interface Props {
  currencies: CurrencyModel[]
  allowSecureDeal: boolean
}
const AdvertPrice: FC<FieldProps & Props> = ({
  field,
  form,
  currencies,
  allowSecureDeal,
}) => {
  const {setFieldValue, values, errors, setFieldError} = form
  const {currency} = values
  const [currencyOptions] = useState(
    currencies.map((c) => ({title: c.code, value: c.code})),
  )
  const {t} = useTranslation()

  const {name, value} = field

  let safeDealPrice = 0
  if (value && allowSecureDeal) {
    safeDealPrice = value * 0.9
  }

  const error = get(errors, name)

  return (
    <div>
      <div
        className={`border flex flex-col ${
          error ? 'border-error' : 'border-transparent'
        }`}>
        <NumberFormat
          name={name}
          value={value}
          suffix={` ${currency?.code}`}
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
          className='w-full text-greyscale-900 text-body-16 outline-none manual-outline bg-greyscale-50 py-4 px-5 rounded-2xl'
        />
        {!!safeDealPrice && (
          <span className='text-body-10 text-greyscale-900 mt-1'>
            {t('SAFE_DEAL_TIP', {price: safeDealPrice})}
          </span>
        )}
      </div>
      <span className='text-body-12 text-error'>{error}</span>
      {size(currencies) > 1 && (
        <div className='mt-2'>
          <RadioButtons
            value={currency?.code}
            options={currencyOptions}
            onChange={(v) => {
              const cur = currencies.find((c) => c.code === v)
              setFieldValue('currency', cur)
            }}
            name='currency'
          />
        </div>
      )}
    </div>
  )
}

export default AdvertPrice
