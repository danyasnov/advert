import React, {FC, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {parseCookies} from 'nookies'
import {Field, Form, Formik} from 'formik'
import {AuthType, RestResponseCodes} from 'front-api/src/models'
import ReCAPTCHA from 'react-google-recaptcha'
import {makeRequest} from '../../api'
import {useCountriesStore} from '../../providers/RootStoreProvider'
import Select from '../Selects/Select'
import {FormikNumber} from '../FormikComponents'
import {AuthPages, Controls, Country, PageProps} from './LoginWizard'

const EnterPhone: FC<PageProps> = observer(({dispatch}) => {
  const [token, setToken] = useState()
  const {countries} = useCountriesStore()
  const cookies = parseCookies()
  const [countriesOptions] = useState(
    countries.map((c) => ({
      label: `${c.title} (+${c.phonePrefix})`,
      value: c.id,
      phonePrefix: c.phonePrefix,
      phoneMask: c.phoneMask,
      phoneLength: c.phoneLength,
    })),
  )
  const [country, setCountry] = useState<Country>(
    countriesOptions.find((c) => c.value === (cookies.userCountryId || '196')),
  )
  const format = `+${country.phonePrefix} ${country.phoneMask}`.replaceAll(
    'X',
    '#',
  )
  return (
    <Formik
      initialValues={{
        phone: '',
      }}
      validateOnChange={false}
      onSubmit={async (values) => {
        if (
          !token &&
          process.env.NEXT_PUBLIC_RECAPTCHA_KEY &&
          !cookies.disableCaptcha
        )
          return

        const incoming = `${country.phonePrefix}${values.phone}`
        const result = await makeRequest({
          url: '/api/check-phone-number',
          data: {
            type: AuthType.phone,
            incoming,
          },
          method: 'POST',
        })

        dispatch({type: 'setIncoming', incoming})

        if (result.data.result === RestResponseCodes.userNotFound) {
          dispatch({type: 'setPage', page: AuthPages.enterPersonalData})
        } else {
          dispatch({type: 'setPage', page: AuthPages.enterCode})
        }
      }}>
      {({submitForm}) => (
        <div className='px-4 pt-4 flex flex-col justify-between h-full'>
          <Form className='space-y-4 pb-8'>
            <Select
              options={countriesOptions}
              onChange={(c) => setCountry(c as Country)}
              value={country}
            />
            <Field
              name='phone'
              disableTrack
              component={FormikNumber}
              validate={(value) => {
                let error = ''
                if (value.length < country.phoneLength) {
                  error = 'invalid phone'
                }
                return error
              }}
              format={format}
              mask='_'
              allowEmptyFormatting
              minLength={country.phoneLength}
            />
            {process.env.NEXT_PUBLIC_RECAPTCHA_KEY && (
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
                onChange={(val) => {
                  setToken(val)
                }}
              />
            )}
          </Form>
          <div className='-mx-4'>
            <Controls
              onBack={() => {
                dispatch({type: 'setPage', page: AuthPages.initialPage})
              }}
              onNext={() => {
                submitForm()
              }}
            />
          </div>
        </div>
      )}
    </Formik>
  )
})

export default EnterPhone
