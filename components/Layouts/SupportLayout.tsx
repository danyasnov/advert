import React, {FC, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {useFormik, FormikProvider, Field} from 'formik'
import ReCAPTCHA from 'react-google-recaptcha'
import {omit} from 'lodash'
import {toast} from 'react-toastify'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import MetaTags from '../MetaTags'
import {FormikCheckbox, FormikText} from '../FormikComponents'
import PrimaryButton from '../Buttons/PrimaryButton'
import {makeRequest} from '../../api'

const SupportLayout: FC = observer(() => {
  const {t} = useTranslation()
  const {push} = useRouter()

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      message: '',
      privacy: false,
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      if (!token && process.env.NEXT_PUBLIC_RECAPTCHA_KEY) {
        return
      }
      makeRequest({
        url: '/api/contact-support',
        method: 'post',
        data: {message: JSON.stringify(omit(values, ['privacy']), null, 2)},
      }).then((res) => {
        toast.success(t('LANDING_MESSAGE'))
        push('/')
      })
    },
  })

  const [token, setToken] = useState()
  const validate = (value) => {
    if (!value) return t('EMPTY_FIELD')
    return ''
  }

  return (
    <HeaderFooterWrapper>
      <MetaTags title={t('WRITE_SUPPORT')} />

      <div className='py-8 m:flex min-h-1/2'>
        <div className='m:flex m:space-x-12 l:space-x-6 m:mx-auto'>
          <main className='m:w-944px l:w-896px space-y-12 flex justify-center'>
            <FormikProvider value={formik}>
              <form
                onSubmit={formik.handleSubmit}
                className='flex flex-col w-[392px] pb-10'>
                <span className='text-headline-3 font-medium mb-10'>
                  {t('WRITE_SUPPORT')}
                </span>
                <div className='flex mb-2'>
                  <span className='text-body-1'>{t('NAME')}</span>
                  <span className='text-nc-primary ml-1'>*</span>
                </div>
                <Field
                  name='name'
                  component={FormikText}
                  validate={validate}
                  disableTrack
                  placeholder={t('NAME')}
                />
                <div className='flex mb-2 mt-5'>
                  <span className='text-body-1'>{t('PHONE')}</span>
                  <span className='text-nc-primary ml-1'>*</span>
                </div>
                <Field
                  name='phone'
                  type='number'
                  component={FormikText}
                  validate={validate}
                  disableTrack
                  placeholder={t('PHONE')}
                />
                <div className='flex mb-2 mt-5'>
                  <span className='text-body-1'>{t('FORM_EMAIL')}</span>
                  <span className='text-nc-primary ml-1'>*</span>
                </div>
                <Field
                  name='email'
                  type='email'
                  component={FormikText}
                  validate={validate}
                  disableTrack
                  placeholder={t('FORM_EMAIL')}
                />
                <div className='flex mb-2 mt-5'>
                  <span className='text-body-1'>{t('WRITE_A_MESSAGE')}</span>
                  <span className='text-nc-primary ml-1'>*</span>
                </div>
                <Field
                  name='message'
                  isTextarea
                  rows={10}
                  component={FormikText}
                  validate={validate}
                  disableTrack
                  placeholder={t('WRITE_A_MESSAGE')}
                />
                <div className='my-7'>
                  <Field
                    name='privacy'
                    component={FormikCheckbox}
                    validate={validate}
                    label={t('CONSENT_TO_PROCESSING_OF_PERSONAL_DATA')}
                  />
                </div>
                {process.env.NEXT_PUBLIC_RECAPTCHA_KEY && (
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
                    onChange={(val) => {
                      setToken(val)
                    }}
                  />
                )}
                <PrimaryButton
                  disabled={formik.isSubmitting}
                  type='submit'
                  className='mt-10'>
                  {t('SEND')}
                </PrimaryButton>
              </form>
            </FormikProvider>
          </main>
        </div>
      </div>
    </HeaderFooterWrapper>
  )
})

export default SupportLayout
