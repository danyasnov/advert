import {GetServerSideProps} from 'next'
import ReactModal from 'react-modal'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import IcClear from 'icons/material/Clear.svg'
import {Field, Form, FormikProvider, useFormik} from 'formik'
import {Lock} from 'react-iconly'
import React, {useState} from 'react'
import {toast} from 'react-toastify'
import {object, ref, string} from 'yup'
import {serverSideTranslations} from 'next-i18next/serverSideTranslations'
import {makeRequest} from '../../api'
import {Controls} from '../../components/Auth/utils'
import {FormikPassword} from '../../components/FormikComponents'
import Button from '../../components/Buttons/Button'
import {getQueryValue, processCookies} from '../../helpers'
import ImageWrapper from '../../components/ImageWrapper'
import PrimaryButton from '../../components/Buttons/PrimaryButton'
import MetaTags from '../../components/MetaTags'

export default function Home() {
  const {t} = useTranslation()
  const {push, query} = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)
  const token = getQueryValue(query, 'token')
  const schema = object().shape({
    pass: string()
      .min(6, t('PASSWORD_TOO_SHORT'))
      .max(20, t('PASSWORD_TOO_SHORT'))
      .required(t('PASSWORD_TOO_SHORT')),
    confirmPass: string().oneOf([ref('pass'), null], t('INVALID_CONFIRM')),
  })
  const formik = useFormik({
    validate: (values) => {
      const errors = {}
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
      pass: '',
      confirmPass: '',
    },
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      const response = await makeRequest({
        url: '/api/reset-password-confirm',
        method: 'post',
        data: {
          password: values.pass,
          token,
        },
      })
      if (response?.data.status !== 200) {
        return toast.error(t(response.data.error))
      }
      setShowSuccess(true)
    },
  })

  const {submitForm} = formik

  const body = showSuccess ? (
    <div className='flex flex-col items-center pb-6'>
      <div className='w-[150px]'>
        <ImageWrapper
          type='/img/reset-password-success.png'
          alt='success'
          quality={100}
          width={150}
          height={150}
        />
      </div>
      <p className='text-primary-500 text-h-4 font-bold mb-6'>
        {t('CONGRATULATIONS')}
      </p>
      <span className='text-primary-500 text-body-16 mb-10'>
        {t('SUCCESSFUL_RESET_PASSWORD')}
      </span>
      <PrimaryButton
        onClick={() => {
          push('/')
        }}>
        {t('CONTINUE')}
      </PrimaryButton>
    </div>
  ) : (
    <Form className='space-y-4'>
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
        placeholder={t('CONFIRM_PASSWORD')}
        leftIcon={
          <div
            className={`${
              /* eslint-disable-next-line no-extra-boolean-cast */
              !!formik.errors.confirmPass ? 'text-error' : 'text-greyscale-500'
            }`}>
            <Lock set='bold' size={22} />
          </div>
        }
      />
      <div className='h-5' />
      <Controls
        nextLabel={t('SAVE')}
        onBack={() => {
          push('/')
        }}
        onNext={() => {
          submitForm()
        }}
      />
    </Form>
  )

  return (
    <>
      <MetaTags title={t('ENTER_PASSWORD')} />
      <ReactModal
        isOpen
        shouldCloseOnOverlayClick={false}
        ariaHideApp={false}
        className='absolute rounded-6 w-11/12 s:w-480px bg-white-a inset-x-0 mx-auto top-1/3 s:top-[162px] flex outline-none drop-shadow-2xl'
        overlayClassName='fixed inset-0 max-h-screen overflow-y-auto z-20 bg-modal-background'>
        <div className='flex flex-col w-full'>
          <div className='px-6 pt-6 pb-4 flex justify-between'>
            <span className='text-h-5 text-grayscale-900 font-bold'>
              {showSuccess ? null : t('ENTER_NEW_PASSWORD')}
            </span>
            <Button
              onClick={() => {
                push('/')
              }}>
              <IcClear className='fill-current text-greyscale-400 h-6 w-6' />
            </Button>
          </div>
          <FormikProvider value={formik}>
            <div className='px-4 pt-4 flex flex-col justify-between h-full'>
              {body}
            </div>
          </FormikProvider>
        </div>
      </ReactModal>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const state = await processCookies(ctx)

  return {
    props: {
      ...(await serverSideTranslations(state.language)),
    },
  }
}
