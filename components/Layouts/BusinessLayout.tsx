import React, {FC, useEffect, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import IcUpload from 'icons/landing/Upload.svg'
import IcTranslate from 'icons/landing/Translate.svg'
import IcSales from 'icons/landing/Sales.svg'
import {Field, FormikProvider, useFormik} from 'formik'
import {noop, omit} from 'lodash'
import {parseCookies} from 'nookies'
import ReCAPTCHA from 'react-google-recaptcha'
import {boolean, object, string} from 'yup'
import PrimaryButton from '../Buttons/PrimaryButton'
import {
  FormikCheckbox,
  FormikNumber,
  FormikSelect,
  FormikText,
} from '../FormikComponents'
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
import Footer from '../Footer'

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
    validationSchema: object().shape({
      name: string().required(t('EMPTY_FIELD')),
      business_name: string().required(t('EMPTY_FIELD')),
      phone: string().required(t('EMPTY_FIELD')).min(8),
      privacy: boolean().required(t('EMPTY_FIELD')),
      email: string()
        .email(t('EMAIL_MUST_BE_A_VALID_EMAIL'))
        .required(t('EMAIL_REQUIRED_FIELD')),
    }),
    initialValues: {
      name: '',
      business_name: '',
      email: '',
      phone: '',
      privacy: false,
    },
    onSubmit: (values) => {
      if (!token) return
      setIsSubmitted(true)
      makeRequest({
        method: 'post',
        url: '/api/contact-support',
        data: {
          message: JSON.stringify(
            omit({...values, from: 'Business Landing'}, ['privacy']),
            null,
            2,
          ),
        },
      })
    },
  })

  const startButton = (
    <Button className='rounded-full bg-primary-500 text-body-18 w-[246px] h-[62px] text-white '>
      {t('LANDING_BUSINESS_START_TODAY')}
    </Button>
  )
  const {handleSubmit} = formik

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
        <div className='flex flex-col mb-12 items-center text-center'>
          <span className='text-body-10 font-normal text-greyscale-600 mb-6'>
            {t('LANDING_BUSINESS_NUMBER_ONE')}
          </span>
          <h3
            className='text-h-3 font-semibold mb-4'
            dangerouslySetInnerHTML={{
              __html: t('LENDING_BUSINESS_TO_DO_TOGETHER'),
            }}
          />
          <span className='text-body-14 font-normal text-greyscale-900 mb-4'>
            {t('LANDING_BUSINESS_TO_DO_TOGETHER_DESCRIPTION')}
          </span>
          <div className='relative w-[184px] h-[242px] mb-6'>
            <ImageWrapper
              quality={100}
              type='/img/with-vooxee.png'
              alt='with vooxee'
              layout='fill'
            />
          </div>
          {startButton}
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
        <div className='flex flex-col items-center mb-12'>
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
          <span className='text-body-14 text-greyscale-900 font-normal whitespace-pre-line mb-4'>
            {t('LANDING_BUSINESS_ABOUT_US_DESCRIPTION')}
          </span>
          {startButton}
        </div>
        <div className='flex flex-col items-center'>
          <span className='text-primary-500 text-body-16 mb-2'>
            {t('LANDING_BUSINESS_TO_HELP')}
          </span>
          <span className='text-h-5 font-bold text-greyscale-900 mb-6 text-center'>
            {t('LANDING_BUSINESS_TO_HELP_DESCRIPTION')}
          </span>
          <div className='bg-gradient-to-l from-[#7210FF] to-[#9D59FF] w-full py-8 px-6 flex flex-col rounded-3xl'>
            <span className='text-body-14 text-secondary-500 font-bold mb-2 text-center'>
              {t('LANDING_BUSINESS_IT_IS_FREE')}
            </span>
            <span className='text-body-14 text-secondary-500 font-bold mb-6 text-center'>
              {t('LANDING_BUSINESS_IT_IS_FREE_DESCRIPTION')}
            </span>
            <FormikProvider value={formik}>
              <div className='flex flex-col space-y-4'>
                <Field
                  component={FormikText}
                  name='name'
                  placeholder={t('LANDING_BUSINESS_YOUR_NAME')}
                />
                <Field
                  component={FormikText}
                  name='business_name'
                  placeholder={t('LANDING_BUSINESS_NAME')}
                />
                <Field
                  component={FormikText}
                  name='email'
                  type='email'
                  placeholder={t('LANDING_BUSINESS_ENTER_EMAIL')}
                />
                <Field
                  name='phone'
                  component={FormikNumber}
                  format='+357 ## ######'
                  mask='_'
                  allowEmptyFormatting
                  minLength={8}
                />
                <Field
                  labelClassname='text-body-12 mt-4 text-white'
                  name='privacy'
                  component={FormikCheckbox}
                  label={t('LANDING_BUSINESS_AGREE_PERSONAL_DATA')}
                />
              </div>
              <Button
                onClick={() => handleSubmit()}
                className='rounded-full bg-secondary-500 text-body-18 w-full h-[62px] text-greyscale-900 mt-6'>
                {t('LANDING_BUSINESS_START_TODAY')}
              </Button>
            </FormikProvider>
          </div>
        </div>
        <div className='border-t border-greyscale-200 mt-12 mb-8 -mx-4'>
          <div className='flex flex-col mx-4'>
            <div className='flex flex-col space-y-10 text-greyscale-900 text-body-16 font-semibold text-left my-8'>
              <LinkWrapper
                title={t('TERMS_AND_CONDITIONS')}
                className='flex items-center whitespace-nowrap'
                href='/p/terms-and-conditions'>
                {t('TERMS_AND_CONDITIONS')}
              </LinkWrapper>
              <LinkWrapper
                title={t('PRIVACY_POLICY')}
                className='flex items-center whitespace-nowrap'
                href='/p/privacy-policy'>
                {t('PRIVACY_POLICY')}
              </LinkWrapper>
              <LinkWrapper
                className='flex items-center w-full'
                title={t('SUPPORT')}
                href='/support'>
                {t('SUPPORT')}
              </LinkWrapper>
            </div>
            <div className='text-body-14 font-normal text-greyscale-900 self-start'>
              © {new Date().getFullYear()} VooXee
            </div>
          </div>
        </div>
      </div>
    </>
  )
})

export default BusinessLayout
