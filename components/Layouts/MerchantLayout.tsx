import React, {FC, useEffect, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import IcUpload from 'icons/landing/Upload.svg'
import IcTranslate from 'icons/landing/Translate.svg'
import IcSales from 'icons/landing/Sales.svg'
import {Field, FormikProvider, useFormik} from 'formik'
import {noop} from 'lodash'
import {parseCookies} from 'nookies'
import {useRouter} from 'next/router'
import Logo from '../Logo'
import PrimaryButton from '../Buttons/PrimaryButton'
import ImageWrapper from '../ImageWrapper'
import {FormikNumber, FormikSelect, FormikText} from '../FormikComponents'
import Select, {SelectItem} from '../Selects/Select'
import {Country} from '../Auth/LoginWizard'
import {
  useCategoriesStore,
  useCountriesStore,
} from '../../providers/RootStoreProvider'
import {languageOptions, withLangIcons} from '../Header'
import LinkSelect from '../Selects/LinkSelect'
import {setCookiesObject} from '../../helpers'
import {makeRequest} from '../../api'

const MerchantLayout: FC = observer(() => {
  const {t} = useTranslation()
  const {reload} = useRouter()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const formRef = useRef()
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
    setLang(cookies.language)

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
  const languages = useRef(withLangIcons(languageOptions))
  const [lang, setLang] = useState<string>()

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
    <div className='flex flex-col items-center space-y-24'>
      <div className='flex justify-between items-center -mb-24 py-3 max-w-960px w-full'>
        <div className='flex items-center space-x-5'>
          <Logo size={70} />
          <span className='text-h-2 max-w-xs'>{t('LANDING_HEAD_TEXT')}</span>
        </div>
        <div className='h-4 w-32'>
          <LinkSelect
            id='language-select'
            onChange={({value}) => {
              setCookiesObject({language: value as string})
              reload()
            }}
            value={languages.current.find(({value}) => value === lang)}
            options={languages.current as SelectItem[]}
            isSearchable={false}
            placeholder={t('LANGUAGES')}
          />
        </div>
      </div>
      <div className='bg-landing-head-bg flex justify-center pt-20 w-full'>
        <div className='max-w-960px flex w-full justify-between'>
          <div className='flex flex-col w-72 space-y-5 mt-20'>
            <span
              className='text-h-1 font-semibold text-body-3'
              dangerouslySetInnerHTML={{__html: t('LANDING_EARN_WITH')}}
            />
            <span
              className='font-medium text-body-1'
              dangerouslySetInnerHTML={{
                __html: t('LANDING_LAUNCH_IN_ONE_HOUR'),
              }}
            />
            <span className='font-medium text-brand-a1'>
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
          <div style={{width: '550px', height: '700px'}} className='relative'>
            <ImageWrapper
              layout='fill'
              objectFit='contain'
              type='/img/landing/man-with-laptop.png'
              alt='man-with-laptop'
            />
          </div>
        </div>
      </div>
      <div className='max-w-960px flex w-full justify-between'>
        <div style={{width: '450px', height: '700px'}} className='relative'>
          <ImageWrapper
            layout='fill'
            objectFit='contain'
            type='/img/landing/phone.png'
            alt='phone'
          />
        </div>
        <div className='flex flex-col w-80 pt-16'>
          <span
            className='text-h-1 font-semibold mb-16'
            dangerouslySetInnerHTML={{__html: t('LANDING_THOUSANDS_USERS')}}
          />
          <span
            className='text-h-2 mb-24'
            dangerouslySetInnerHTML={{__html: t('LANDING_USER_DEMANDS')}}
          />
          <div className='space-y-3 '>
            <div className='flex space-x-6'>
              <IcUpload className='w-5 h-5' />
              <span className='text-h-2'>
                {t('LANDING_EASY_PRODUCT_UPLOAD')}
              </span>
            </div>
            <div className='flex space-x-6'>
              <IcSales className='w-5 h-5' />
              <span className='text-h-2'>{t('LANDING_MANAGE_SALES')}</span>
            </div>
            <div className='flex space-x-6'>
              <IcTranslate className='w-5 h-5' />
              <span className='text-h-2'>{t('LANDING_AUTO_TRANSLATE')}</span>
            </div>
          </div>
        </div>
      </div>
      <div className='max-w-960px flex w-full justify-between'>
        <div className='flex flex-col w-96'>
          <div className='ml-20 flex flex-col'>
            <span
              className='text-brand-a1 leading-none font-bold pb-10'
              style={{fontSize: '60px'}}>
              {t('LANDING_BE_FIRST')}
            </span>
            <span className='text-h-2'>{t('LANDING_AHEAD_COMPETITORS')}</span>
            <span className='text-h-2 font-semibold my-16'>
              {t('LANDING_TOMORROW_BUSINESS_WILL_GROW')}
            </span>
          </div>
          <div className='text-brand-a1 flex flex-col'>
            <span
              className='font-black ml-20 whitespace-nowrap opacity-50 leading-none'
              style={{fontSize: '60px'}}>
              {t('LANDING_IN')} 5
            </span>
            <span
              className='font-black ml-20 opacity-80 leading-none -mb-5'
              style={{fontSize: '148px'}}>
              10
            </span>
            <div>
              <span className='font-black mr-4' style={{fontSize: '138px'}}>
                x
              </span>
              <span
                className='font-black leading-none'
                style={{fontSize: '250px'}}>
                30
              </span>
              <span className='font-black' style={{fontSize: '72px'}}>
                {t('LANDING_TIMES')}
              </span>
            </div>
          </div>
        </div>
        <div
          style={{width: '500px', height: '650px'}}
          className='relative mt-14'>
          <ImageWrapper
            layout='fill'
            objectFit='contain'
            type='/img/landing/woman.png'
            alt='woman'
          />
        </div>
      </div>
      <div className='bg-landing-footer-bg bg-no-repeat bg-bottom py-24 flex flex-col items-center w-full'>
        <div className='w-96 flex flex-col items-center'>
          <span className='text-h-1 text-brand-a1 font-bold text-center mb-5'>
            {t('LANDING_JOIN_ADVERTO')}
          </span>
          <div className='py-6 px-9 bg-white rounded-3xl w-full drop-shadow-2xl'>
            <span className='text-h-2 font-medium'>
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
                        `+${c.phonePrefix} ${c.phoneMask}`.replaceAll('X', '#'),
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
                className='w-full mt-4'
                type='submit'
                onClick={noop}>
                {t('LANDING_SEND_APPLICATION')}
              </PrimaryButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
})

export default MerchantLayout
