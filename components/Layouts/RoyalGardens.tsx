import React, {FC, useState, useRef, useCallback, useEffect} from 'react'
import {useTranslation} from 'next-i18next'
import {useWindowSize} from 'react-use'
import ReactModal from 'react-modal'
import {observer} from 'mobx-react-lite'
import IcArrow from 'icons/material/ArrowBack.svg'
import IcClear from 'icons/material/Clear.svg'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import {WheelGesturesPlugin} from 'embla-carousel-wheel-gestures'
import Logo from '../Logo'
import LanguageSelect from '../LanguageSelect'
import BusinessButton from '../BusinessButton'
import SafetyButton from '../SafetyButton'
import ImageWrapper from '../ImageWrapper'
import PhotosModal from '../PhotosModal'
import {ThumbObject} from '../../types'
import Auth from '../Auth'
import MetaTags from '../MetaTags'
import LinkWrapper from '../Buttons/LinkWrapper'
import Button from '../Buttons/Button'

const property = [
  {
    title: 'LANDING_REAL_ESTATE_FLOORS',
    text: '3',
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
  {
    title: 'LANDING_REAL_ESTATE_SWIMMING_POOL',
  },
  {
    title: 'LANDING_REAL_ESTATE_KIDS_POOL',
  },
  {
    title: 'LANDING_REAL_ESTATE_SURVEILLANCE',
  },
  {
    title: 'LANDING_REAL_ESTATE_SEATING_AREA',
  },
  {
    title: 'LANDING_REAL_ESTATE_PLAYGROUND',
  },
  {
    title: 'LANDING_REAL_ESTATE_SAUNA',
  },
  {
    title: 'LANDING_REAL_ESTATE_GYM',
  },
  {
    title: 'LANDING_REAL_ESTATE_STORAGE',
  },
  {
    title: 'LANDING_REAL_ESTATE_BAR',
  },
  {
    title: 'LANDING_REAL_ESTATE_RECEPTION',
  },
  {
    title: 'LANDING_REAL_ESTATE_BICYCLE',
  },
]

const Gallery: FC = observer(() => {
  const {t} = useTranslation()
  const {width} = useWindowSize()
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
  const [scrollProgress, setScrollProgress] = useState(10)

  const [viewportRef, embla] = useEmblaCarousel(
    {
      loop: true,
      dragFree: true,
      containScroll: 'trimSnaps',
      align: 'start',
    },
    [Autoplay({delay: 5000}), WheelGesturesPlugin()],
  )

  const onScroll = () => {
    if (embla) {
      const progress = Math.round(
        Math.max(10, Math.min(100, embla.scrollProgress() * 100) + 10),
      )
      setScrollProgress(progress)
    }
  }

  useEffect(() => {
    if (embla) {
      embla.on('select', () => {
        const index = embla.selectedScrollSnap() || 0
        setCurrentIndex(index > 9 ? index - 10 : index)
      })
      embla.on('scroll', onScroll)
    }
  }, [embla, onScroll])

  return (
    <div className='overflow-hidden mt-6 m:mt-12 mb-8' ref={viewportRef}>
      <div className='relative flex shrink-0'>
        {[...photos].map((photo, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div className='mr-4'>
            <div className='flex flex-col relative'>
              <Button
                onClick={() => {
                  setShowModal(true)
                  setCurrentIndex(index)
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
        <div className='self-center h-[2px] z-10 bg-greyscale-900 w-full'>
          <div
            className='h-[2px] bg-greyscale-400'
            style={{transform: `translateX(${scrollProgress}%)`}}
          />
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

const Navbar = () => {
  const {t} = useTranslation()
  const [activeItem, setActiveItem] = useState(null)
  const [click, setClick] = useState(false)

  const handleClick = () => setClick(!click)
  const closeMenu = () => setClick(true)

  const handleItemClick = (item) => {
    setActiveItem(item)
    closeMenu()
  }

  return (
    <div className='w-full h-[28px]'>
      <nav className='flex justify-between items-center'>
        <ul className='flex space-x-3 s:space-x-8 font-light text-body-12 s:text-body-16 l:text-body-18 text-greyscale-900'>
          <li className='flex flex-col'>
            <a href='#gallery' onClick={() => handleItemClick('gallery')}>
              {t('LANDING_REAL_ESTATE_GALLERY')}
            </a>
            {activeItem === 'gallery' && (
              <div className='w-2/3 border-b border-greyscale-900 self-start mb-4 mt-2' />
            )}
          </li>
          <li className='flex flex-col'>
            <a href='#facilities' onClick={() => handleItemClick('facilities')}>
              {t('LANDING_REAL_ESTATE_FACILITIES')}
            </a>
            {activeItem === 'facilities' && (
              <div className='w-2/3 border-b border-greyscale-900 self-start mb-4 mt-2' />
            )}
          </li>
          <li className='flex flex-col'>
            <a href='#floorplan' onClick={() => handleItemClick('floorplan')}>
              {t('LANDING_REAL_ESTATE_FLOORPLAN')}
            </a>
            {activeItem === 'floorplan' && (
              <div className='w-2/3 border-b border-greyscale-900 self-start mb-4 mt-2' />
            )}
          </li>
          <li className='flex flex-col'>
            <a href='#location' onClick={() => handleItemClick('location')}>
              {t('LANDING_REAL_ESTATE_LOCATION')}
            </a>
            {activeItem === 'location' && (
              <div className='w-2/3 border-b border-greyscale-900 self-start mb-4 mt-2' />
            )}
          </li>
        </ul>
      </nav>
    </div>
  )
}

const RoyalGardens: FC = observer(() => {
  const {t} = useTranslation()
  const [showModal, setShowModal] = useState(false)
  const {width} = useWindowSize()

  let marginGallery
  if (width < 768) {
    marginGallery = 16
  } else if (width < 1024) {
    marginGallery = (width - 704) / 2
  } else if (width < 1440) {
    marginGallery = (width - 944) / 2
  } else {
    marginGallery = (width - 1210) / 2
  }

  return (
    <>
      <div className='bg-greyscale-50'>
        <MetaTags title='Royal Gardens' />
        <div className='flex flex-col mx-4 s:mx-auto pt-8 s:w-[704px] m:w-[944px] l:w-[1210px]'>
          <div className='flex justify-between items-center mb-7 s:mb-14 m:mb-12 l:mb-16'>
            <Logo />
            <div className='flex space-x-5 items-center'>
              <div className='hidden s:block'>
                <BusinessButton />
              </div>
              <div className='hidden s:block'>
                <SafetyButton />
              </div>
              <LanguageSelect />
            </div>
          </div>
          <Navbar />
          <div className='w-full flex justify-between'>
            <div className='flex flex-col'>
              <h4 className='font-light text-greyscale-500 text-body-12 s:text-h-5 l:text-h-4 mt-8 s:mt-11 m:mt-14 l:mt-16'>
                {t('LANDING_REAL_ESTATE_PERFECT_HEALING')}
              </h4>
              <span
                className='py-2 s:py-3 l:py-8 s:mt-4 font-light leading-10 text-h-3 s:text-[60px] l:text-[90px] text-greyscale-900'
                dangerouslySetInnerHTML={{
                  __html: 'ROYAL <i>GARDENS</i>',
                }}
              />
            </div>

            <div className='hidden s:block self-end'>
              <LinkWrapper
                href='#book'
                title='Book a view'
                className=' self-center w-full'>
                <Button className='flex justify-between px-6 m:px-8 py-4 border border-greyscale-800 rounded-[32px] w-[165px] m:w-[192px] h-[56px] text-body-14 text-greyscale-800 font-light'>
                  {t('LANDING_REAL_ESTATE_BOOK')}
                  <IcArrow className='fill-current text-greyscale-900 h-6 w-6 rotate-180 shrink-0 ' />
                </Button>
              </LinkWrapper>
            </div>
          </div>

          <div className='flex flex-col-reverse s:flex-row s:mt-6 s:space-x-4 m:space-x-12 l:space-x-25 items-center justify-between'>
            <div className='flex flex-col text-body-14 m:text-body-16 space-y-2 s:space-y-4 l:space-y-6 text-greyscale-900 font-light'>
              <span className='block'>{t('RESIDENCE_ROYAL_GARDENS')}</span>
              <span className='block'>{t('RESIDENTIAL_COMPLEX')}</span>
              <span className='block'>
                {t('LANDING_REAL_ESTATE_MATERIALS')}
              </span>
              <span className='block'>
                {t('LANDING_REAL_ESTATE_SALES_AGREEMENT')}
              </span>
            </div>
            <div className='s:hidden mb-6 grid grid-cols-2 grid-rows-2 gap-x-12 gap-y-1 items-end place-items-center'>
              {property.map((feature) => (
                <div className='flex flex-col max-w-[104px]'>
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

            <div>
              <Button
                className='flex self-start relative w-[328px] h-[457px] s:w-[344px] s:h-[468px] m:w-[400px] m:h-[538px] l:w-[510px] l:h-[644px]'
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
              {showModal && (
                <ReactModal
                  isOpen={showModal}
                  onRequestClose={() => setShowModal(false)}
                  shouldCloseOnOverlayClick
                  ariaHideApp={false}
                  className='absolute h-full s:h-auto inset-x-0 mx-auto s:inset-x-8 m:inset-x-12 l:inset-x-24 s:top-14 m:top-20 l:top-14 flex outline-none flex flex-col'
                  overlayClassName='fixed inset-0 bg-shadow-overlay max-h-screen overflow-y-auto z-30'>
                  <Button
                    onClick={() => setShowModal(false)}
                    className='absolute top-14 s:top-5 right-5 cursor-pointer z-10'>
                    <IcClear className='fill-current text-greyscale-400 h-5 w-5 s:h-8 s:w-8' />
                  </Button>
                  <div className='flex flex-col w-full flex-1 overflow-hidden bg-white s:rounded-3xl'>
                    <div className='overflow-hidden h-full s:h-auto relative s:mx-16'>
                      <div className='flex h-full s:h-[364px] m:h-[504px] l:h-[746px]'>
                        <video
                          src='img/royal-garden/ROYAL_GARDENS.mp4'
                          // eslint-disable-next-line react/no-array-index-key
                          controls
                          disablePictureInPicture
                          muted
                          autoPlay
                          controlsList='nodownload noremoteplayback noplaybackrate'
                          className='min-w-full h-full px-16 '
                        />
                      </div>
                    </div>
                  </div>
                </ReactModal>
              )}
            </div>
          </div>
          <div className='s:hidden self-center mt-4'>
            <LinkWrapper
              href='#book'
              title='Book a view'
              className=' self-center w-full'>
              <Button className='flex justify-between px-6 m:px-8 py-4 border border-greyscale-800 rounded-[32px] w-[165px] m:w-[192px] h-[56px] text-body-14 text-greyscale-800 font-light'>
                {t('LANDING_REAL_ESTATE_BOOK')}
                <IcArrow className='fill-current text-greyscale-900 h-6 w-6 rotate-180 shrink-0 ' />
              </Button>
            </LinkWrapper>
          </div>
          <div className='hidden s:self-center s:flex s:mt-4 m:absolute m:top-[820px] l:top-[935px] s:w-[704px] m:w-[874px] bg-white'>
            <div className='flex s:space-x-8 m:space-x-10 py-8 s:px-3 m:px-8 items-end'>
              {property.map((feature) => (
                <div className='flex flex-col'>
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
          <div className='mt-12 m:mt-[256px]' id='gallery'>
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
          <div>
            <Gallery />
          </div>
          <div className='mt-6 m:mt-20 l:mt-35' id='facilities'>
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
                <div className='relative w-[328px] h-[230px] s:hidden'>
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
              <ul className='list-disc font-light mx-4 mt-4 m:mt-16 s:mx-0  text-greyscale-900 text-body-14 m:text-body-16'>
                {facilities.map((facilitie) => (
                  <li
                    className='mb-2 m:mb-4'
                    dangerouslySetInnerHTML={{
                      __html: t(facilitie.title),
                    }}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* <div className={`ml-[${marginGallery}px]`}> */}
      </div>
    </>
  )
})

export default RoyalGardens
