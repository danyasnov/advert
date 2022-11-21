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
import {
  useCategoriesStore,
  useCountriesStore,
} from '../../providers/RootStoreProvider'
import {makeRequest} from '../../api'
import MetaTags from '../MetaTags'
import LinkWrapper from '../Buttons/LinkWrapper'
import LanguageSelect from '../LanguageSelect'
import {Country} from '../../types'
import SimpleHeader from '../SimpleHeader'
import Logo from '../Logo'
import Auth from '../Auth'
import ImageWrapper from '../ImageWrapper'
import Button from '../Buttons/Button'

const features = [
  {
    title: 'LANDING_BUSINESS_EASY_UPLOAD',
    description: 'LANDING_BUSINESS_EASY_UPLOAD_DESCRIPTION',
    img: '/img/easy-upload.png',
  },
  {
    title: 'LANDING_BUSINESS_SIMPLE_MANAGING',
    description: 'LANDING_BUSINESS_SIMPLE_MANAGING_DESCRIPTION',
    img: '/img/simple-managing.png',
  },
  {
    title: 'LANDING_BUSINESS_AUTOMATIC_TRANSLATION',
    description: 'LANDING_BUSINESS_AUTOMATIC_TRANSLATION_DESCRIPTION',
    img: '/img/automatic-translation.png',
  },
  {
    title: 'LANDING_BUSINESS_SUBSCRIPTION_FEATURE',
    description: 'LANDING_BUSINESS_SUBSCRIPTION_FEATURE_DESCRIPTION',
    img: '/img/subscription-feature.png',
  },
]
const whyUs = [
  {
    title: 'LANDING_BUSINESS_ELECTRONICS',
    img: '/img/electronics.png',
  },
  {
    title: 'LANDING_BUSINESS_PERSONAL_GOODS',
    img: '/img/personal-goods.png',
  },
  {
    title: 'LANDING_BUSINESS_CARS',
    img: '/img/cars.png',
  },
  {
    title: 'LANDING_BUSINESS_SERVICES',
    img: '/img/services.png',
  },
  {
    title: 'LANDING_BUSINESS_REAL_ESTATE',
    img: '/img/real-estate.png',
  },
]
const BusinessLayout: FC = observer(() => {
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

  const [country, setCountry] = useState<Country>()

  const validateRequired = (value) => {
    if (!value) return t('FILL_EMPTY_FIELDS')
    return ''
  }

  return (
    <>
      <MetaTags title={t('LANDING_HEAD_TEXT')} />
      <div className='flex flex-col mx-4 mt-3'>
        <div className='mb-6'>
          <LanguageSelect />
        </div>
        <div className='flex justify-between mb-6'>
          <Logo variant='small' />
          <Auth />
        </div>
        <div className='flex flex-col mb-12 items-center'>
          <span className='text-body-10 font-normal text-greyscale-600 mb-6'>
            {t('LANDING_BUSINESS_NUMBER_ONE')}
          </span>
          <h3
            className='text-h-3 font-semibold mb-4'
            dangerouslySetInnerHTML={{
              __html: t('LENDING_BUSINESS_TO_DO_TOGETHER'),
            }}
          />
          <span className='text-body-10 font-normal text-greyscale-900 mb-6'>
            {t('LANDING_BUSINESS_TO_DO_TOGETHER_DESCRIPTION')}
          </span>
          <Button className='rounded-full bg-primary-500 text-body-18 w-[246px] h-[62px] text-white '>
            {t('LANDING_BUSINESS_START_TODAY')}
          </Button>
        </div>
        <div className='flex flex-col items-center mb-12'>
          <span className='text-primary-500 text-body-16 mb-2'>
            {t('LANDING_BUSINESS_OUR_SERVICES')}
          </span>
          <span className='text-h-5 font-bold text-greyscale-900 mb-6'>
            {t('LANDING_BUSINESS_PROVIDED_FUNCTIONS')}
          </span>
          <div className='flex flex-col drop-shadow-card space-y-4'>
            {features.map((feature) => (
              <div className='flex flex-col px-4 pb-4 pt-2 bg-white items-center  rounded-2xl'>
                <div className='w-[100px] h-[100px] relative mb-4'>
                  <ImageWrapper
                    type={feature.img}
                    layout='fill'
                    quality={100}
                    alt={feature.img}
                  />
                </div>
                <span className='mb-2 text-h-6 font-bold text-greyscale-900'>
                  {t(feature.title)}
                </span>
                <span className='text-body-14 font-normal text-grayscale-900 text-center'>
                  {t(feature.description)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className='flex flex-col items-center mb-9'>
          <span className='text-primary-500 text-body-16 mb-2'>
            {t('LANDING_BUSINESS_WHY_US')}
          </span>
          <span className='text-h-5 font-bold text-greyscale-900 mb-6 text-center'>
            {t('LANDING_BUSINESS_WHY_US_DESCRIPTION')}
          </span>
          <div className='w-[328px] h-[230px] relative mb-6'>
            <ImageWrapper type='/img/why-us.png' alt='why us' layout='fill' />
          </div>
          <div className='flex flex-wrap justify-center'>
            {whyUs.map((reason) => (
              <div className='flex space-x-1 bg-white items-center mr-2 mb-3 shadow-popup rounded-lg px-2 py-1'>
                <div className='w-5 h-5 relative '>
                  <ImageWrapper
                    type={reason.img}
                    alt={reason.img}
                    layout='fill'
                  />
                </div>
                <span className='text-body-12 font-bold'>
                  {t(reason.title)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className='flex flex-col items-center '>
          <span className='text-primary-500 text-body-16 mb-2'>
            {t('LANDING_BUSINESS_WHO_WE_ARE')}
          </span>
          <span className='text-h-5 font-bold text-greyscale-900 mb-6 text-center'>
            {t('LANDING_BUSINESS_ABOUT_US')}
          </span>
          <div className='w-[328px] h-[234px] relative mb-6'>
            <ImageWrapper
              type='/img/who-we-are.png'
              alt='who we are'
              layout='fill'
            />
          </div>
        </div>
      </div>
    </>
  )
})

export default BusinessLayout
