import React, {FC, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {parseCookies} from 'nookies'
import {Form, useFormik, FormikProvider} from 'formik'
import {useTranslation} from 'next-i18next'
import {object, string} from 'yup'
import {toast} from 'react-toastify'
import {makeRequest} from '../../../api'
import {useCountriesStore} from '../../../providers/RootStoreProvider'
import {AuthPages} from './LoginWizard'
import {Controls, PageProps} from '../utils'
import PhoneInput from '../../PhoneInput'
import {Country} from '../../../types'

const EnterPhone: FC<PageProps> = observer(({dispatch}) => {
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
  const schema = object().shape({
    phone: string().min(minLength, t('ADD_PHONE_NUMBER')),
  })
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      phone: '',
    },
    validate: (values) => {
      const errors = {}

      try {
        schema.validateSync(values, {
          abortEarly: false,
        })
      } catch (e) {
        e.inner.forEach(({path, message}) => {
          errors[path] = message
        })
      }

      return errors
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      const incoming = `${
        country.phonePrefix
      }${values.phone.toLocaleLowerCase()}`
      const result = await makeRequest({
        url: '/api/check-existing',
        data: {
          phone: incoming,
        },
        method: 'POST',
      })
      if (result?.data.status !== 200) {
        return toast.error(t(result.data.error))
      }
      dispatch({
        type: 'setIncoming',
        incoming,
      })
      if (!result?.data.result.exists) {
        return dispatch({
          type: 'setPage',
          page: AuthPages.enterPersonalData,
        })
      }
      // if (!result?.data.result.verified) {
      return dispatch({
        type: 'setPage',
        page: AuthPages.enterCode,
      })
      // }
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
            <span className='text-body-12 text-nc-error mt-1 absolute top-12'>
              {errors.phone}
            </span>
          </div>
        </Form>
        <Controls
          onBack={() => {
            dispatch({type: 'setPage', page: AuthPages.initialPage})
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
