import React, {FC, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {parseCookies} from 'nookies'
import {Form, useFormik, FormikProvider, Field} from 'formik'
import {useTranslation} from 'next-i18next'
import {object, string} from 'yup'
import {toast} from 'react-toastify'
import {makeRequest} from '../../../api'
import {useCountriesStore} from '../../../providers/RootStoreProvider'
import {AuthPages} from './LoginWizard'
import {Controls, PageProps} from '../utils'
import {FormikNumber, FormikSelect} from '../../FormikComponents'

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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      phone: '',
      country: countriesOptions.find(
        (c) => c.value === (cookies.userCountryId || '196'),
      ),
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
      console.log(errors)

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
  const {values, errors, submitForm} = formik
  const {country} = values
  const format = country.phoneMask.replaceAll('X', '#').replaceAll('-', ' ')

  const minLength = (format.match(/#/g) || []).length
  const schema = object().shape({
    phone: string().min(minLength, t('ADD_PHONE_NUMBER')),
  })
  return (
    <FormikProvider value={formik}>
      <div className='px-4 pt-4 flex flex-col justify-between h-full'>
        <Form className='space-y-4 pb-8'>
          <div className='flex flex-col relative'>
            <Field
              name='country'
              disableTrack
              component={FormikSelect}
              options={countriesOptions}
            />
            <div className='h-4' />
            <Field
              name='phone'
              disableTrack
              component={FormikNumber}
              format={`+${country.phonePrefix} ${format}`}
              mask='_'
              allowEmptyFormatting
              minLength={country.phoneLength}
            />
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
