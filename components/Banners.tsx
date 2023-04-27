import {FC, useEffect, useState} from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import {useTranslation} from 'next-i18next'
import {useWindowSize} from 'react-use'
import {observer} from 'mobx-react-lite'
import {useRouter} from 'next/router'
import Autoplay from 'embla-carousel-autoplay'
import {WheelGesturesPlugin} from 'embla-carousel-wheel-gestures'
import IcRoyal from 'icons/Royal.svg'
import ImageWrapper from './ImageWrapper'
import Button from './Buttons/Button'
import {useGeneralStore, useUserStore} from '../providers/RootStoreProvider'
import {handleMetrics} from '../helpers'

const Banners: FC = observer(() => {
  const {t} = useTranslation()
  const {locationCodes, setShowLogin, user} = useGeneralStore()
  const {width} = useWindowSize()
  const router = useRouter()
  const banners = [
    {
      id: 'royalgarden',
      title: () => {
        return (
          <div className='flex flex-col absolute z-10 inset-0 my-auto font-semibold text-white whitespace-pre-line h-full justify-center items-center'>
            <div className='w-[37px] h-[37px]'>
              <IcRoyal />
            </div>
            <p className='text-body-18 font-semibold mb-4 whitespace-pre-line'>
              {t('BANNER9_TITLE')}
            </p>
            <p className='text-body-12 font-medium'>
              {t('BANNER9_DESCRIPTION')}
            </p>
          </div>
        )
      },
      onClick: () => {
        handleMetrics('clickPromo', {banner: 'royalgarden'})
        router.push(`/royal-gardens`)
      },
    },
    {
      id: 'auto',
      title: 'BANNER1_TITLE',
      color: 'text-[#F75555]',
      onClick: () => {
        handleMetrics('clickPromo', {banner: 'auto'})

        router.push(`/${locationCodes}/vehicles/vehicles-cars`)
      },
    },
    {
      id: 'business',
      title: 'BANNER2_TITLE',
      color: 'text-[#009689]',
      onClick: () => {
        handleMetrics('clickPromo', {banner: 'business'})

        router.push(`/business`)
      },
    },
    {
      id: 'community',
      title: 'BANNER3_TITLE',
      color: 'text-[#7210FF]',
      onClick: () => {
        handleMetrics('clickPromo', {banner: 'community'})

        if (user) {
          router.push(`/advert/create`)
        } else {
          setShowLogin(true)
        }
      },
    },
    {
      id: 'house',
      title: 'BANNER4_TITLE',
      color: 'text-[#7A5548]',
      onClick: () => {
        handleMetrics('clickPromo', {
          banner: 'property-rent',
        })

        router.push(`/${locationCodes}/property/property-rent?priceMax=1000`)
      },
    },
    {
      id: 'land',
      title: 'BANNER5_TITLE',
      color: 'text-[#E97E00]',
      onClick: () => {
        handleMetrics('clickPromo', {
          banner: 'property-sales-land',
        })

        router.push(
          `/${locationCodes}/property/property-sale/property-sales-land`,
        )
      },
    },
    {
      id: 'beauty',
      title: 'BANNER6_TITLE',
      color: 'text-[#F75555]',
      onClick: () => {
        handleMetrics('clickPromo', {banner: 'beauty'})

        router.push(`/${locationCodes}/health-and-beauty`)
      },
    },
    {
      id: 'electronics',
      title: 'BANNER7_TITLE',
      color: 'text-[#7210FF]',
      onClick: () => {
        handleMetrics('clickPromo', {
          banner: 'electronics',
        })

        router.push(`/${locationCodes}/electronics`)
      },
    },
    {
      id: 'autoparts',
      title: 'BANNER8_TITLE',
      color: 'text-[#7A5548]',
      onClick: () => {
        handleMetrics('clickPromo', {banner: 'autoparts'})

        router.push(
          `/${locationCodes}/vehicles/vehicles-autoparts-autoaccessories`,
        )
      },
    },
  ]
  const [currentIndex, setCurrentIndex] = useState(0)

  const [viewportRef, embla] = useEmblaCarousel(
    {
      align: 0.04,
      loop: true,
      dragFree: true,
      containScroll: 'trimSnaps',
      breakpoints: {
        '(min-width: 768px)': {
          align: 0.04,
        },
        '(min-width: 1024px)': {
          align: 0.08,
        },
        '(min-width: 1440px)': {
          align: 0.11,
        },
      },
    },
    [Autoplay({delay: 5000}), WheelGesturesPlugin()],
  )
  useEffect(() => {
    if (embla) {
      embla.on('select', () => {
        const index = embla.selectedScrollSnap() || 0
        setCurrentIndex(index > 7 ? index - 8 : index)
      })
    }
  }, [embla])

  let imgSize
  let imgWidth
  if (width < 768) {
    imgSize = `xs`
    imgWidth = 328
  } else if (width < 1024) {
    imgSize = `s`
    imgWidth = 344
  } else if (width < 1440) {
    imgSize = `m`
    imgWidth = 464
  } else {
    imgSize = `l`
    imgWidth = 440
  }
  const is4k = width >= 2560
  return (
    <div className='overflow-hidden mb-8' ref={is4k ? null : viewportRef}>
      <div className={`flex shrink-0 ${is4k ? 'justify-center' : ''}`}>
        {[...banners, ...(is4k ? [] : banners)].map((c, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div className='ml-4' key={`${c.id}-${imgSize}-${imgWidth}-${index}`}>
            <Button
              onClick={() => {
                if (embla.clickAllowed()) {
                  c.onClick()
                }
              }}
              key={`${c.id}-${imgSize}-${imgWidth}`}>
              <BannerItem
                title={c.title}
                id={c.id}
                imgWidth={imgWidth}
                imgSize={imgSize}
                color={c.color}
              />
            </Button>
          </div>
        ))}
      </div>
      <div className='w-full flex justify-center space-x-1.5 mt-4 xxl:hidden'>
        {banners.map((banner, index) => (
          <Button
            onClick={() => {
              embla.scrollTo(index)
            }}>
            <div
              key={banner.id}
              className={`w-2 h-2 rounded-full ${
                currentIndex === index ? 'bg-primary-500' : 'bg-greyscale-300'
              }`}
            />
          </Button>
        ))}
      </div>
    </div>
  )
})

const BannerItem: FC<{
  title: string | (() => JSX.Element)
  id: string
  imgWidth: number
  imgSize: string
  color: string
}> = ({title, id, imgWidth, imgSize, color}) => {
  const {t} = useTranslation()
  let displayTitle
  switch (typeof title) {
    case 'string': {
      displayTitle = (
        <span
          className={`absolute z-10 top-[54px] left-[23px] s:top-[49px] m:left-[35px] text-body-16 font-semibold ${color} whitespace-pre-line`}>
          {t(title)}
        </span>
      )
      break
    }
    case 'function': {
      displayTitle = title()
      break
    }
    default: {
      displayTitle = null
    }
  }
  return (
    <div className='w-[328px] s:w-[344px] m:w-[464px] l:w-[440px] h-[180px] shrink-0 rounded-[32px] overflow-hidden flex relative'>
      {displayTitle}
      <div className='flex flex-1'>
        <ImageWrapper
          type={`/img/banners/${id}-${imgSize}.png`}
          alt={id}
          width={imgWidth}
          height={180}
        />
      </div>
    </div>
  )
}

export default Banners
