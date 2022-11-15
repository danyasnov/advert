import {FC, useEffect, useState} from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import {useTranslation} from 'next-i18next'
import {useWindowSize} from 'react-use'
import ImageWrapper from './ImageWrapper'

const banners = [
  {
    id: 'auto',
    title: 'BANNER1_TITLE',
  },
  {
    id: 'business',
    title: 'BANNER2_TITLE',
  },
  {
    id: 'community',
    title: 'BANNER3_TITLE',
  },
  {
    id: 'house',
    title: 'BANNER4_TITLE',
  },
  {
    id: 'land',
    title: 'BANNER5_TITLE',
  },
]
const Banners: FC = () => {
  const {t} = useTranslation()

  const [viewportRef] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
    loop: true,
  })
  return (
    <div className='overflow-hidden' ref={viewportRef}>
      <div className='flex'>
        {banners.map((c) => (
          <BannerItem title={t(c.title)} id={c.id} key={c.id} />
        ))}
      </div>
    </div>
  )
}

const BannerItem: FC<{title: string; id: string}> = ({title, id}) => {
  const {width} = useWindowSize()
  let img
  if (width <= 768) {
    img = `${id}-xs`
  } else if (width <= 1024) {
    img = `${id}-x`
  } else if (width <= 1440) {
    img = `${id}-m`
  } else {
    img = `${id}-l`
  }
  return (
    <div className='w-[328px] h-[180px] s:w-[344px] m:w-[464px] l:w-[440px] relative'>
      123
      <ImageWrapper
        type={`/img/banners/${img}.png`}
        alt={img}
        quality={100}
        layout='fill'
      />
    </div>
  )
}

export default Banners
