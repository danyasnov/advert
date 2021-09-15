import React, {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {AuthType} from 'front-api/src/models/index'
import {Field, Form, Formik} from 'formik'
import {size} from 'lodash'
import {parseCookies} from 'nookies'
import {AuthPages, Controls, PageProps} from './LoginWizard'
import {makeRequest} from '../../api'
import {FormikText} from '../FormikComponents'
import {SerializedCookiesState} from '../../types'

const EnterPersonalData: FC<PageProps> = ({dispatch, state}) => {
  const {t} = useTranslation()
  const msg = 'TOO_SHORT_NAME_OR_SURNAME'
  const cookies: SerializedCookiesState = parseCookies()
  const userLocation = JSON.parse(cookies.userLocation)
  const validateName = (value) => {
    let error = ''
    if (size(value) < 1) {
      error = msg
    }
    return error
  }
  return (
    <Formik
      initialValues={{
        name: '',
        surname: '',
      }}
      validateOnChange={false}
      onSubmit={async (values) => {
        const result = await makeRequest({
          url: '/api/create-user',
          data: {
            incoming: state.incoming,
            authType: state.authType,
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            ...values,
          },
          method: 'POST',
        })
        if (!result?.data?.result) return
        dispatch({type: 'setPage', page: AuthPages.enterCode})
        dispatch({type: 'setUserId', userId: result?.data?.result})
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
              validate={validateName}
              placeholder={t('SURNAME')}
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
