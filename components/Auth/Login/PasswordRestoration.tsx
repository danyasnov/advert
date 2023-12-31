import React, {FC, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {Field, Form, Formik} from 'formik'
import {string, object} from 'yup'
import {useTranslation} from 'next-i18next'
import {toast} from 'react-toastify'
import {Message} from 'react-iconly'
import {FormikText} from '../../FormikComponents'
import {AuthPages} from './LoginWizard'
import {Controls, PageProps} from '../utils'

import {makeRequest} from '../../../api'

const schema = object().shape({
  email: string().email().required(),
})
const PasswordRestoration: FC<PageProps> = observer(({dispatch, state}) => {
  const {t} = useTranslation()
  const [showHint, setShowHint] = useState(false)

  return (
    <Formik
      initialValues={{
        email: state.incoming,
      }}
      validationSchema={schema}
      // eslint-disable-next-line consistent-return
      onSubmit={async (values) => {
        const result = await makeRequest({
          url: '/api/reset-password',
          data: {
            email: values.email,
          },
          method: 'post',
        })
        if (result.data.status === 200) {
          setShowHint(true)
        } else if (result.data.error) {
          toast.error(t(result.data.error))
        }
      }}>
      {({submitForm, errors, isSubmitting}) => (
        <div className='px-4 pt-4 flex flex-col justify-between h-full'>
          <Form className='pb-8 space-y-2  flex flex-col'>
            <Field
              name='email'
              disableTrack
              component={FormikText}
              placeholder={t('FORM_EMAIL')}
              leftIcon={
                <div className=' text-greyscale-500'>
                  <Message set='bold' size={21} />
                </div>
              }
            />
            {showHint && (
              <span className='text-body-14 text-greyscale-900 self-center pt-4'>
                {t('MESSAGE_WAS_SENT')}
              </span>
            )}
          </Form>
          <Controls
            onBack={() => {
              dispatch({type: 'setPage', page: AuthPages.initialPage})
            }}
            onNext={() => {
              submitForm()
            }}
            nextDisabled={!!errors.email || showHint || isSubmitting}
          />
        </div>
      )}
    </Formik>
  )
})

export default PasswordRestoration
