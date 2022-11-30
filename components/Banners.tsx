import {FC, useEffect, useState} from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import {useTranslation} from 'next-i18next'
import {useWindowSize} from 'react-use'
import {observer} from 'mobx-react-lite'
import {useRouter} from 'next/router'
import Autoplay from 'embla-carousel-autoplay'
import {WheelGesturesPlugin} from 'embla-carousel-wheel-gestures'
import ImageWrapper from './ImageWrapper'
import Button from './Buttons/Button'
import {useGeneralStore} from '../providers/RootStoreProvider'

const Banners: FC = observer(() => {
  const {t} = useTranslation()
  const {locationCodes} = useGeneralStore()
  const {width} = useWindowSize()
  const banners = [
    {
      id: 'auto',
      title: 'BANNER1_TITLE',
      color: 'text-[#F75555]',
      path: `/${locationCodes}/vehicles/vehicles-cars`,
    },
    {
      id: 'business',
      title: 'BANNER2_TITLE',
      color: 'text-[#009689]',
      path: `/business`,
    },
    {
      id: 'community',
      title: 'BANNER3_TITLE',
      color: 'text-[#7210FF]',
      path: `/advert/create`,
    },
    {
      id: 'house',
      title: 'BANNER4_TITLE',
      color: 'text-[#7A5548]',
      path: `/${locationCodes}/property/property-rent?priceMax=1000`,
    },
    {
      id: 'land',
      title: 'BANNER5_TITLE',
      color: 'text-[#E97E00]',
      path: `/${locationCodes}/property/property-sale/property-sales-land`,
    },
  ]
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)

  const [viewportRef, embla] = useEmblaCarousel(
    {
      align: 0.04,
      loop: true,
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
        setCurrentIndex(embla.selectedScrollSnap() || 0)
      })
      if (width >= 2560) {
        embla.plugins().autoplay.stop()
      }
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
  return (
    <div className='overflow-hidden mb-8' ref={viewportRef}>
      <div className='flex shrink-0'>
        {banners.map((c) => (
          <Button
            onClick={() => {
              if (embla.clickAllowed()) {
                router.push(c.path)
              }
            }}
            key={`${c.id}-${imgSize}-${imgWidth}`}>
            <BannerItem
              title={t(c.title)}
              id={c.id}
              key={`${c.id}-${imgSize}-${imgWidth}`}
              imgWidth={imgWidth}
              imgSize={imgSize}
              color={c.color}
            />
          </Button>
        ))}
      </div>
      <div className='w-full flex justify-center space-x-1.5 mt-4'>
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
  title: string
  id: string
  imgWidth: number
  imgSize: string
  color: string
}> = ({title, id, imgWidth, imgSize, color}) => {
  return (
    <div className='w-[328px] s:w-[344px] m:w-[464px] l:w-[440px] h-[180px] shrink-0 rounded-[32px] overflow-hidden flex ml-4 relative'>
      <span
        className={`absolute z-10 top-[54px] left-[23px] s:top-[49px] m:left-[35px] text-body-16 font-semibold ${color} whitespace-pre-line`}>
        {title}
      </span>
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
