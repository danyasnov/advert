import {FC, ReactNode, useEffect, useRef} from 'react'
import {useTranslation} from 'next-i18next'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import ImageWrapper from './ImageWrapper'
import LinkWrapper from './Buttons/LinkWrapper'

const MainBanner: FC = () => {
  const {t} = useTranslation()

  return (
    <div className='flex flex-col'>
      <div className='flex flex-col space-y-4 sticky top-[32px]'>
        <VipBanner
          title={t('ROYAL_GARDENS_RESIDENCE')}
          description={t('SPACIOUS_COMPLEX')}
          link='/royal-gardens'
        />
        <Banner
          id='main-banner-1'
          title={t('PROMOTION_TITLE2')}
          titleColor='text-primary-500'
          description={t('PROMOTION_DESCRIPTION2')}
          descriptionColor='text-primary-500'
          link='/business'
        />
      </div>
    </div>
  )
}

const Banner: FC<{
  id: string
  title: string
  description: string
  titleColor: string
  descriptionColor: string
  link: string
}> = ({id, title, description, titleColor, descriptionColor, link}) => {
  return (
    <LinkWrapper href={link} title={title}>
      <div className='hidden m:block w-[280px] h-[380px] rounded-[32px] overflow-hidden relative'>
        <div className='absolute z-10 flex flex-col pt-10 pl-7'>
          <span
            className={`${titleColor} font-bold text-[28px] w-[200px] leading-7`}>
            {title}
          </span>
          <span className={`${descriptionColor} text-[22px] pt-1`}>
            {description}
          </span>
        </div>
        <ImageWrapper
          type={`/img/${id}.png`}
          alt='promo'
          width={280}
          height={380}
        />
      </div>
    </LinkWrapper>
  )
}

const photos = [
  '/img/vip-banner-1.png',
  '/img/vip-banner-2.png',
  '/img/vip-banner-3.png',
  '/img/vip-banner-4.png',
  '/img/vip-banner-5.png',
  '/img/vip-banner-6.png',
]

const VipBanner: FC<{
  title: string
  description: string
  link: string
}> = ({title, description, link}) => {
  const {t} = useTranslation()
  const [viewportRef] = useEmblaCarousel(
    {
      loop: true,
      containScroll: 'trimSnaps',
    },
    [Autoplay({delay: 10000})],
  )

  return (
    <LinkWrapper href={link} title={title}>
      <div
        className='bg-white hidden m:block w-[280px] h-[380px] rounded-[32px] overflow-hidden relative [-webkit-mask-image:-webkit-radial-gradient(white,black)]'
        ref={viewportRef}>
        <div className='flex relative'>
          {photos.map((photo) => (
            <div className='w-full rounded-t-[32px]' key={photo}>
              <ImageWrapper
                type={photo}
                layout='fixed'
                alt='vip-promo'
                width={280}
                height={254}
                objectFit='contain'
              />
            </div>
          ))}
        </div>

        <div className='absolute flex -left-16 top-7 bg-error w-[230px] py-3 overflow-hidden -rotate-45'>
          <span className='mx-auto text-body-18 text-white font-extrabold text-center'>
            {t('BEST_OFFER')}
          </span>
        </div>
        <div className='flex flex-col mt-2 px-6'>
          <span className='text-body-18 text-black font-semibold'>{title}</span>
          <span className='text-body-14 text-greyscale-600'>{description}</span>
          <span className='text-body-14 text-greyscale-600 font-medium mt-3'>
            {t('VIEW_NOW')}
          </span>
        </div>
      </div>
    </LinkWrapper>
  )
}

export default MainBanner
