import {FC, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import useEmblaCarousel from 'embla-carousel-react'
import {parseCookies} from 'nookies'
import ImageWrapper from './ImageWrapper'
import {
  useCategoriesStore,
  useGeneralStore,
} from '../providers/RootStoreProvider'
import TitleWithSeparator from './TitleWithSeparator'
import SliderButton from './Buttons/SliderButton'
import useSliderButtons from '../hooks/useSliderButtons'
import LinkWrapper from './Buttons/LinkWrapper'
import {SerializedCookiesState} from '../types'
import {getLocationCodes} from '../helpers'

const CategoriesSlider: FC = observer(() => {
  const {categoriesWithoutAll} = useCategoriesStore()
  const {locationCodes: defaultLocationCodes} = useGeneralStore()
  const [locationCodes, setLocationCodes] = useState(defaultLocationCodes)
  const cookies: SerializedCookiesState = parseCookies()

  const {t} = useTranslation()
  useEffect(() => {
    setLocationCodes(getLocationCodes())
  }, [cookies.cityId, cookies.regionId, cookies.countryId])
  const [viewportRef, embla] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
    loop: true,
  })
  const {scrollNext, scrollPrev, prevBtnEnabled, nextBtnEnabled} =
    useSliderButtons(embla)
  return (
    // здесь div нужен для корректных отступов между секциями
    <div>
      <TitleWithSeparator title={t('CATEGORIES')} />
      <div className='relative'>
        <div className='overflow-hidden' ref={viewportRef}>
          <div className='flex mx-4 s:mx-8  m:mx-0'>
            {categoriesWithoutAll.map((c) => (
              <LinkWrapper
                key={c.id}
                title={c.name}
                href={`/${locationCodes}/${c.slug}`}
                className='relative cursor-pointer mr-4'>
                <ImageWrapper
                  type={`/img/categories/${c.slug}.png`}
                  width={136}
                  height={136}
                  alt={c.name}
                  className='rounded-xl'
                  layout='fixed'
                />
                <p className='text-body-2 text-black-b text-center'>{c.name}</p>
              </LinkWrapper>
            ))}
          </div>
        </div>
        <SliderButton
          onClick={scrollPrev}
          hide={!prevBtnEnabled}
          direction='left'
          className='slider-button left-1 s:left-5 m:left-0'
        />
        <SliderButton
          onClick={scrollNext}
          hide={!nextBtnEnabled}
          direction='right'
          className='slider-button right-1 s:right-5 m:right-0'
        />
      </div>
    </div>
  )
})

export default CategoriesSlider
