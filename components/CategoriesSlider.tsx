import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {useEmblaCarousel} from 'embla-carousel/react'
import ImageWrapper from './ImageWrapper'
import {useCategoriesStore} from '../providers/RootStoreProvider'
import TitleWithSeparator from './TitleWithSeparator'
import SliderButton from './Buttons/SliderButton'
import useSliderButtons from '../hooks/useSliderButtons'

const CategoriesSlider: FC = observer(() => {
  const {categoriesWithoutAll} = useCategoriesStore()
  const {t} = useTranslation()
  const [viewportRef, embla] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
  })
  const {
    scrollNext,
    scrollPrev,
    prevBtnEnabled,
    nextBtnEnabled,
  } = useSliderButtons(embla)
  return (
    // здесь div нужен для корректных отступов между секциями
    <div>
      <TitleWithSeparator title={t('CATEGORIES')} />
      <div className='relative'>
        <div className='overflow-hidden' ref={viewportRef}>
          <div className='flex space-x-4 mx-4 s:mx-8  m:mx-0'>
            {categoriesWithoutAll.map((c) => (
              <div key={c.id} className='relative'>
                <ImageWrapper
                  type={`/img/categories/${c.slug}.jpg`}
                  width={136}
                  height={136}
                  alt={c.name}
                  className='rounded-xl'
                  layout='fixed'
                />
                <p className='text-body-2 text-black-b text-center'>{c.name}</p>
              </div>
            ))}
          </div>
        </div>
        <SliderButton
          onClick={scrollPrev}
          enabled={prevBtnEnabled}
          direction='left'
          className='slider-button left-1 s:left-5 m:left-0'
        />
        <SliderButton
          onClick={scrollNext}
          enabled={nextBtnEnabled}
          direction='right'
          className='slider-button right-1 s:right-5 m:right-0'
        />
      </div>
    </div>
  )
})

export default CategoriesSlider