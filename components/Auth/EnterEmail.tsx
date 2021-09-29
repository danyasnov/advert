import React, {FC, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {Field, Form, Formik} from 'formik'
import {string, object} from 'yup'
import {useTranslation} from 'next-i18next'
import {AuthType, RestResponseCodes} from 'front-api/src/models/index'
import {get, size} from 'lodash'
import {toast} from 'react-toastify'
import {Secure} from 'front-api/src/helpers/userSecure'
import {FormikText} from '../FormikComponents'
import {AuthPages, Controls, PageProps} from './LoginWizard'
import {makeRequest} from '../../api'
import {setCookiesObject} from '../../helpers'
import {useGeneralStore} from '../../providers/RootStoreProvider'
import Storage from '../../stores/Storage'

const schema = object().shape({
  email: string().email().required(),
})
const EnterEmail: FC<PageProps> = observer(({dispatch, onClose, state}) => {
  const {t} = useTranslation()
  const [showPass, setShowPass] = useState(false)
  const {triggerUpdate} = useGeneralStore()
  const msgPass = 'PASSWORD_TOO_SHORT'

  const validatePass = (value) => {
    let error = ''
    if (size(value) < 5 || size(value) > 20) {
      error = msgPass
    }
    return error
  }
  return (
    <Formik
      initialValues={{
        email: '',
        pass: '',
      }}
      validationSchema={schema}
      // eslint-disable-next-line consistent-return
      onSubmit={async (values) => {
        if (showPass) {
          const result = await makeRequest({
            url: '/api/auth-with-password',
            data: {
              password: values.pass,
              incoming: values.email,
            },
            method: 'POST',
          })
          if (result.data?.error) {
            return toast.error(t(result.data?.error))
          }

          const {hash, promo} = get(result, 'data.result', {})
          if (state.authType === AuthType.email) {
            const storage = new Storage({
              password: values.pass,
              email: values.email,
              userHash: hash,
              authType: state.authType,
            })
            const secure = new Secure(storage)
            const token = secure.createUserSecure()
            setCookiesObject({
              hash,
              promo,
              token,
            })
          }
          triggerUpdate()
          onClose()
        } else {
          const incoming = values.email.toLocaleLowerCase()
          const result = await makeRequest({
            url: '/api/check-phone-number',
            data: {
              type: AuthType.email,
              incoming,
            },
            method: 'POST',
          })

          dispatch({type: 'setIncoming', incoming})
          if (result.data.result === RestResponseCodes.userNotFound) {
            dispatch({type: 'setPage', page: AuthPages.enterEmailPersonalData})
          } else {
            setShowPass(true)
          }
        }
      }}>
      {({submitForm, errors}) => (
        <div className='px-4 pt-4 flex flex-col justify-between h-full'>
          <Form className='pb-8 space-y-2'>
            <Field
              name='email'
              component={FormikText}
              placeholder={t('FORM_EMAIL')}
            />
            {showPass && (
              <Field
                name='pass'
                type='password'
                component={FormikText}
                validate={validatePass}
                placeholder={t('PASSWORD')}
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
              nextDisabled={!!errors.email}
            />
          </div>
        </div>
      )}
    </Formik>
  )
})

export default EnterEmail
