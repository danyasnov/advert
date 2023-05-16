import React, {FC, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {parseCookies} from 'nookies'
import {Form, useFormik, FormikProvider} from 'formik'
import {useTranslation} from 'next-i18next'
import {object, string} from 'yup'
import {useCountriesStore} from '../../../providers/RootStoreProvider'
import AuthPages from './AuthPages'
import {Controls, PageProps} from '../utils'
import PhoneInput from '../../PhoneInput'
import {Country} from '../../../types'

const EnterPhone: FC<PageProps> = observer(({dispatch, onClose}) => {
  const {t} = useTranslation()

  const {countries} = useCountriesStore()
  const cookies = parseCookies()
  const [countriesOptions] = useState(
    countries.map((c) => ({
      label: `${c.title} (+${c.phonePrefix})`,
      value: c.id,
      phonePrefix: c.phonePrefix,
      phoneMask: c.phoneMask,
      phoneLength: c.phoneLength,
      isoCode: c.isoCode,
    })),
  )
  const [country, setCountry] = useState<Country>(
    countriesOptions.find((c) => c.value === (cookies.userCountryId || '196')),
  )
  const format = country.phoneMask.replaceAll('X', '#').replaceAll('-', ' ')

  const minLength = (format.match(/#/g) || []).length
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      phone: '',
    },
    validationSchema: object().shape({
      phone: string().min(minLength, t('ADD_PHONE_NUMBER')),
    }),
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      const incoming = `${
        country.phonePrefix
      }${values.phone.toLocaleLowerCase()}`

      dispatch({
        type: 'setIncoming',
        incoming,
      })

      return dispatch({
        type: 'setPage',
        page: AuthPages.enterCode,
      })
    },
  })
  const {values, setFieldValue, errors, setFieldError, submitForm} = formik

  return (
    <FormikProvider value={formik}>
      <div className='px-4 pt-4 flex flex-col justify-between h-full'>
        <Form className='space-y-4 pb-8'>
          <div className='flex flex-col relative'>
            <PhoneInput
              country={country}
              format={format}
              countriesOptions={countriesOptions}
              value={values.phone}
              onChange={(v) => {
                setFieldValue('phone', v)
                setFieldError('phone', undefined)
              }}
              onChangeFormat={(c) => {
                setCountry(c)
              }}
            />
            <span className='text-body-12 text-error mt-1 absolute top-12'>
              {errors.phone}
            </span>
          </div>
        </Form>
        <Controls
          onBack={() => {
            onClose()
          }}
          onNext={() => {
            submitForm()
          }}
        />
      </div>
    </FormikProvider>
  )
})

export default EnterPhone
