import React, {FC, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {Field, FormikProvider, useFormik} from 'formik'
import {omit} from 'lodash'
import {boolean, object, string} from 'yup'
import ReactModal from 'react-modal'
import IcClear from 'icons/material/Clear.svg'
import {useRouter} from 'next/router'
import {FormikCheckbox, FormikNumber, FormikText} from '../FormikComponents'
import {makeRequest} from '../../api'
import MetaTags from '../MetaTags'
import LinkWrapper from '../Buttons/LinkWrapper'
import LanguageSelect from '../LanguageSelect'
import Logo from '../Logo'
import Auth from '../Auth'
import ImageWrapper from '../ImageWrapper'
import Button from '../Buttons/Button'
import PrimaryButton from '../Buttons/PrimaryButton'

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
  const formRef = useRef<HTMLDivElement>()

  const formik = useFormik({
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: object().shape({
      name: string().required(t('EMPTY_FIELD')),
      business_name: string().required(t('EMPTY_FIELD')),
      phone: string().required(t('EMPTY_FIELD')).min(8),
      privacy: boolean()
        .required(t('EMPTY_FIELD'))
        .oneOf([true], t('EMPTY_FIELD')),
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
    <Button
      className='rounded-full bg-primary-500 text-body-18 w-[246px] h-[62px] text-white'
      onClick={() => {
        formRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }}>
      {t('LANDING_BUSINESS_START_TODAY')}
    </Button>
  )
  const {handleSubmit} = formik

  return (
    <>
      <MetaTags title={t('LENDING_BUSINESS_TITLE')} />
      <div className='flex flex-col mx-4 s:mx-auto mt-3 s:w-704px m:w-944px l:w-1208px '>
        <div className='mb-6'>
          <LanguageSelect />
        </div>
        <div className='flex justify-between mb-6'>
          <Logo variant='both' />
          <Auth />
        </div>
        <div className='flex flex-col s:flex-row mb-12 s:mb-25 m:mb-[150px] items-center s:justify-between'>
          <div className='flex flex-col s:w-[380px] m:w-[430px] l:w-[616px] text-center s:text-left'>
            <span className='text-body-10 s:text-body-14 m:text-body-16 l:text-body-18 font-normal text-greyscale-600 mb-6'>
              {t('LANDING_BUSINESS_NUMBER_ONE')}
            </span>
            <h3
              className='text-h-3 s:text-h-2 m:text-h-1 l:text-[85px] l:leading-[81px] font-semibold mb-4 '
              dangerouslySetInnerHTML={{
                __html: t('LENDING_BUSINESS_TO_DO_TOGETHER'),
              }}
            />
            <span className='text-body-14 s:text-body-16 m:text-body-18 font-normal text-greyscale-900 mb-4 s:mb-8'>
              {t('LANDING_BUSINESS_TO_DO_TOGETHER_DESCRIPTION')}
            </span>
            <div className='hidden s:flex'>{startButton}</div>
          </div>
          <div className='relative w-[184px] h-[242px] s:w-[220px] s:h-[289px] m:w-[304px] m:h-[400px] l:w-[420px] l:h-[551px] shrink-0 mb-6 m:mr-12'>
            <ImageWrapper
              quality={100}
              type='/img/with-vooxee.png'
              alt='with vooxee'
              layout='fill'
              objectFit='contain'
            />
          </div>
          <div className='flex s:hidden'>{startButton}</div>
        </div>
        <div className='flex flex-col items-center mb-12 s:mb-25  m:mb-[150px]'>
          <span className='text-primary-500 text-body-16 mb-2'>
            {t('LANDING_BUSINESS_OUR_SERVICES')}
          </span>
          <span className='text-h-5 s:text-h-4 m:text-h-3 font-bold text-greyscale-900 mb-6 s:mb-12'>
            {t('LANDING_BUSINESS_PROVIDED_FUNCTIONS')}
          </span>
          <div className='flex flex-col drop-shadow-card space-y-4 s:space-y-0 s:grid s:grid-cols-2 m:grid-cols-4 s:gap-6 m:gap-4 l:gap-12'>
            {features.map((feature) => (
              <div className='flex flex-col px-4 s:px-8 m:px-3 pb-4 s:pb-6 m:pb-4 pt-2 s:pt-6 m:pt-4 bg-white items-center rounded-2xl s:w-[338px] m:w-[222px] l:w-[265px]'>
                <div className='w-[100px] h-[100px] relative mb-4 l:mb-6'>
                  <ImageWrapper
                    type={feature.img}
                    layout='fill'
                    quality={100}
                    alt={feature.img}
                  />
                </div>
                <span className='mb-2 text-h-6 font-bold text-greyscale-900 text-center'>
                  {t(feature.title)}
                </span>
                <span className='text-body-14 font-normal text-grayscale-900 text-center'>
                  {t(feature.description)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className='flex flex-col items-center mb-9 s:mb-25 m:mb-[150px]'>
          <span className='text-primary-500 text-body-16 mb-2'>
            {t('LANDING_BUSINESS_WHY_US')}
          </span>
          <span className='text-h-5 s:text-h-4 m:text-h-3 font-bold text-greyscale-900 mb-6 s:mb-15 text-center'>
            {t('LANDING_BUSINESS_WHY_US_DESCRIPTION')}
          </span>
          <div className='w-[328px] h-[230px] s:w-[398px] s:h-[260px] m:w-[550px] m:h-[360px] l:w-[640px] l:h-[420px] relative mb-6'>
            <ImageWrapper type='/img/why-us.png' alt='why us' layout='fill' />
          </div>
          <div className='flex flex-wrap justify-center'>
            {whyUs.map((reason) => (
              <div className='flex space-x-1 bg-white items-center mr-2 mb-3 shadow-popup rounded-lg s:rounded-2xl m:rounded-3xl px-2 m:px-4 py-1 m:py-2'>
                <div className='w-5 h-5 s:w-10 s:h-10 m:w-15 m:h-15  relative'>
                  <ImageWrapper
                    type={reason.img}
                    alt={reason.img}
                    layout='fill'
                    objectFit='contain'
                  />
                </div>
                <span className='text-body-12 s:text-body-16 m:text-h-5 font-bold'>
                  {t(reason.title)}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className='flex flex-col items-center mb-12 s:mb-25 m:mb-[150px]'>
          <span className='text-primary-500 text-body-16 mb-2'>
            {t('LANDING_BUSINESS_WHO_WE_ARE')}
          </span>
          <span className='text-h-5 s:text-h-4 m:text-h-3 font-bold text-greyscale-900 mb-6 s:mb-15 text-center'>
            {t('LANDING_BUSINESS_ABOUT_US')}
          </span>

          <div className='flex flex-col items-center s:flex-row s:space-x-6 l:space-x-16'>
            <div className='w-[330px] h-[250px] m:w-[460px] m:h-[320px] l:w-[632px] l:h-[432px] relative mb-6 s:mb-0 shrink-0'>
              <ImageWrapper
                type='/img/who-we-are.png'
                alt='who we are'
                layout='fill'
                objectFit='contain'
              />
            </div>
            <div className='flex flex-col s:w-[398px] m:w-[464px] items-center s:items-start'>
              <span className='text-body-14 m:text-body-16 l:text-body-18 text-greyscale-900 font-normal whitespace-pre-line mb-4'>
                {t('LANDING_BUSINESS_ABOUT_US_DESCRIPTION')}
              </span>
              {startButton}
            </div>
          </div>
        </div>
        <div className='flex flex-col items-center' ref={formRef}>
          <span className='text-primary-500 text-body-16 mb-2 '>
            {t('LANDING_BUSINESS_TO_HELP')}
          </span>
          <span className='text-h-5 s:text-h-4 m:text-h-3 font-bold text-greyscale-900 mb-6 s:mb-12 text-center'>
            {t('LANDING_BUSINESS_TO_HELP_DESCRIPTION')}
          </span>
          <div className='bg-gradient-to-l from-[#7210FF] to-[#9D59FF] w-full py-8 s:py-12 px-6 flex flex-col rounded-3xl items-center'>
            <div className='flex flex-col s:w-[450px] m:w-[500px] '>
              <span className='text-body-14 s:text-h-4 text-secondary-500 font-bold mb-2 text-center'>
                {t('LANDING_BUSINESS_IT_IS_FREE')}
              </span>
              <span className='text-body-14 s:text-h-6 text-secondary-500 font-bold mb-6 text-center'>
                {t('LANDING_BUSINESS_IT_IS_FREE_DESCRIPTION')}
              </span>
              <FormikProvider value={formik}>
                <div className='flex flex-col space-y-4 self-center'>
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
                    labelClassname='text-body-12 s:text-body-14 mt-4 text-white'
                    name='privacy'
                    component={FormikCheckbox}
                    label={t('LANDING_BUSINESS_AGREE_PERSONAL_DATA')}
                  />
                </div>
                <Button
                  onClick={() => handleSubmit()}
                  className='rounded-full bg-secondary-500 text-body-18 w-full h-[62px] text-greyscale-900 mt-6 max-w-[300px] self-center'>
                  {t('LANDING_BUSINESS_START_TODAY')}
                </Button>
              </FormikProvider>
            </div>
          </div>
        </div>
        <div className='border-t border-greyscale-200 mt-12 s:mt-25 m:mt-[150px] mb-8 -mx-4 s:-mx-8 m:-mx-10'>
          <div className='flex flex-col s:flex-row s:items-center mx-4 s:mx-8 m:mx-10 s:mt-8'>
            <div className='flex flex-col s:flex-row space-y-10 s:space-y-0 s:space-x-10 text-greyscale-900 text-body-16 font-semibold text-left my-8 s:my-0 s:justify-between w-full'>
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
            <div className='text-body-14 font-normal text-greyscale-900 self-start whitespace-nowrap'>
              © {new Date().getFullYear()} VooXee
            </div>
          </div>
        </div>
      </div>
      <SuccessModal
        isOpen={isSubmitted}
        onClose={() => setIsSubmitted(false)}
      />
    </>
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
      className='absolute rounded-6 w-[328px] s:w-480px bg-white-a inset-x-0 mx-auto top-1/3 s:top-[162px] flex outline-none drop-shadow-2xl'
      overlayClassName='fixed inset-0 max-h-screen overflow-y-auto z-20 bg-modal-background'>
      <div className='flex flex-col w-full p-8'>
        <div className='pb-4 hidden s:flex justify-end'>
          <Button onClick={onClose}>
            <IcClear className='fill-current text-greyscale-400 h-6 w-6' />
          </Button>
        </div>
        <div className='relative flex flex-col items-center'>
          <div className='relative pb-8'>
            <ImageWrapper
              type='/img/business-success.png'
              alt='thank you'
              width={180}
              height={180}
              quality={100}
            />
          </div>
          <span className='text-h-4 text-primary-500 font-bold pb-4'>
            {t('THANKS')}
          </span>
          <span className='text-body-16 text-greyscale-900 font-normal pb-8'>
            {t('LANDING_MESSAGE')}
          </span>
          <PrimaryButton onClick={() => push('/')}>
            {t('LANDING_TO_MAIN_PAGE')}
          </PrimaryButton>
        </div>
      </div>
    </ReactModal>
  )
}

export default BusinessLayout
