import React, {FC, useEffect, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {Call, Edit, Message, User} from 'react-iconly'
import {useTranslation} from 'next-i18next'
import ReactModal from 'react-modal'
import IcClear from 'icons/material/Clear.svg'
import {useFormik, FormikProvider, Field, Form} from 'formik'
import {array, object, string} from 'yup'
import {isEmpty, isEqual, toArray} from 'lodash'
import {useLockBodyScroll} from 'react-use'
import type {SettingsLanguageModel} from 'front-api'
import {useUserStore} from '../providers/RootStoreProvider'
import Button from './Buttons/Button'
import {makeRequest} from '../api'
import {FormikSelect, FormikText} from './FormikComponents'
import SecondaryButton from './Buttons/SecondaryButton'
import PrimaryButton from './Buttons/PrimaryButton'
import ChangeContactWizard from './Auth/ChangeContact/ChangeContactWizard'

type PageType = 'form' | 'language' | 'phone' | 'email'

const getHeader = (page: PageType, customTitle: string) => {
  if (customTitle && ['phone', 'email'].includes(page)) return customTitle
  switch (page) {
    case 'form':
      return 'EDIT_PROFILE'
    case 'language':
      return 'SPEAK_IN_LANGUAGES'
    default:
      return ''
  }
}
const EditProfilePopup: FC = observer(() => {
  const [show, setShow] = useState(false)
  const {t} = useTranslation()
  return (
    <div>
      <div id='edit-profile' className='bg-white w-full'>
        <Button
          className='hover:text-primary-500 text-greyscale-500 s:text-greyscale-900 m:text-greyscale-500'
          onClick={() => setShow(true)}>
          <div className='flex justify-center items-center space-x-2'>
            <Edit filled size={16} />
            <span className='text-body-14 s:hidden m:block'>
              {t('EDIT_PROFILE_SETTINGS')}
            </span>
          </div>
        </Button>
      </div>

      {show && <EditForm onClose={() => setShow(false)} />}
    </div>
  )
})

const EditForm: FC<{onClose: () => void}> = observer(({onClose}) => {
  const {user, setUserPersonalData, setUserLanguages} = useUserStore()
  const [page, setPage] = useState<PageType>('form')
  const [customTitle, setCustomTitle] = useState()
  const {settings, additionalLanguages, mainLanguage} = user
  const {name, surname, sex} = settings.personal
  const {t} = useTranslation()
  const [languages, setLanguages] = useState<SettingsLanguageModel[]>([])
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
    additional: [],
  })
  useEffect(() => {
    makeRequest({url: '/api/languages'}).then((res) => {
      const langs = res.data.result
      setLanguages(langs)
      const formatted = [
        {isoCode: mainLanguage.isoCode},
        ...toArray(additionalLanguages),
      ].map((v) => {
        const l = langs.find((i) => i.code === v.isoCode)
        return {
          isRemovable: l.code !== mainLanguage.isoCode,
          value: l.code,
          label: l.name,
        }
      })
      setFieldValue('additional', formatted)
    })
  }, [])
  const schema = object().shape({
    name: string()
      .trim()
      .required(t('TOO_SHORT_NAME_OR_SURNAME'))
      .max(100, t('NAME_NOT_CORRECT'))
      .min(2, t('TOO_SHORT_NAME_OR_SURNAME')),
    surname: string().trim().max(100, t('SURNAME_NOT_CORRECT')),
    additional: array().of(object({value: string(), label: string()})),
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
      const formattedLangs = values.additional
        .filter((l) => l.value !== mainLanguage.isoCode)
        .map((l) => l.value)
      const langs = await makeRequest({
        url: '/api/update-languages',
        data: {
          main: mainLanguage.isoCode,
          additional: formattedLangs,
        },
        method: 'POST',
      })
      if (langs.status === 200) {
        setUserLanguages(formattedLangs.map((l) => ({isoCode: l})))
      }
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
  const {handleSubmit, setFieldValue} = formik
  const languageOptions = languages.map((i) => ({
    label: i.name,
    value: i.code,
    disabled: i.code === mainLanguage.isoCode,
  }))
  const form = (
    <div
      className='flex flex-col w-full bg-white z-10 left-0 h-full'
      data-test-id='edit-profile-modal-form'>
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
              }
            />
            <Button
              className='w-full'
              onClick={() => {
                setPage('phone')
              }}>
              <div className='px-6 py-4 bg-greyscale-50 rounded-xl flex w-full'>
                <div>
                  <Call set='bold' size={20} />
                </div>
                <span className='text-body-16 pl-2'>
                  {settings.personal.phoneNum &&
                    `+${settings.personal.phoneNum}`}
                </span>
              </div>
            </Button>
            <Button
              className='w-full'
              onClick={() => {
                setPage('email')
              }}>
              <div className='px-6 py-4 bg-greyscale-50 rounded-xl flex w-full'>
                <div>
                  <Message set='bold' size={20} />
                </div>
                <span className='text-body-16 pl-2'>
                  {settings.personal.email}
                </span>
              </div>
            </Button>
            {!isEmpty(languageOptions) && (
              <Field
                name='additional'
                component={FormikSelect}
                placeholder={t('SPEAK_IN_LANGUAGES')}
                isMulti
                isFilterable
                isClearable={false}
                options={languageOptions}
                limit={8}
              />
            )}
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
  )

  const phone = (
    <ChangeContactWizard
      type={page === 'phone' ? 'phone' : 'email'}
      setTitle={setCustomTitle}
      onFinish={(incoming) => {
        setPage('form')
        setUserPersonalData({
          [page === 'phone' ? 'phoneNum' : 'email']: incoming,
        })
      }}
      onClose={() => {
        setPage('form')
      }}
      skipSuccessScreen
    />
  )

  return (
    <ReactModal
      isOpen
      onRequestClose={onClose}
      shouldCloseOnOverlayClick={false}
      ariaHideApp={false}
      contentLabel='Personal Data'
      className='absolute w-full bg-white-a inset-x-0 mx-auto s:w-[480px] s:top-20 flex outline-none'
      overlayClassName='fixed inset-0 bg-shadow-overlay max-h-screen z-20 overflow-y-auto '>
      <div className='flex flex-col w-full absolute bg-white z-10 s:rounded-3xl overflow-hidden'>
        <div className='px-6 mt-6 pb-4 flex justify-between'>
          <span className='text-h-5 text-greyscale-900 font-bold'>
            {t(getHeader(page, customTitle))}
          </span>
          <Button onClick={onClose}>
            <IcClear className='fill-current text-black-d h-6 w-6' />
          </Button>
        </div>
        {page === 'form' && form}
        {['phone', 'email'].includes(page) && phone}
      </div>
    </ReactModal>
  )
})

export default EditProfilePopup
