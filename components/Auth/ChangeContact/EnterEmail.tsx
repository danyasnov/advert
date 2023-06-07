import React, {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {Message} from 'react-iconly'
import {Field, Form, useFormik, FormikProvider} from 'formik'
import {string, object} from 'yup'
import {useTranslation} from 'next-i18next'
import {toast} from 'react-toastify'
import {FormikText} from '../../FormikComponents'
import AuthPages from './AuthPages'
import {Controls, PageProps} from '../utils'
import {makeRequest} from '../../../api'

const EnterEmail: FC<PageProps> = observer(({dispatch, onClose}) => {
  const {t} = useTranslation()

  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: object().shape({
      email: string()
        .email(t('EMAIL_MUST_BE_A_VALID_EMAIL'))
        .required(t('EMAIL_REQUIRED_FIELD')),
    }),
    initialValues: {
      email: '',
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      const incoming = values.email.toLocaleLowerCase()
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

      if (!result?.data.result.exists) {
        dispatch({
          type: 'setIncoming',
          incoming,
        })
        dispatch({
          type: 'setPage',
          page: AuthPages.enterCode,
        })
      } else {
        setFieldError('email', t('EMAIL_ALREADY_EXIST'))
      }
    },
  })
  const {submitForm, errors, setFieldError} = formik
  return (
    <FormikProvider value={formik}>
      <div className='px-4 flex flex-col justify-between h-full pt-4'>
        <Form className='pb-8 space-y-2'>
          <Field
            name='email'
            component={FormikText}
            placeholder={t('FORM_EMAIL')}
            leftIcon={
              <div
                className={`${
                  formik.errors.email ? 'text-error' : 'text-greyscale-900'
                } 
                  `}>
                <Message set='bold' size={21} />
              </div>
            }
          />
        </Form>
        <Controls
          onBack={onClose}
          onNext={() => {
            submitForm()
          }}
          nextDisabled={!!errors.email}
        />
      </div>
    </FormikProvider>
  )
})

export default EnterEmail
