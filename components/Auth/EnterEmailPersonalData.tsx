import React, {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {AuthType} from 'front-api/src/models/index'
import {Field, Form, Formik} from 'formik'
import {size} from 'lodash'
import {parseCookies} from 'nookies'
import emojiRegex from 'emoji-regex'
import {toast} from 'react-toastify'
import {AuthPages, Controls, PageProps} from './LoginWizard'
import {FormikText} from '../FormikComponents'
import {SerializedCookiesState} from '../../types'
import {makeRequest} from '../../api'

const forbiddenSymbols = [
  "'",
  '!',
  '+',
  '"',
  '/',
  '\\',
  '`',
  '(',
  ')',
  '\\n',
  '\\r',
  '\\t',
]
const EnterPersonalData: FC<PageProps> = ({state, dispatch}) => {
  const {t} = useTranslation()
  const msgName = 'TOO_SHORT_NAME_OR_SURNAME'
  const msgPass = 'PASSWORD_TOO_SHORT'
  const cookies: SerializedCookiesState = parseCookies()
  const userLocation = JSON.parse(cookies.userLocation)
  const validateName = (value) => {
    if (size(value) < 2 || size(value) > 90) {
      return t(msgName)
    }
    return ''
  }
  const validatePass = (value) => {
    const regex = emojiRegex()
    if (regex.test(value)) {
      return t('PASSWORD_MUST_NOT_CONTAIN_EMOJI')
    }
    if (forbiddenSymbols.some((f) => value.includes(f))) {
      return `${t(
        'PASSWORD_MUST_NOT_CONTAIN_PROHIBITED_SYMBOLS',
      )} ${forbiddenSymbols.join(' ')}`
    }
    if (size(value) < 6 || size(value) > 20) {
      return t(msgPass)
    }
    return ''
  }
  return (
    <Formik
      initialValues={{
        name: '',
        surname: '',
        pass: '',
      }}
      onSubmit={async (values) => {
        const result = await makeRequest({
          url: '/api/create-user',
          data: {
            incoming: state.incoming,
            authType: state.authType,
            country: cookies.countryCode,
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            lang: cookies.language,
            ...values,
          },
          method: 'POST',
        })
        if (result?.data?.error) toast.error(t(result?.data?.error))

        if (!result?.data?.result) return
        dispatch({type: 'setUserId', userId: result.data.result})
        dispatch({type: 'setPage', page: AuthPages.enterCode})
        dispatch({type: 'setPassword', password: values.pass})
      }}>
      {({submitForm}) => (
        <div className='px-4 pt-4 flex flex-col justify-between h-full'>
          <Form className='space-y-4 pb-8'>
            <Field
              name='name'
              component={FormikText}
              validate={validateName}
              placeholder={t('NAME')}
            />
            <Field
              name='surname'
              component={FormikText}
              placeholder={t('SURNAME')}
            />

            <Field
              name='pass'
              type='password'
              component={FormikText}
              validate={validatePass}
              placeholder={t('PASSWORD')}
            />
          </Form>
          <div className='-mx-4'>
            <Controls
              onBack={() => {
                dispatch({
                  type: 'setPage',
                  page:
                    state.authType === AuthType.phone
                      ? AuthPages.enterPhone
                      : AuthPages.enterEmail,
                })
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
}

export default EnterPersonalData
