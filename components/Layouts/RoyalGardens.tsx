import React, {FC, useState, useRef, useEffect} from 'react'
import {useTranslation} from 'next-i18next'
import {useWindowSize} from 'react-use'
import {Field, FormikProvider, useFormik} from 'formik'
import ReactModal from 'react-modal'
import {omit} from 'lodash'
import GoogleMapReact from 'google-map-react'
import {object, string} from 'yup'
import {observer} from 'mobx-react-lite'
import ReCAPTCHA from 'react-google-recaptcha'
import IcArrow from 'icons/material/ArrowBack.svg'
import IcClear from 'icons/material/Clear.svg'
import {Search, Download, Call, Message} from 'react-iconly'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import {WheelGesturesPlugin} from 'embla-carousel-wheel-gestures'
import Burger from '../Burger'
import SvgMapMarker from '../../assets/icons/SvgMapMarker'
import {FormikNumber, FormikText, FormikCheckbox} from '../FormikComponents'
import {makeRequest} from '../../api'
import Logo from '../Logo'
import LanguageSelect from '../LanguageSelect'
import BusinessButton from '../BusinessButton'
import SafetyButton from '../SafetyButton'
import ImageWrapper from '../ImageWrapper'
import {ThumbObject} from '../../types'
import Auth from '../Auth'
import MetaTags from '../MetaTags'
import LinkWrapper from '../Buttons/LinkWrapper'
import Button from '../Buttons/Button'
import PhotosModal from '../Modals/PhotosModal'
import VideoModal from '../Modals/VideoModal'
import LoginModal from '../Auth/Login/LoginModal'
import SuccessModal from '../Modals/SuccessModal'
import {download} from '../../utils'
import {useGeneralStore} from '../../providers/RootStoreProvider'

const property = [
  {
    title: 'LANDING_REAL_ESTATE_FLOORS',
    text: '5',
  },
  {
    title: 'LANDING_REAL_ESTATE_APARTMENTS',
    text: '18',
  },
  {
    title: 'LANDING_REAL_ESTATE_PROPERTY',
    text: '19',
  },
  {
    title: 'LANDING_REAL_ESTATE_BEDROOMS_AMOUNT',
    text: '2-4',
  },
]

const facilities = [
  'LANDING_REAL_ESTATE_SWIMMING_POOL',
  'LANDING_REAL_ESTATE_KIDS_POOL',
  'LANDING_REAL_ESTATE_SURVEILLANCE',
  'LANDING_REAL_ESTATE_SEATING_AREA',
  'LANDING_REAL_ESTATE_PLAYGROUND',
  'LANDING_REAL_ESTATE_SAUNA',
  'LANDING_REAL_ESTATE_GYM',
  'LANDING_REAL_ESTATE_STORAGE',
  'LANDING_REAL_ESTATE_BAR',
  'LANDING_REAL_ESTATE_RECEPTION',
  'LANDING_REAL_ESTATE_BICYCLE',
]

const tabs = [
  {
    title: 'LANDING_REAL_ESTATE_LOWER_FLOOR',
    id: 0,
  },
  {
    title: 'LANDING_REAL_ESTATE_UPPER_FLOOR',
    id: 1,
  },
]

const headers = [
  'LANDING_REAL_ESTATE_RESIDENCE',
  'LANDING_REAL_ESTATE_BEDROOMS',
  'LANDING_REAL_ESTATE_NET',
  'LANDING_REAL_ESTATE_GROSS',
  'LANDING_REAL_ESTATE_AVAILABILITY',
]

const rows = [
  ['502', '3', '196', '243', 'LANDING_REAL_ESTATE_AVAILABLE'],
  ['501', '3', '189', '235', 'LANDING_REAL_ESTATE_SOLD'],
]

const areas = [
  'LANDING_REAL_ESTATE_WALKING_DISTANCE',
  'LANDING_REAL_ESTATE_PARK',
  'LANDING_REAL_ESTATE_QUIET_AREA',
  'LANDING_REAL_ESTATE_BEACH',
]

const photos = [
  {
    src: '/img/royal-garden/Gallery1.png',
    type: 'image',
    title: 'LANDING_REAL_ESTATE_AMAZING_TERRACE',
    width: 615,
  },
  {
    src: '/img/royal-garden/Gallery2.png',
    type: 'image',
    title: 'LANDING_REAL_ESTATE_LIVING_ROOM',
    width: 528,
  },
  {
    src: '/img/royal-garden/Gallery3.png',
    type: 'image',
    title: 'LANDING_REAL_ESTATE_MODERN_DESIGN',
    width: 584,
  },
  {
    src: '/img/royal-garden/Gallery4.png',
    type: 'image',
    title: 'LANDING_REAL_ESTATE_JACUZZI',
    width: 584,
  },
  {
    src: '/img/royal-garden/Gallery5.png',
    type: 'image',
    title: 'LANDING_REAL_ESTATE_BEAUTIFUL_VIEWS',
    width: 584,
  },
  {
    src: '/img/royal-garden/Gallery6.png',
    type: 'image',
    title: 'LANDING_REAL_ESTATE_COSY_AREAS',
    width: 584,
  },
  {
    src: '/img/royal-garden/Gallery7.png',
    type: 'image',
    title: 'LANDING_REAL_ESTATE_CHILLOUT_ZONE',
    width: 584,
  },
  {
    src: '/img/royal-garden/Gallery8.png',
    type: 'image',
    title: 'LANDING_REAL_ESTATE_KITCHEN',
    width: 584,
  },
  {
    src: '/img/royal-garden/Gallery9.png',
    type: 'image',
    title: 'LANDING_REAL_ESTATE_DESIGNER_BEDROOM',
    width: 584,
  },
  {
    src: '/img/royal-garden/Gallery10.png',
    type: 'image',
    title: 'LANDING_REAL_ESTATE_BBQ_AREA',
    width: 584,
  },
]

const Gallery: FC = observer(() => {
  const {t} = useTranslation()
  const {width} = useWindowSize()

  let imgHeight
  if (width < 768) {
    imgHeight = 170
  } else if (width < 1024) {
    imgHeight = 263
  } else {
    imgHeight = 410
  }
  const [showModal, setShowModal] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const [viewportRef, embla] = useEmblaCarousel(
    {
      loop: true,
      dragFree: true,
      containScroll: 'trimSnaps',
      align: 'start',
    },
    [Autoplay({delay: 5000}), WheelGesturesPlugin()],
  )

  useEffect(() => {
    if (embla) {
      embla.on('select', () => {
        const index = embla.selectedScrollSnap() || 0
        setCurrentIndex(index > 9 ? index - 10 : index)
      })
    }
  }, [embla])

  return (
    <div className='overflow-hidden mt-6 m:mt-12 mb-8' ref={viewportRef}>
      <div className='relative flex shrink-0'>
        {[...photos].map((photo, index) => (
          <div key={photo.src} className='mr-4'>
            <div className='flex flex-col relative'>
              <Button
                onClick={() => {
                  if (embla.clickAllowed()) {
                    setShowModal(true)
                    setCurrentIndex(index)
                  }
                }}>
                <ImageWrapper
                  quality={100}
                  type={photo.src}
                  alt={t(photo.title)}
                  layout='fixed'
                  width={(photo.width * imgHeight) / 410}
                  height={imgHeight}
                  objectFit='contain'
                />
              </Button>

              <span className='mt-3 m:mt-6 font-light text-greyscale-900 text-body-14 m:text-body-18 '>
                {t(photo.title)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className='w-full flex mt-3 s:mt-[18px] m:mt-10'>
        <div className='flex space-x-2 s:space-x-4 l:space-x-6 mr-4'>
          <Button onClick={() => embla.scrollPrev()}>
            <IcArrow className='fill-current text-greyscale-900 h-6 w-6 shrink-0 ' />
          </Button>
          <span className='font-light text-body-16 s:text-body-18 m:text-[24px] text-greyscale-900'>
            {(currentIndex + 1).toString().padStart(2, '0')}/{photos.length}
          </span>
          <Button onClick={() => embla.scrollNext()}>
            <IcArrow className='fill-current text-greyscale-900 rotate-180 h-6 w-6 shrink-0 ' />
          </Button>
        </div>
        <div className='w-full flex self-center '>
          {photos.map((photoEmbla, index) => (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              className={`w-[10%] h-[2px] ${
                currentIndex === index
                  ? 'bg-greyscale-900 '
                  : 'bg-greyscale-400'
              }`}
            />
          ))}
        </div>
      </div>
      {showModal && (
        <PhotosModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          items={photos as ThumbObject[]}
          currentIndex={currentIndex}
        />
      )}
    </div>
  )
})

const RoyalGardens: FC = observer(() => {
  const {t} = useTranslation()
  const {showLogin, setShowLogin} = useGeneralStore()
  const [showModal, setShowModal] = useState(false)
  const [tab, setTab] = useState(0)
  const [showMapModal, setShowMapModal] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const formRef = useRef<HTMLDivElement>()
  const galleryRef = useRef<HTMLDivElement>()
  const facilitiesRef = useRef<HTMLDivElement>()
  const floorplanRef = useRef<HTMLDivElement>()
  const locationRef = useRef<HTMLDivElement>()

  const formik = useFormik({
    validateOnBlur: false,
    validateOnChange: false,
    validationSchema: object().shape({
      name: string().required(t('EMPTY_FIELD')),
      phone: string().required(t('EMPTY_FIELD')).min(8),
      email: string()
        .email(t('EMAIL_MUST_BE_A_VALID_EMAIL'))
        .required(t('EMAIL_REQUIRED_FIELD')),
      message: string(),
      token: process.env.NEXT_PUBLIC_RECAPTCHA_KEY
        ? string().required(t('EMPTY_FIELD'))
        : string(),
    }),
    initialValues: {
      name: '',
      phone: '',
      email: '',
      message: '',
      token: '',
    },
    onSubmit: (values) => {
      setShowSuccess(true)
      return makeRequest({
        method: 'post',
        url: '/api/landing-submit',
        data: {
          ...omit(values, ['token']),
          parameter: 'Royal Gardens',
        },
      })
    },
  })

  const [activeItem, setActiveItem] = useState(null)
  const handleItemClick = (item, ref) => {
    ref.current.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
    setActiveItem(item)
  }

  const startButton = (
    <div className='self-center w-full'>
      <Button
        className='flex justify-between px-6 m:px-8 py-4 border border-greyscale-800 rounded-[32px] max-w-[220px] s:max-w-[195px] m:max-w-[220px] h-[56px] text-body-14 text-greyscale-800 font-light'
        onClick={() => {
          formRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          })
        }}>
        {t('LANDING_REAL_ESTATE_BOOK')}
        <IcArrow className='fill-current text-greyscale-900 h-6 w-6 rotate-180 shrink-0 ' />
      </Button>
    </div>
  )

  const logo = (
    <ImageWrapper
      type='/img/logo/FullLogo.svg'
      alt='Logo'
      width={110}
      height={25}
      layout='fixed'
    />
  )

  const location = {
    lat: 34.703801296457385,
    lng: 33.0930107117758,
  }

  const {handleSubmit, errors} = formik

  return (
    <>
      <MetaTags title='Royal Gardens' />
      <div className='sticky top-0 z-20 s:hidden bg-greyscale-50'>
        <div className='mx-4 pt-5 s:hidden pb-4 flex justify-between items-center'>
          <Burger />
          <div className='absolute left-1/2 right-1/2'>
            <LinkWrapper
              title='logo'
              href='/'
              className='flex flex-col justify-center items-center cursor-pointer '>
              {logo}
            </LinkWrapper>
          </div>
        </div>
        <div className='mx-4 pb-2 s:h-[28px]'>
          <nav className='flex justify-between items-center'>
            <ul className='flex space-x-3 s:space-x-8 font-light text-body-12 s:text-body-16 l:text-body-18 text-greyscale-900'>
              <li className='flex flex-col'>
                <Button onClick={() => handleItemClick('gallery', galleryRef)}>
                  {t('LANDING_REAL_ESTATE_GALLERY')}
                </Button>
                {activeItem === 'gallery' && (
                  <div className='w-2/3 border-b border-greyscale-900 self-start mt-2' />
                )}
              </li>
              <li className='flex flex-col'>
                <Button
                  onClick={() => handleItemClick('facilities', facilitiesRef)}>
                  {t('LANDING_REAL_ESTATE_FACILITIES')}
                </Button>
                {activeItem === 'facilities' && (
                  <div className='w-2/3 border-b border-greyscale-900 self-start mt-2' />
                )}
              </li>
              <li className='flex flex-col'>
                <Button
                  onClick={() => handleItemClick('floorplan', floorplanRef)}>
                  {t('LANDING_REAL_ESTATE_FLOORPLAN')}
                </Button>
                {activeItem === 'floorplan' && (
                  <div className='w-2/3 border-b border-greyscale-900 self-start mt-2' />
                )}
              </li>
              <li className='flex flex-col'>
                <Button
                  onClick={() => handleItemClick('location', locationRef)}>
                  {t('LANDING_REAL_ESTATE_LOCATION')}
                </Button>
                {activeItem === 'location' && (
                  <div className='w-2/3 border-b border-greyscale-900 self-start mt-2' />
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className='bg-greyscale-50'>
        <div className='flex flex-col mx-4 s:pt-8 s:mx-auto s:w-[704px] m:w-[944px] l:w-[1210px]'>
          <div className='hidden s:flex items-start s:flex-row s:justify-between s:items-center s:mb-14 m:mb-12 l:mb-16'>
            <Logo />
            <div className='flex space-x-4 s:space-x-5 items-center justify-between'>
              <BusinessButton />
              <SafetyButton />
              <LanguageSelect />
              <Auth
                onLogin={() => {
                  setShowLogin(true)
                }}
              />
            </div>
          </div>
          <div className='hidden s:block s:static w-full pb-3 s:pb-0 s:h-[28px] bg-greyscale-50'>
            <nav className='flex justify-between items-center'>
              <ul className='flex space-x-3 s:space-x-8 font-light text-body-12 s:text-body-16 l:text-body-18 text-greyscale-900'>
                <li className='flex flex-col'>
                  <Button
                    onClick={() => handleItemClick('gallery', galleryRef)}>
                    {t('LANDING_REAL_ESTATE_GALLERY')}
                  </Button>
                  {activeItem === 'gallery' && (
                    <div className='w-2/3 border-b border-greyscale-900 self-start mb-4 mt-2' />
                  )}
                </li>
                <li className='flex flex-col'>
                  <Button
                    onClick={() =>
                      handleItemClick('facilities', facilitiesRef)
                    }>
                    {t('LANDING_REAL_ESTATE_FACILITIES')}
                  </Button>
                  {activeItem === 'facilities' && (
                    <div className='w-2/3 border-b border-greyscale-900 self-start mb-4 mt-2' />
                  )}
                </li>
                <li className='flex flex-col'>
                  <Button
                    onClick={() => handleItemClick('floorplan', floorplanRef)}>
                    {t('LANDING_REAL_ESTATE_FLOORPLAN')}
                  </Button>
                  {activeItem === 'floorplan' && (
                    <div className='w-2/3 border-b border-greyscale-900 self-start mb-4 mt-2' />
                  )}
                </li>
                <li className='flex flex-col'>
                  <Button
                    onClick={() => handleItemClick('location', locationRef)}>
                    {t('LANDING_REAL_ESTATE_LOCATION')}
                  </Button>
                  {activeItem === 'location' && (
                    <div className='w-2/3 border-b border-greyscale-900 self-start mb-4 mt-2' />
                  )}
                </li>
              </ul>
            </nav>
          </div>

          <div className='w-full flex justify-between'>
            <div className='flex flex-col'>
              <h4 className='font-light text-greyscale-500 text-body-12 s:text-h-5 l:text-h-4 mt-8 s:mt-11 m:mt-14 l:mt-16'>
                {t('LANDING_REAL_ESTATE_PERFECT_HEALING')}
              </h4>
              <span className='py-2 s:py-3 l:py-8 s:mt-4 font-light leading-10 text-h-3 s:text-[60px] l:text-[90px] text-greyscale-900'>
                ROYAL <i>GARDENS</i>
              </span>
            </div>

            <div className='hidden s:block self-end'>{startButton}</div>
          </div>
          <div className='flex flex-col-reverse s:flex-row s:mt-6 s:space-x-4 m:space-x-12 l:space-x-25 items-start justify-between'>
            <div className='flex flex-col text-body-14 self-start m:text-body-16 space-y-2 s:space-y-4 l:space-y-6 text-greyscale-900 font-light'>
              <span className='block'>{t('RESIDENCE_ROYAL_GARDENS')}</span>
              <span className='block'>{t('RESIDENTIAL_COMPLEX')}</span>
              <span className='block'>
                {t('LANDING_REAL_ESTATE_MATERIALS')}
              </span>
              <span className='block'>
                {t('LANDING_REAL_ESTATE_SALES_AGREEMENT')}
              </span>
            </div>
            <div className='s:hidden mx-auto mb-6 grid grid-cols-2 grid-rows-2 gap-x-12 gap-y-1  items-end place-items-center'>
              {property.map((feature, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={index} className='flex flex-col max-w-[104px]'>
                  <span className='text-body-10 font-medium text-greyscale-900 self-start'>
                    {t(feature.title)}
                  </span>
                  <div className='w-[104px] border-b border-greyscale-900 self-start my-2' />
                  <span className='text-h-2 font-light text-greyscale-900'>
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            <div className='mx-auto'>
              <Button
                className='flex self-start relative w-[328px] h-[457px] s:w-[344px] s:h-[468px] m:w-[400px] m:h-[508px] l:w-[510px] l:h-[644px]'
                onClick={() => {
                  setShowModal(true)
                }}>
                <ImageWrapper
                  type='/img/royal-garden/RoyalGardens.png'
                  layout='fill'
                  alt='Royal Gardens'
                  objectFit='contain'
                />
              </Button>
            </div>
          </div>
          <div className='s:hidden self-center mt-4'>{startButton}</div>
          <div className='hidden s:self-center s:flex s:mt-4 m:absolute m:top-[810px] l:top-[935px] s:w-[704px] m:w-[874px] bg-white'>
            <div className='flex s:space-x-8 m:space-x-10 py-8 s:px-3 m:px-8 items-end'>
              {property.map((feature, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={index} className='flex flex-col'>
                  <span className='s:text-body-14 m:text-body-16 font-medium text-greyscale-900 self-start'>
                    {t(feature.title)}
                  </span>
                  <div className='s:w-[145px] m:w-[165px] border-b border-greyscale-900 self-start my-2' />
                  <span className='text-[60px] font-light text-greyscale-900'>
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className='mt-12 m:mt-[256px]' ref={galleryRef}>
            <span className='text-body-12 s:text-body-16 m:text-h-5 text-greyscale-500 font-light'>
              {t('LANDING_REAL_ESTATE_GALLERY')}
            </span>
            <h1
              className='s:mt-2 l:mt-5 font-light max-w-[798px] leading-10 text-h-4 s:text-h-3 m:text-h-1 text-greyscale-900'
              dangerouslySetInnerHTML={{
                __html: t('LANDING_REAL_ESTATE_COMFORT_OF_THE_CITY'),
              }}
            />
          </div>
        </div>
        <div className='ml-4 s:ml-8 m:ml-10 min-[1280px]:ml-[168px] l:ml-[115px] xl:ml-[355px] xxl:ml-[675px]'>
          <Gallery />
        </div>
        <div className='flex flex-col mx-4 s:mx-auto pt-8 s:w-[704px] m:w-[944px] l:w-[1210px]'>
          <div className='mt-6 m:mt-20 l:mt-35' ref={facilitiesRef}>
            <span className='text-body-12 s:text-body-16 m:text-h-5 text-greyscale-500 font-light'>
              {t('LANDING_REAL_ESTATE_FACILITIES')}
            </span>
            <h1
              className='s:mt-2 l:mt-5 font-light max-w-[798px] leading-10 text-h-4 s:text-h-3 m:text-h-1 text-greyscale-900'
              dangerouslySetInnerHTML={{
                __html: t('LANDING_REAL_ESTATE_RESORT_COMPLEX_IDEA'),
              }}
            />
            <div className='flex flex-col s:flex-row s:space-x-10 m:space-x-15 l:space-x-25 s:items-center'>
              <div className='mt-6 m:mt-12'>
                <div className='relative w-[328px] h-[230px] mx-auto s:hidden'>
                  <ImageWrapper
                    type='/img/royal-garden/facilitiesXS.png'
                    layout='fill'
                    alt='facilities'
                    objectFit='contain'
                  />
                </div>
                <div className='relative s:w-[410px] s:h-[414px] m:hidden'>
                  <ImageWrapper
                    type='/img/royal-garden/facilitiesS.png'
                    layout='fill'
                    alt='facilities'
                    objectFit='contain'
                  />
                </div>
                <div className='relative m:w-[560px] m:h-[436px] l:hidden'>
                  <ImageWrapper
                    type='/img/royal-garden/facilitiesM.png'
                    layout='fill'
                    alt='facilities'
                    objectFit='contain'
                  />
                </div>
                <div className='relative l:w-[801px] l:h-[623px]'>
                  <ImageWrapper
                    type='/img/royal-garden/facilities.png'
                    layout='fill'
                    alt='facilities'
                    objectFit='contain'
                  />
                </div>
              </div>
              <ul className='list-disc font-light m:font-normal mx-4 mt-4 m:mt-16 s:mx-0 text-greyscale-900 text-body-14 m:text-body-16'>
                {facilities.map((facilitie, index) => (
                  <li
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    className='mb-2 m:mb-4'
                    dangerouslySetInnerHTML={{
                      __html: t(facilitie),
                    }}
                  />
                ))}
              </ul>
            </div>
          </div>
          <div className='mt-6 m:mt-20 l:mt-35' ref={floorplanRef}>
            <span className='text-body-12 s:text-body-16 m:text-h-5 text-greyscale-500 font-light'>
              {t('LANDING_REAL_ESTATE_FLOORPLAN')}
            </span>
            <h1
              className='s:mt-2 l:mt-5 font-light max-w-[798px] leading-10 text-h-4 s:text-h-3 m:text-h-1 text-greyscale-900'
              dangerouslySetInnerHTML={{
                __html: t('LANDING_REAL_ESTATE_EXCLUSIVE_APARTMENTS'),
              }}
            />
            <div className='flex justify-between items-center mt-12'>
              <div className='flex space-x-4 s:space-x-6 '>
                {tabs.map((currentTab) => (
                  <Button
                    onClick={() => setTab(currentTab.id)}
                    key={currentTab.title}
                    className={`px-4 py-2 m:px-5 m:py-4 rounded-[32px] border border-greyscale-900 ${
                      currentTab.id === tab ? 'bg-greyscale-900' : ''
                    }`}>
                    <span
                      className={`text-body-16 font-light ${
                        currentTab.id === tab
                          ? 'text-white'
                          : 'text-greyscale-900 '
                      }`}>
                      {t(currentTab.title)}
                    </span>
                  </Button>
                ))}
              </div>
              <div className='hidden s:flex space-x-4'>
                <Button
                  className='w-[38px] h-[38px] m:w-12 m:h-12 border border-greyscale-900 rounded-full p-[9px] m:p-[14px]'
                  onClick={() => {
                    setShowMapModal(true)
                  }}>
                  <div className='fill-current text-greyscale-900 s:w-5 s:h-5 m:max-w-6 m:max-h-6'>
                    <Search set='light' size={20} />
                  </div>
                </Button>
                <Button
                  className='w-[38px] h-[38px] m:w-12 m:h-12 border border-greyscale-900 rounded-full p-[9px] m:p-[14px]'
                  onClick={() => {
                    const link = document.createElement('a')
                    link.download = `${
                      tab === 0
                        ? 'RoyalGardens first-floor'
                        : 'RoyalGardens second-floor'
                    }`
                    link.href = `${
                      tab === 0
                        ? '/img/royal-garden/first-floor.png'
                        : '/img/royal-garden/second-floor.png'
                    }`
                    link.click()
                  }}>
                  <div className='fill-current text-greyscale-900 s:w-5 s:h-5 m:max-w-6 m:max-h-6'>
                    <Download set='light' size={20} />
                  </div>
                </Button>
              </div>
            </div>
            <div className='mt-10'>
              <div className='relative mx-auto s:mx-0 w-[328px] h-[186px] s:w-[704px] s:h-[400px] m:w-[944px] m:h-[540px] l:w-[1208px] l:h-[692px]'>
                {tab === 0 && (
                  <ImageWrapper
                    layout='fill'
                    type='/img/royal-garden/first-floor.png'
                    alt='first floor'
                  />
                )}
                {tab === 1 && (
                  <ImageWrapper
                    layout='fill'
                    type='/img/royal-garden/second-floor.png'
                    alt='second floor'
                  />
                )}
                <div className='flex s:hidden space-x-4 absolute bottom-0 right-0'>
                  <Button
                    className='w-6 h-6 border border-greyscale-900 rounded-full'
                    onClick={() => {
                      setShowMapModal(true)
                    }}>
                    <div className='fill-current text-greyscale-900'>
                      <Search set='light' size={16} />
                    </div>
                  </Button>
                  <Button
                    className='w-6 h-6 border border-greyscale-900 rounded-full'
                    onClick={() => {
                      // eslint-disable-next-line no-unused-expressions
                      tab === 0
                        ? download(
                            'RoyalGardens first-floor',
                            '/img/royal-garden/first-floor.png',
                          )
                        : download(
                            'RoyalGardens second-floor',
                            '/img/royal-garden/second-floor.png',
                          )
                    }}>
                    <div className='fill-current text-greyscale-900'>
                      <Download set='light' size={16} />
                    </div>
                  </Button>
                </div>
              </div>
            </div>
            {showMapModal && (
              <ReactModal
                isOpen={showMapModal}
                onRequestClose={() => setShowMapModal(false)}
                shouldCloseOnOverlayClick
                ariaHideApp={false}
                className='absolute h-full s:h-auto inset-x-0 mx-auto s:inset-x-8 m:inset-x-12 l:inset-x-24 s:top-14 m:top-20 l:top-14 flex outline-none flex-col'
                overlayClassName='fixed inset-0 bg-shadow-overlay max-h-screen overflow-y-auto z-30'>
                <Button
                  onClick={() => setShowMapModal(false)}
                  className='absolute top-14 s:top-5 right-5 cursor-pointer z-10'>
                  <IcClear className='fill-current text-greyscale-400 h-5 w-5 s:h-8 s:w-8' />
                </Button>
                <div className='flex flex-col w-full flex-1 overflow-hidden bg-white s:rounded-3xl'>
                  <div className='overflow-hidden h-full s:h-auto relative s:mx-16'>
                    <div className='flex h-full s:h-[364px] m:h-[504px] l:h-[746px]'>
                      <img
                        src={`${
                          tab === 0
                            ? 'img/royal-garden/first-floor.png'
                            : '/img/royal-garden/second-floor.png'
                        }`}
                        alt={`${tab === 0 ? 'first-floor' : 'second-floor'}`}
                      />
                    </div>
                  </div>
                </div>
              </ReactModal>
            )}

            <table className='s:hidden w-full mt-3'>
              <thead className='text-left'>
                {headers.map((header, index) => (
                  <tr
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    className={
                      headers.indexOf(header) !== headers.length - 1
                        ? 'border-b border-greyscale-300'
                        : ''
                    }>
                    <td
                      className='py-5 text-greyscale-900 s:text-body-16 m:text-[20px]'
                      dangerouslySetInnerHTML={{
                        __html: t(header),
                      }}
                    />
                    {rows.map((row) => (
                      <td
                        className='py-5 text-greyscale-900 s:text-body-16 m:text-[20px] font-light'
                        dangerouslySetInnerHTML={{
                          __html: t(row[index]),
                        }}
                      />
                    ))}
                  </tr>
                ))}
              </thead>
            </table>

            <table className='hidden s:block w-full mt-8 m:mt-12 l:mt-20'>
              <thead className='text-center align-top'>
                <tr className='border-b border-greyscale-300'>
                  {headers.map((header, index) => (
                    <td
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      className='s:p-6 m:p-8 text-greyscale-900 s:text-body-16 m:text-[20px]'
                      dangerouslySetInnerHTML={{
                        __html: t(header),
                      }}
                    />
                  ))}
                </tr>
              </thead>
              <tbody className='text-center'>
                {rows.map((row, index) => (
                  <tr
                    // eslint-disable-next-line react/no-array-index-key
                    key={index}
                    className={
                      rows.indexOf(row) !== rows.length - 1
                        ? 'border-b border-greyscale-300'
                        : ''
                    }>
                    {row.map((cell) => (
                      <td
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        className='s:p-6 m:p-8 text-greyscale-900 s:text-body-16 m:text-[20px] font-light'
                        dangerouslySetInnerHTML={{
                          __html: t(cell),
                        }}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div
            className='mt-6 m:mt-20 l:mt-35 pb-12 s:pb-[60px] m:pb-20 l:pb-[151px]'
            ref={locationRef}>
            <span className='text-body-12 s:text-body-16 m:text-h-5 text-greyscale-500 font-light'>
              {t('LANDING_REAL_ESTATE_LOCATION')}
            </span>
            <h1
              className='s:mt-2 l:mt-5 font-light max-w-[798px] leading-10 text-h-4 s:text-h-3 m:text-h-1 text-greyscale-900'
              dangerouslySetInnerHTML={{
                __html: t('LANDING_REAL_ESTATE_RIGHT_PLACE'),
              }}
            />
            <div className='flex flex-col-reverse s:flex-row s:items-center s:mt-8 m:mt-12'>
              <div className='flex flex-col self-start'>
                <span className='text-body-16 text-greyscale-900  mb-4 m:mb-6'>
                  {t('LANDING_REAL_ESTATE_RIGHT_LOCATION_AREA')}
                </span>
                <ul className='list-disc font-light m:font-normal mx-4 s:mx-0 text-greyscale-900 text-body-14 m:text-body-16'>
                  {areas.map((area, index) => (
                    <li
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      className='ml-5 mb-2 m:mb-4'
                      dangerouslySetInnerHTML={{
                        __html: t(area),
                      }}
                    />
                  ))}
                </ul>
                <div className='flex space-x-4 items-center mt-2  ml-2'>
                  <div className='fill-current text-greyscale-900'>
                    <Call set='bold' size={16} />
                  </div>

                  <span className='text-greyscale-900 text-body-14 m:text-body-18'>
                    <a href='tel:+35795959919'>+357 95 959919</a>
                  </span>
                </div>
                <div className='flex space-x-4 items-center mt-2  ml-2'>
                  <div className='fill-current text-greyscale-900'>
                    <Message set='bold' size={16} />
                  </div>
                  <span className='text-greyscale-900 text-body-14 m:text-body-18'>
                    <a href='mailto:sales@vooxee.com'>sales@vooxee.com</a>
                  </span>
                </div>
              </div>
              <div className='relative mx-auto my-6 s:m-0 w-[328px] h-[190px] s:w-[464px] s:h-[276px] m:w-[640px] m:h-[380px] l:w-[886px] l:h-[500px]'>
                <GoogleMapReact
                  bootstrapURLKeys={{key: process.env.NEXT_PUBLIC_GOOGLE_API}}
                  center={location}
                  yesIWantToUseGoogleMapApiInternals
                  defaultZoom={14}
                  onGoogleApiLoaded={({map, maps}) => {
                    const svgMarker = {
                      path: SvgMapMarker,
                      fillColor: '#7210FF',
                      fillOpacity: 1,
                      strokeColor: '#FFFFFF',
                      strokeOpacity: 1,
                      anchor: new maps.Point(14, 35),
                    }
                    // eslint-disable-next-line no-new
                    new maps.Marker({
                      position: map.getCenter(),
                      icon: svgMarker,
                      map,
                    })
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        {/* <div className={`ml-[${marginGallery}px]`}> */}
      </div>
      <div className='flex flex-col items-center' ref={formRef}>
        <div className='s:bg-[url("/img/royal-garden/background_768.png")] m:bg-("/img/royal-garden/background_1024.png")] l:bg-("/img/royal-garden/background_1440.png")] bg-no-repeat bg-cover w-full py-8 s:py-12 px-6 flex flex-col'>
          <div className='flex flex-col s:p-12 w-full s:w-[496px] m:w-[680px] l:w-[680px] bg-white self-center'>
            <span className='text-body-12 s:text-body-16 m:text-h-5 text-greyscale-500 font-light'>
              {t('LANDING_REAL_ESTATE_GET_IN_TOUCH')}
            </span>
            <h1
              className='s:mt-2 l:mt-5 font-light max-w-[798px] leading-10 text-h-4 s:text-h-3 m:text-h-1 text-greyscale-900'
              dangerouslySetInnerHTML={{
                __html: t('LANDING_REAL_ESTATE_CONTACT_US'),
              }}
            />
            <FormikProvider value={formik}>
              <div className='flex flex-col space-y-4 self-center w-full my-4 m:mt-12 font-light'>
                <Field
                  component={FormikText}
                  name='name'
                  placeholder={t('LANDING_REAL_ESTATE_ENTER_NAME')}
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
                  component={FormikText}
                  name='email'
                  type='email'
                  placeholder={t('LANDING_REAL_ESTATE_ENTER_EMAIL')}
                />
                <Field
                  name='message'
                  isTextarea
                  rows={10}
                  component={FormikText}
                  placeholder={t('LANDING_REAL_ESTATE_ENTER_MESSAGE')}
                />
              </div>
              <Field
                labelClassname='text-body-14 mt-4 text-greyscale-900'
                name='personal data'
                component={FormikCheckbox}
                label={t('LANDING_REAL_ESTATE_AGREE_PERSONAL_DATA')}
              />
              {process.env.NEXT_PUBLIC_RECAPTCHA_KEY && (
                <ReCAPTCHA
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_KEY}
                  onChange={(val) => {
                    formik.setFieldValue('token', val)
                    formik.setFieldError('token', undefined)
                  }}
                />
              )}
              {errors.token && (
                <span className='text-error text-body-12'>{errors.token}</span>
              )}
              <Button
                onClick={() => handleSubmit()}
                className='flex justify-between mt-6 px-6 m:px-8 py-4 border border-greyscale-800 rounded-[32px] h-[56px] text-body-14 text-greyscale-800 font-light self-center'>
                {t('LANDING_BUSINESS_START_TODAY')}
                <IcArrow className='fill-current text-greyscale-900 ml-3 h-6 w-6 rotate-180 shrink-0 ' />
              </Button>
            </FormikProvider>
          </div>
        </div>
      </div>

      <div className='flex flex-col mx-4 s:mx-auto s:w-704px m:w-944px l:w-1208px '>
        <div className='mt-12  mb-8 -mx-4 s:-mx-8 m:-mx-10'>
          <div className='flex flex-col m:flex-row m:items-center mx-4 s:mx-8 m:mx-10 s:mt-8'>
            <div className='flex flex-col s:flex-row space-y-10 s:space-y-0 s:space-x-5 m:space-x-10 text-greyscale-900 text-body-16 font-semibold text-left my-8 s:my-0 s:justify-between w-full'>
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
                className='flex items-center whitespace-nowrap'
                title={t('COOKIES_POLICY')}
                href='/p/cookies-policy'>
                {t('COOKIES_POLICY')}
              </LinkWrapper>
              <LinkWrapper
                className='flex items-center w-full'
                title={t('SUPPORT')}
                href='/support'>
                {t('SUPPORT')}
              </LinkWrapper>
            </div>
            <div className='s:mt-4 m:mt-0 text-body-14 font-normal text-greyscale-900 self-start whitespace-nowrap'>
              © {new Date().getFullYear()} VooXee
            </div>
          </div>
        </div>
      </div>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />

      <VideoModal
        src='img/royal-garden/ROYAL_GARDENS.mp4'
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

      <SuccessModal
        imageSrc='/img/congrats.svg'
        title='LANDING_MESSAGE'
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
    </>
  )
})

export default RoyalGardens
