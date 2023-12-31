import React, {FC, useState} from 'react'
import {useTranslation} from 'next-i18next'
import {User, Lock} from 'react-iconly'
import {AuthType} from 'front-api/src/models'
import {Field, Form, useFormik, FormikProvider} from 'formik'
import {toast} from 'react-toastify'
import {object, string, ref, bool} from 'yup'
import {trim} from 'lodash'
import ReCAPTCHA from 'react-google-recaptcha'
import {AuthPages} from './LoginWizard'
import {Controls, PageProps} from '../utils'
import {
  FormikCheckbox,
  FormikPassword,
  FormikText,
} from '../../FormikComponents'
import {makeRequest} from '../../../api'

const EnterPersonalData: FC<PageProps> = ({state, dispatch}) => {
  const {t} = useTranslation()
  const [token, setToken] = useState('')
  const baseSchema = object().shape({
    name: string()
      .trim()
      .required(t('TOO_SHORT_NAME_OR_SURNAME'))
      .max(90, t('TOO_SHORT_NAME_OR_SURNAME'))
      .min(2, t('TOO_SHORT_NAME_OR_SURNAME')),
    surname: string().trim().max(90, t('TOO_SHORT_NAME_OR_SURNAME')),
    terms: bool().oneOf([true], t('FIELD_MUST_BE_CHECKED')),
  })

  const emailSchema = baseSchema.concat(
    object().shape({
      pass: string()
        .min(6, t('PASSWORD_TOO_SHORT'))
        .max(20, t('PASSWORD_TOO_SHORT'))
        .required(t('PASSWORD_TOO_SHORT')),
      confirmPass: string().oneOf([ref('pass'), null], t('INVALID_CONFIRM')),
    }),
  )

  const formik = useFormik({
    enableReinitialize: true,
    validate: (values) => {
      const errors = {}
      const schema = state.authType === 1 ? baseSchema : emailSchema

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
    initialValues: {
      name: '',
      surname: '',
      pass: '',
      confirmPass: '',
      terms: false,
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      if (process.env.NEXT_PUBLIC_RECAPTCHA_KEY && !token) {
        return
      }
      const registerResponse = await makeRequest({
        url: '/api/register',
        method: 'post',
        data: {
          credentials: {
            type: state.authType,
            ...(state.authType === 2
              ? {password: values.pass, email: state.incoming}
              : {}),
            ...(state.authType === 1 ? {phone: state.incoming} : {}),
          },
          params: {
            name: trim(values.name),
            surname: trim(values.surname),
          },
        },
      })

      if (registerResponse?.data.status !== 200) {
        return toast.error(t(registerResponse.data.error))
      }

      dispatch({type: 'setPage', page: AuthPages.enterCode})
    },
  })
  const {submitForm} = formik
  return (
    <FormikProvider value={formik}>
      <div className='px-4 pt-4 flex flex-col justify-between h-full'>
        <Form className='pb-8 space-y-4'>
          <Field
            name='name'
            disableTrack
            component={FormikText}
            placeholder={t('NAME')}
            leftIcon={
              <div
                className={`${
                  /* eslint-disable-next-line no-extra-boolean-cast */
                  !!formik.errors.name ? 'text-error' : 'text-greyscale-500'
                }`}>
                <User set='bold' size={21} />
              </div>
            }
          />
          <Field
            name='surname'
            disableTrack
            component={FormikText}
            placeholder={t('SURNAME')}
            leftIcon={
              <div
                className={`${
                  /* eslint-disable-next-line no-extra-boolean-cast */
                  !!formik.errors.surname ? 'text-error' : 'text-greyscale-500'
                }`}>
                <User set='bold' size={21} />
              </div>
            }
          />
          {state.authType === 2 && (
            <>
              <Field
                name='pass'
                component={FormikPassword}
                placeholder={t('ENTER_PASSWORD')}
                leftIcon={
                  <div
                    className={`${
                      /* eslint-disable-next-line no-extra-boolean-cast */
                      !!formik.errors.pass ? 'text-error' : 'text-greyscale-500'
                    }`}>
                    <Lock set='bold' size={22} />
                  </div>
                }
              />
              <Field
                name='confirmPass'
                component={FormikPassword}
                placeholder={t('ENTER_PASSWORD')}
                leftIcon={
                  <div
                    className={`${
                      /* eslint-disable-next-line no-extra-boolean-cast */
                      !!formik.errors.confirmPass
                        ? 'text-error'
                        : 'text-greyscale-500'
                    }`}>
                    <Lock set='bold' size={22} />
                  </div>
                }
              />
            </>
          )}
          {process.env.NEXT_PUBLIC_RECAPTCHA_KEY && (
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
              onChange={(val) => {
                setToken(val)
              }}
            />
          )}
          <Field
            name='terms'
            disableTrack
            component={FormikCheckbox}
            label={t('SIGNUP_AGREEMENT')}
            labelClassname='text-body-14 text-greyscale-600'
          />
        </Form>
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
    </FormikProvider>
  )
}

export default EnterPersonalData
