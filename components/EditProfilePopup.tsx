import React, {FC, useEffect, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {CloseSquare, Edit, Search, User} from 'react-iconly'
import {useTranslation} from 'next-i18next'
import ReactModal from 'react-modal'
import IcClear from 'icons/material/Clear.svg'
import {useFormik, FormikProvider, Field, Form} from 'formik'
import {array, object, string} from 'yup'
import {isEqual} from 'lodash'
import {useLockBodyScroll} from 'react-use'
import {toJS} from 'mobx'
import IcArrowDown from 'icons/material/ArrowDown.svg'
import IcClose from 'icons/material/Close.svg'
import type {LanguageModel, SettingsLanguageModel} from 'front-api'
import {useUserStore} from '../providers/RootStoreProvider'
import Button from './Buttons/Button'
import {makeRequest} from '../api'
import {FormikSelect, FormikText} from './FormikComponents'
import SecondaryButton from './Buttons/SecondaryButton'
import PrimaryButton from './Buttons/PrimaryButton'
import {SelectItem} from './Selects/Select'
import {List} from './Selects/MobileSelect'

type PageType = 'form' | 'language'

const getHeader = (page: PageType) => {
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
  const {user, setUserPersonalData, setUserLanguages} = useUserStore()
  const [page, setPage] = useState<PageType>('form')

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
    additional: user.additionalLanguages || [],
  })
  useEffect(() => {
    makeRequest({url: '/api/languages'}).then((res) => {
      setLanguages(res.data.result)
    })
  }, [])
  const schema = object().shape({
    name: string()
      .trim()
      .required(t('TOO_SHORT_NAME_OR_SURNAME'))
      .max(100, t('NAME_NOT_CORRECT'))
      .min(2, t('TOO_SHORT_NAME_OR_SURNAME')),
    surname: string().trim().max(100, t('SURNAME_NOT_CORRECT')),
    additional: array().of(object({isoCode: string()})),
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
      const langs = await makeRequest({
        url: '/api/update-languages',
        data: {
          main: user.mainLanguage.isoCode,
          additional: values.additional.map((l) => l.isoCode),
        },
        method: 'POST',
      })
      if (langs.status === 200) {
        setUserLanguages(values.additional)
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
  const {handleSubmit, setFieldValue, values} = formik

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
            <Field
              component={FormikSelect}
              name='gender'
              options={sexOptionsRef.current}
              placeholder={t('SEX')}
            />
            <Button
              className='w-full'
              onClick={() => {
                setPage('language')
              }}>
              <div className='px-5 py-4 bg-greyscale-50 rounded-xl flex justify-between w-full'>
                <span className='text-body-16'>{t('SPEAK_IN_LANGUAGES')}</span>
                <IcArrowDown className='fill-current text-greyscale-900 shrink-0 h-5 w-5' />
              </div>
            </Button>
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

  const language = (
    <div className='flex flex-col w-full bg-white z-10 left-0 h-full'>
      <div className='h-full flex flex-col px-6 pt-4'>
        <LanguageSelect
          items={languages}
          value={values.additional}
          mainLanguage={mainLanguage}
          onSelect={(value) => {
            if (value !== null) {
              setFieldValue(
                'additional',
                value.map((v) => ({isoCode: v.value})),
              )
            }
            setPage('form')
          }}
        />
      </div>
    </div>
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
      <div className='flex flex-col w-full absolute bg-white z-10 s:rounded-3xl s:overflow-hidden '>
        <div className='px-6 mt-6 pb-4 flex justify-between'>
          <span className='text-h-5 text-greyscale-900 font-bold'>
            {t(getHeader(page))}
          </span>
          <Button onClick={onClose}>
            <IcClear className='fill-current text-black-d h-6 w-6' />
          </Button>
        </div>
        {page === 'form' && form}
        {page === 'language' && language}
      </div>
    </ReactModal>
  )
})

const LanguageSelect: FC<{
  items: SettingsLanguageModel[]
  mainLanguage: LanguageModel
  value: LanguageModel[]
  onSelect: (value: SelectItem[] | null) => void
}> = ({items, value, onSelect, mainLanguage}) => {
  const {t} = useTranslation()
  const [search, setSearch] = useState('')
  const [focused, setFocused] = useState(false)

  const formattedItems = useRef(
    items.map((i) => ({
      label: i.name,
      value: i.code,
      disabled: i.code === mainLanguage.isoCode,
    })),
  )
  const [filtered, setFiltered] = useState(formattedItems.current)
  const [selected, setSelected] = useState(
    value.map((v) => formattedItems.current.find((i) => i.value === v.isoCode)),
  )
  useEffect(() => {
    setFiltered(
      formattedItems.current.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase()),
      ),
    )
  }, [search])
  return (
    <div className='flex flex-col'>
      <div className='relative mb-4'>
        <div
          className={`absolute inset-y-0 flex items-center left-4 ${
            focused ? 'text-primary-500' : 'text-greyscale-400'
          }`}>
          <Search size={20} />
        </div>
        <input
          placeholder={t('SEARCH')}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='w-full text-body-16 py-2.5 px-13 rounded-xl bg-greyscale-100'
        />
        {search && (
          <Button
            className='text-greyscale-900 absolute inset-y-0 right-4'
            onClick={() => {
              setSearch('')
            }}>
            <IcClose className='fill-current h-2 w-2' />
          </Button>
        )}
      </div>
      <List
        items={filtered}
        value={selected}
        isMulti
        onChange={(v) => setSelected(v)}
      />
      <div className='flex w-full mt-4 mb-6'>
        <SecondaryButton className='w-full' onClick={() => onSelect(null)}>
          {t('CANCEL')}
        </SecondaryButton>
        <PrimaryButton
          className='ml-2 w-full'
          onClick={() => {
            onSelect(selected)
          }}>
          {t('APPLY')}
        </PrimaryButton>
      </div>
    </div>
  )
}

export default EditProfilePopup
