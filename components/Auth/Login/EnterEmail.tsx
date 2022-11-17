import React, {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {Message, Lock} from 'react-iconly'
import {Field, Form, useFormik, FormikProvider} from 'formik'
import {string, object, boolean} from 'yup'
import {useTranslation} from 'next-i18next'
import {size} from 'lodash'
import {toast} from 'react-toastify'
import {useRouter} from 'next/router'
import {FormikPassword, FormikText} from '../../FormikComponents'
import {AuthPages} from './LoginWizard'
import {Controls, PageProps} from '../utils'
import {makeRequest} from '../../../api'
import {setCookiesObject} from '../../../helpers'
import LinkButton from '../../Buttons/LinkButton'

const EnterEmail: FC<PageProps> = observer(
  ({dispatch, onClose, state, onFinish}) => {
    const {t} = useTranslation()
    const {reload} = useRouter()
    const msgPass = t('PASSWORD_TOO_SHORT')
    const validatePass = (value) => {
      let error = ''
      if (size(value) < 5 || size(value) > 20) {
        error = msgPass
      }
      return error
    }
    const checkEmail = async (email) => {
      const incoming = email.toLocaleLowerCase()
      const result = await makeRequest({
        url: '/api/check-existing',
        data: {
          email: incoming,
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
        dispatch({
          type: 'setIsNew',
          isNew: true,
        })
        dispatch({
          type: 'setPage',
          page: AuthPages.enterPersonalData,
        })

        return
      }
      if (!result?.data.result.verified) {
        dispatch({
          type: 'setPage',
          page: AuthPages.enterCode,
        })
      } else {
        setFieldValue('showPass', true)
      }
    }
    const authEmail = async (email: string, pass: string) => {
      const result = await makeRequest({
        url: '/api/auth-email',
        data: {
          pass,
          email,
        },
        method: 'POST',
      })
      if (result?.data.status !== 200) {
        return toast.error(t(result.data.error))
      }
      const {access, hash, refresh} = result.data.result.newAuth
      const {promo} = result.data.result.oldAuth
      setCookiesObject({
        authNewToken: access,
        hash,
        authNewRefreshToken: refresh,
        promo,
      })
      if (state.isNew) {
        dispatch({type: 'setPage', page: AuthPages.success})
      } else if (onFinish) {
        onFinish()
      } else {
        onClose()
        reload()
      }
    }
    const formik = useFormik({
      enableReinitialize: true,
      validationSchema: object().shape({
        showPass: boolean(),
        email: string()
          .email(t('EMAIL_MUST_BE_A_VALID_EMAIL'))
          .required(t('EMAIL_REQUIRED_FIELD')),
        pass: string().when('showPass', {
          is: true,
          then: string().required('Must enter email address'),
        }),
      }),
      initialValues: {
        showPass: false,
        email: '',
        pass: '',
      },
      validateOnBlur: false,
      validateOnChange: false,
      onSubmit: async (values) => {
        if (values.showPass) {
          authEmail(values.email, values.pass)
        } else {
          checkEmail(values.email)
        }
      },
    })
    const {submitForm, errors, setFieldValue, values} = formik
    return (
      <FormikProvider value={formik}>
        <div className='px-4 flex flex-col justify-between h-full pt-4'>
          <Form className='pb-8 space-y-2'>
            <Field
              name='email'
              disableTrack
              disabled={values.showPass}
              component={FormikText}
              placeholder={t('FORM_EMAIL')}
              leftIcon={
                <div
                  className={`${
                    !values.showPass
                      ? 'text-greyscale-500'
                      : 'text-greyscale-900'
                  }`}>
                  <Message set='bold' size={21} />
                </div>
              }
            />
            {values.showPass && (
              <>
                <Field
                  name='pass'
                  component={FormikPassword}
                  validate={validatePass}
                  placeholder={t('ENTER_PASSWORD')}
                  leftIcon={
                    <div className='text-greyscale-900'>
                      <Lock set='bold' size={22} />
                    </div>
                  }
                />
                <LinkButton
                  onClick={() =>
                    dispatch({
                      type: 'setPage',
                      page: AuthPages.passwordRestoration,
                    })
                  }
                  label={t('FORGOT_PASSWORD')}
                  className='mx-auto'
                />
              </>
            )}
          </Form>
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
      </FormikProvider>
    )
  },
)

export default EnterEmail
