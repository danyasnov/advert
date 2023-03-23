import React, {FC, useEffect, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {Edit, User} from 'react-iconly'
import {useTranslation} from 'next-i18next'
import ReactModal from 'react-modal'
import IcClear from 'icons/material/Clear.svg'
import {useFormik, FormikProvider, Field, Form} from 'formik'
import {object, string} from 'yup'
import {isEqual} from 'lodash'
import {useLockBodyScroll} from 'react-use'
import {useUserStore} from '../providers/RootStoreProvider'
import Button from './Buttons/Button'
import {makeRequest} from '../api'
import {FormikSelect, FormikText} from './FormikComponents'
import SecondaryButton from './Buttons/SecondaryButton'
import PrimaryButton from './Buttons/PrimaryButton'

const EditProfilePopup: FC = observer(() => {
  const [show, setShow] = useState(false)
  const {t} = useTranslation()
  return (
    <div>
      <div id='edit-profile' className='bg-white w-full'>
        <Button
          className='hover:text-primary-500 text-greyscale-500'
          onClick={() => setShow(true)}>
          <div className='flex justify-center items-center space-x-2'>
            <Edit filled size={16} />
            <span className='text-body-14'>{t('EDIT_PROFILE_SETTINGS')}</span>
          </div>
        </Button>
      </div>

      {show && <EditForm onClose={() => setShow(false)} />}
    </div>
  )
})

const EditForm: FC<{onClose: () => void}> = observer(({onClose}) => {
  const {user, setUserPersonalData} = useUserStore()

  const {settings} = user
  const {name, surname, sex} = settings.personal
  const {t} = useTranslation()
  useLockBodyScroll(true)

  const sexOptionsRef = useRef([
    {value: '1', label: t('MALE')},
    {value: '2', label: t('FEMALE')},
    {value: '3', label: t('UNDEFINED')},
  ])
  const personalDataRef = useRef({
    name,
    surname,
    gender: sexOptionsRef.current.find(
      (o) => o.value === (sex as unknown as string),
    ),
  })

  const schema = object().shape({
    name: string()
      .trim()
      .required(t('TOO_SHORT_NAME_OR_SURNAME'))
      .max(100, t('NAME_NOT_CORRECT'))
      .min(2, t('TOO_SHORT_NAME_OR_SURNAME')),
    surname: string().trim().max(100, t('SURNAME_NOT_CORRECT')),
  })
  const formik = useFormik({
    initialValues: personalDataRef.current,
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
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      if (isEqual(personalDataRef.current, values)) return
      personalDataRef.current = values
      const payload = {
        ...values,
        gender: values.gender.value,
      }
      const result = await makeRequest({
        url: '/api/change-personal-data',
        data: payload,
        method: 'POST',
      })
      if (result.data.status === 200) {
        setUserPersonalData({
          name: payload.name,
          surname: payload.surname,
          sex: payload.gender,
        })
        onClose()
      }
    },
  })
  const {handleSubmit, resetForm} = formik
  return (
    <ReactModal
      isOpen
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
      contentLabel='Personal Data'
      className='absolute w-full bg-white-a inset-x-0 mx-auto s:w-[480px] s:top-20 flex outline-none'
      overlayClassName='fixed inset-0 bg-shadow-overlay max-h-screen z-20 overflow-y-auto '>
      <div className='flex flex-col w-full absolute bg-white z-10 s:rounded-3xl s:overflow-hidden '>
        <div className='px-6 mt-6 pb-4 flex justify-between'>
          <span className='text-h-5 text-greyscale-900 font-bold'>
            {t('EDIT_PROFILE')}
          </span>
          <Button onClick={onClose}>
            <IcClear className='fill-current text-black-d h-6 w-6' />
          </Button>
        </div>
        <div
          className='flex flex-col w-full bg-white z-10 left-0 h-full'
          data-test-id='location-modal-form'>
          <div className='h-full flex flex-col px-6 pt-4'>
            <FormikProvider value={formik}>
              <Form className='space-y-4'>
                <Field
                  name='name'
                  component={FormikText}
                  placeholder={t('NAME')}
                  leftIcon={
                    <div
                      className={`${
                        /* eslint-disable-next-line no-extra-boolean-cast */
                        !!formik.errors.name ? 'text-error' : ''
                      }`}>
                      <User set='bold' size={21} />
                    </div>
                  }
                />
                <Field
                  name='surname'
                  component={FormikText}
                  placeholder={t('SURNAME')}
                  leftIcon={
                    <div
                      className={`${
                        /* eslint-disable-next-line no-extra-boolean-cast */
                        !!formik.errors.surname ? 'text-error' : ''
                      }`}>
                      <User set='bold' size={21} />
                    </div>
                  }/>
                  <Field
                    component={FormikSelect}
                    name='gender'
                    options={sexOptionsRef.current}
                    placeholder={t('SEX')}
                  />
            </Form>
            </FormikProvider>
            <div className='flex w-full mt-8 mb-6'>
              <SecondaryButton
                id='location-modal-map-clean'
                className='w-full'
                onClick={onClose}>
                {t('CANCEL')}
              </SecondaryButton>
              <PrimaryButton
                className='ml-2 w-full'
                id='location-modal-map-apply'
                onClick={() => {
                  handleSubmit()
                }}>
                {t('APPLY')}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </ReactModal>
  )
})

export default EditProfilePopup
