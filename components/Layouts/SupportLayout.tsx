import React, {FC, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {useFormik, FormikProvider, Field} from 'formik'
import ReactModal from 'react-modal'
import IcClear from 'icons/material/Clear.svg'
import ReCAPTCHA from 'react-google-recaptcha'
import {omit} from 'lodash'
import {toast} from 'react-toastify'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import MetaTags from '../MetaTags'
import {FormikCheckbox, FormikText} from '../FormikComponents'
import ImageWrapper from '../ImageWrapper'
import Button from '../Buttons/Button'
import PrimaryButton from '../Buttons/PrimaryButton'
import {makeRequest} from '../../api'

const SupportLayout: FC = observer(() => {
  const {t} = useTranslation()
  const {push} = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      email: '',
      message: '',
      privacy: false,
      token: '',
    },
    validateOnBlur: false,
    validateOnChange: false,
    validate: (values) => {
      if (!values.token && process.env.NEXT_PUBLIC_RECAPTCHA_KEY) {
        return {token: t('EMPTY_FIELD')}
      }
      return {}
    },
    onSubmit: (values) => {
      makeRequest({
        method: 'post',
        url: '/api/contact-support',
        data: {
          message: JSON.stringify(omit(values, ['privacy', 'token']), null, 2),
        },
      })
      setShowSuccess(true)
    },
  })

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
                className='flex flex-col w-[392px] pb-10 px-4'>
                <span className='text-h-2 font-medium mb-10'>
                  {t('WRITE_SUPPORT')}
                </span>
                <div className='flex mb-2'>
                  <span className='text-body-16'>{t('NAME')}</span>
                  <span className='text-primary-500 ml-1'>*</span>
                </div>
                <Field
                  name='name'
                  component={FormikText}
                  validate={validate}
                  disableTrack
                  placeholder={t('NAME')}
                />
                <div className='flex mb-2 mt-5'>
                  <span className='text-body-16'>{t('PHONE')}</span>
                  <span className='text-primary-500 ml-1'>*</span>
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
                  <span className='text-body-16'>{t('FORM_EMAIL')}</span>
                  <span className='text-primary-500 ml-1'>*</span>
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
                  <span className='text-body-16'>{t('WRITE_A_MESSAGE')}</span>
                  <span className='text-primary-500 ml-1'>*</span>
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
                  {process.env.NEXT_PUBLIC_RECAPTCHA_KEY && (
                    <ReCAPTCHA
                      sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
                      onChange={(val) => {
                        formik.setFieldValue('token', val)
                        formik.setFieldError('token', undefined)
                      }}
                    />
                  )}
                  <span className='text-body-12 text-error'>
                    {formik.errors.token}
                  </span>
                </div>

                <Field
                  labelClassname='text-body-12'
                  name='privacy'
                  component={FormikCheckbox}
                  validate={validate}
                  label={t('CONSENT_TO_PROCESSING_OF_PERSONAL_DATA')}
                />

                <PrimaryButton
                  disabled={formik.isSubmitting}
                  type='button'
                  onClick={() => {
                    formik.handleSubmit()
                  }}
                  className='mt-10'>
                  {t('SEND')}
                </PrimaryButton>
              </form>
            </FormikProvider>
          </main>
        </div>
      </div>
      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </HeaderFooterWrapper>
  )
})

const SuccessModal: FC<{isOpen: boolean; onClose: () => void}> = ({
  isOpen,
  onClose,
}) => {
  const {t} = useTranslation()
  const {push} = useRouter()
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
      className='absolute flex rounded-6 w-[328px] s:w-480px bg-white-a inset-x-0 mx-auto top-24 outline-none drop-shadow-2xl'
      overlayClassName='fixed inset-0 max-h-screen overflow-y-auto z-20 bg-modal-background'>
      <div className='flex flex-col w-full p-8'>
        <div className='pb-4 hidden s:flex justify-end'>
          <Button onClick={onClose}>
            <IcClear className='fill-current text-greyscale-400 h-6 w-6' />
          </Button>
        </div>
        <div className='relative flex flex-col items-center'>
          <div className='relative'>
            <ImageWrapper
              type='/img/congrats.svg'
              alt='thank you'
              width={200}
              height={200}
              quality={100}
            />
          </div>
          <span className='text-h-4 text-primary-500 font-bold pb-6'>
            {t('SUCCESSFULLY_SENT')}
          </span>
          <span
            className='text-body-16 text-greyscale-900 font-normal pb-8 whitespace-pre-line text-center'
            dangerouslySetInnerHTML={{
              __html: t('MESSAGE_TO_SUPPORT_HAS_BEEN_SENT'),
            }}
          />
          <PrimaryButton className='w-[212px] mb-8' onClick={() => push('/')}>
            {t('OK')}
          </PrimaryButton>
        </div>
      </div>
    </ReactModal>
  )
}

export default SupportLayout
