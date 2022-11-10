import React, {FC, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {Edit} from 'react-iconly'
import {useTranslation} from 'next-i18next'
import ReactModal from 'react-modal'
import IcClear from 'icons/material/Clear.svg'
import {useFormik, FormikProvider, Field} from 'formik'
import {object, string} from 'yup'
import {isEqual} from 'lodash'
import {useUserStore} from '../providers/RootStoreProvider'
import Button from './Buttons/Button'
import {makeRequest} from '../api'
import {FormikSelect, FormikText} from './FormikComponents'
import SecondaryButton from './Buttons/SecondaryButton'
import PrimaryButton from './Buttons/PrimaryButton'
import useDisableBodyScroll from '../hooks/useDisableBodyScroll'

const EditProfilePopup: FC = observer(() => {
  const {user, setUserPersonalData} = useUserStore()
  const {settings} = user
  const {name, surname, sex} = settings.personal
  const {t} = useTranslation()
  const [show, setShow] = useState(false)
  useDisableBodyScroll(show)
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
  const onClose = () => {
    setShow(false)
  }
  const schema = object().shape({
    name: string()
      .trim()
      .required(t('TOO_SHORT_NAME_OR_SURNAME'))
      .max(90, t('TOO_SHORT_NAME_OR_SURNAME'))
      .min(2, t('TOO_SHORT_NAME_OR_SURNAME')),
    surname: string().trim().max(90, t('TOO_SHORT_NAME_OR_SURNAME')),
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
  const {handleSubmit} = formik
  return (
    <div>
      <Button
        className='hover:text-primary-500 text-greyscale-500'
        onClick={() => setShow(true)}>
        <div className='flex justify-center items-center space-x-2'>
          <Edit filled size={16} />
          <span className='text-body-14'>{t('EDIT')}</span>
        </div>
      </Button>
      {show && (
        <ReactModal
          isOpen={show}
          onRequestClose={onClose}
          shouldCloseOnOverlayClick={false}
          ariaHideApp={false}
          contentLabel='Personal Data'
          className='absolute w-full  bg-white-a inset-x-0 mx-auto flex outline-none'
          overlayClassName='fixed inset-0  bg-shadow-overlay max-h-screen z-20 overflow-y-auto'>
          <div className='flex flex-col w-full absolute bg-white z-10 left-0'>
            <div className='px-6 mt-6 pb-4 flex justify-between'>
              <span className='text-h-5 text-greyscale-900 font-bold'>
                {t('PERSONAL_INFORMATION')}
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
                  <Field
                    name='name'
                    component={FormikText}
                    placeholder={t('NAME')}
                  />
                  <Field
                    name='surname'
                    component={FormikText}
                    placeholder={t('SURNAME')}
                  />
                  <Field
                    component={FormikSelect}
                    name='gender'
                    options={sexOptionsRef.current}
                    placeholder={t('SEX')}
                  />
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
      )}
    </div>
  )
})
export default EditProfilePopup
