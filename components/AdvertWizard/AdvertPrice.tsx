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
        className={`px-3.5 py-2 border rounded-lg flex flex-col ${
          error ? 'border-error' : 'focus-within:border-nc-primary'
        }`}>
        <NumberFormat
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
          className='w-full text-nc-primary-text text-body-1 outline-none manual-outline'
        />
        {!!safeDealPrice && (
          <span className='text-body-4 text-nc-secondary-text mt-1'>
            {t('SAFE_DEAL_TIP', {price: safeDealPrice})}
          </span>
        )}
      </div>
      <span className='text-body-3 text-error'>{error}</span>
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
