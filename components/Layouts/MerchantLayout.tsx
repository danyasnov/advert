import React, {FC, useEffect, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import IcUpload from 'icons/landing/Upload.svg'
import IcTranslate from 'icons/landing/Translate.svg'
import IcSales from 'icons/landing/Sales.svg'
import {Field, FormikProvider, useFormik} from 'formik'
import {noop} from 'lodash'
import {parseCookies} from 'nookies'
import ReCAPTCHA from 'react-google-recaptcha'
import PrimaryButton from '../Buttons/PrimaryButton'
import {FormikNumber, FormikSelect, FormikText} from '../FormikComponents'
import Select from '../Selects/Select'
import {Country} from '../Auth/LoginWizard'
import {
  useCategoriesStore,
  useCountriesStore,
} from '../../providers/RootStoreProvider'
import {makeRequest} from '../../api'
import MetaTags from '../MetaTags'
import LinkWrapper from '../Buttons/LinkWrapper'
import LanguageSelect from '../LanguageSelect'

const MerchantLayout: FC = observer(() => {
  const {t} = useTranslation()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const formRef = useRef()
  const [token, setToken] = useState()

  const formik = useFormik({
    validateOnBlur: false,
    validateOnChange: false,
    initialValues: {
      name: '',
      category: '',
      business_name: '',
      email: '',
      phone: '',
    },
    onSubmit: (values) => {
      if (!token) return
      setIsSubmitted(true)
      makeRequest({
        method: 'post',
        url: '/api/landing-submit',
        data: {
          ...values,
          // @ts-ignore
          category: values.category.slug,
          phone: `+${country.phonePrefix}${values.phone}`,
        },
      })
    },
  })
  useEffect(() => {
    const cookies = parseCookies()

    const country = countriesOptions.find(
      (c) => c.value === (cookies.userCountryId || '196'),
    )
    if (country) {
      setCountry(country)
      setFormat(
        `+${country.phonePrefix} ${country.phoneMask}`.replaceAll('X', '#'),
      )
    }
  }, [])

  const {countries} = useCountriesStore()
  const {categoriesWithoutAll} = useCategoriesStore()
  const [countriesOptions] = useState(
    countries.map((c) => ({
      label: `${c.title} (+${c.phonePrefix})`,
      value: c.id,
      phonePrefix: c.phonePrefix,
      phoneMask: c.phoneMask,
      phoneLength: c.phoneLength,
    })),
  )
  const [categoriesOptions] = useState(
    categoriesWithoutAll.map((c) => ({
      ...c,
      label: c.name,
      value: c.id,
    })),
  )
  const [country, setCountry] = useState<Country>()
  const [format, setFormat] = useState('')

  const validateRequired = (value) => {
    if (!value) return t('FILL_EMPTY_FIELDS')
    return ''
  }

  return (
    <>
      <MetaTags title={t('LANDING_HEAD_TEXT')} />
      <div className='flex flex-col items-center l:space-y-24 overflow-x-hidden	'>
        <div className='flex justify-between items-center l:-mb-24 py-3 max-w-960px l:max-w-[1124px] w-full px-6 s:px-16 m:px-24'>
          <div className='flex items-center space-x-5'>
            <LinkWrapper href='/' title='main'>
              <div className='w-6 h-6 s:w-9 s:h-9 m:w-12 m:h-12 l:w-18 l:h-18'>
                <img src='/img/logo/AdvertoLogoSquare.png' alt='Logo' />
              </div>
            </LinkWrapper>
            <span className='text-body-4 s:text-body-3 m:text-h-2 max-w-xs'>
              {t('LANDING_HEAD_TEXT')}
            </span>
          </div>
          <LanguageSelect />
        </div>
        <div className='bg-landing-head bg-center flex justify-center pt-20 w-full'>
          <div className='max-w-960px l:max-w-[1124px] flex w-full justify-between relative s:items-center'>
            <div className='flex flex-col w-50 s:w-[360px] m:w-[500px]  space-y-5  z-10 px-6 s:px-16 m:px-24 pb-30 s:pb-10'>
              <span
                className='text-headline-6 s:text-[45px] s:leading-[56px] m:text-h-1 font-semibold'
                dangerouslySetInnerHTML={{__html: t('LANDING_EARN_WITH')}}
              />
              <span
                className='text-body-3 s:text-h-2 font-semibold mb-5 '
                dangerouslySetInnerHTML={{
                  __html: t('LANDING_LAUNCH_IN_ONE_HOUR'),
                }}
              />
              <span className='text-brand-a1 text-body-3 s:text-h-2 font-semibold l:font-medium pb-5'>
                {t('LANDING_FREE_NO_LIMIT')}
              </span>
              <PrimaryButton
                onClick={() => {
                  // @ts-ignore
                  formRef.current.scrollIntoView({behavior: 'smooth'})
                }}>
                {t('LANDING_START_NOW')}
              </PrimaryButton>
            </div>
            <div className='absolute s:static z-0 w-56 s:w-[360px] m:w-[470px] l:w-596px -right-10'>
              <img
                src='/img/landing/man-with-laptop.png'
                alt='man-with-laptop'
              />
            </div>
          </div>
        </div>
        <div className='max-w-960px l:max-w-[1124px] flex w-full justify-end s:justify-between s:items-center l:justify-between px-6 s:px-16 m:px-24 mt-10 relative'>
          <div className='absolute s:static  z-0 w-72 s:w-[307px] m:w-[400px] l:w-596px -left-28 top-16'>
            <img src='/img/landing/phone.png' alt='phone' />
          </div>
          <div className='flex flex-col w-48 s:w-[320px] l:w-[350px] s:pb-10 l:w-80 l:pt-16 z-10'>
            <span
              className='text-headline-6 m:text-h-1 font-semibold mb-5 l:mb-16'
              dangerouslySetInnerHTML={{__html: t('LANDING_THOUSANDS_USERS')}}
            />
            <span
              className='text-body-3 s:text-h-2 l:text-headline-6 mb-5 l:mb-24'
              dangerouslySetInnerHTML={{__html: t('LANDING_USER_DEMANDS')}}
            />
            <div className='space-y-3 text-body-2 s:text-h-3 l:text-h-2'>
              <div className='flex space-x-6 items-center'>
                <IcUpload className='w-5 h-5' />
                <span>{t('LANDING_EASY_PRODUCT_UPLOAD')}</span>
              </div>
              <div className='flex space-x-6 items-center'>
                <IcSales className='w-5 h-5' />
                <span>{t('LANDING_MANAGE_SALES')}</span>
              </div>
              <div className='flex space-x-6 items-center'>
                <IcTranslate className='w-7 h-7' />
                <span>{t('LANDING_AUTO_TRANSLATE')}</span>
              </div>
            </div>
          </div>
        </div>
        <div className='max-w-960px l:max-w-[1124px] flex w-full justify-between px-6 s:px-16 m:px-24 mt-60 s:mt-20 relative'>
          <div className='flex flex-col w-72 l:w-96 z-10'>
            <div className='w-50 s:w-[350px] flex flex-col'>
              <span className='text-brand-a1 leading-none text-headline-6 s:text-[45px]  l:text-[60px] font-semibold l:font-bold pb-10 '>
                {t('LANDING_BE_FIRST')}
              </span>
              <span className='text-body-2 s:text-h-2'>
                {t('LANDING_AHEAD_COMPETITORS')}
              </span>
              <span className='text-body-2 s:text-h-2 font-semibold my-8 l:my-16'>
                {t('LANDING_TOMORROW_BUSINESS_WILL_GROW')}
              </span>
            </div>
            <div className='text-brand-a1 flex flex-col'>
              <span className='font-black text-[28px] s:text-[50px] l:text-[60px] whitespace-nowrap opacity-50 leading-none'>
                {t('LANDING_IN')} 5
              </span>
              <span className='font-black text-[80px] s:text-[100px] l:text-[148px] opacity-80 leading-none -mb-5'>
                10
              </span>
              <div className='w-[400px]'>
                <span className='font-black mr-4 hidden l:text-[138px]'>x</span>
                <span className='font-black leading-none text-[138px] s:text-[150px] l:text-[250px]'>
                  30
                </span>
                <span className=' lowercase font-black text-[36px] l:text-[72px]'>
                  {t('LANDING_TIMES')}
                </span>
              </div>
            </div>
          </div>
          <div className='absolute s:static z-0 w-72 m:w-[400px] l:w-596px -right-20 top-20'>
            <img src='/img/landing/woman.png' alt='woman' />
          </div>
        </div>
        <div className='bg-landing-footer bg-no-repeat bg-bottom py-24 flex flex-col items-center w-full'>
          <div className='w-96 flex flex-col items-center'>
            <span className='px-6 s:px-16 m:px-24 text-headline-6  m:text-h-1 text-brand-a1 font-bold text-center mb-5'>
              {t('LANDING_JOIN_ADVERTO')}
            </span>
            <div className='py-6 px-6 bg-white rounded-3xl w-full drop-shadow-2xl text-center'>
              <span className='text-h-3 font-medium'>
                {t('LANDING_COMPLETELY_FREE')}
              </span>
              <form ref={formRef} onSubmit={formik.handleSubmit}>
                <FormikProvider value={formik}>
                  <div className='space-y-3 mb-6 mt-3'>
                    <Field
                      name='name'
                      validate={validateRequired}
                      component={FormikText}
                      placeholder={t('NAME')}
                    />
                    <Field
                      name='category'
                      validate={validateRequired}
                      component={FormikSelect}
                      options={categoriesOptions}
                      placeholder={t('LANDING_BUSINESS_CATEGORY')}
                    />
                    <Field
                      name='business_name'
                      validate={validateRequired}
                      component={FormikText}
                      placeholder={t('LANDING_BUSINESS_NAME')}
                    />
                    <Field
                      name='email'
                      type='email'
                      validate={validateRequired}
                      component={FormikText}
                      placeholder={t('EMAIL')}
                    />
                    <Select
                      options={countriesOptions}
                      onChange={(c) => {
                        setCountry(c as Country)
                        setFormat(
                          // @ts-ignore
                          `+${c.phonePrefix} ${c.phoneMask}`.replaceAll(
                            'X',
                            '#',
                          ),
                        )
                      }}
                      value={country}
                    />
                    {!!country && (
                      <Field
                        name='phone'
                        component={FormikNumber}
                        validate={(value) => {
                          let error = ''
                          if (value.length < country.phoneLength) {
                            error = t('FILL_EMPTY_FIELDS')
                          }
                          return error
                        }}
                        format={format}
                        mask='_'
                        allowEmptyFormatting
                        minLength={country.phoneLength}
                      />
                    )}
                  </div>
                </FormikProvider>
                {isSubmitted && <span>{t('LANDING_MESSAGE')}</span>}
                <PrimaryButton
                  disabled={isSubmitted}
                  className='w-full my-4'
                  type='submit'
                  onClick={noop}>
                  {t('LANDING_SEND_APPLICATION')}
                </PrimaryButton>
                {process.env.NEXT_PUBLIC_RECAPTCHA_KEY && (
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
                    onChange={(val) => {
                      setToken(val)
                    }}
                  />
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
})

export default MerchantLayout
