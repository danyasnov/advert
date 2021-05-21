import {FC, useCallback, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {toJS} from 'mobx'
import {useTranslation} from 'next-i18next'
import {useEmblaCarousel} from 'embla-carousel/react'
import ImageWrapper from './ImageWrapper'
import {useCategoriesStore} from '../providers/RootStoreProvider'
import TitleWithSeparator from './TitleWithSeparator'
import SliderButton from './SliderButton'

const CategoriesSlider: FC = observer(() => {
  const store = useCategoriesStore()
  const {t} = useTranslation()
  const [viewportRef, embla] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
  })
  const categories = toJS(store.categoriesWithoutAll)
  // todo вынести управление слайдером в отдельный хук
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)

  const scrollPrev = useCallback(() => embla && embla.scrollPrev(), [embla])
  const scrollNext = useCallback(() => embla && embla.scrollNext(), [embla])
  const onSelect = useCallback(() => {
    if (!embla) return
    setPrevBtnEnabled(embla.canScrollPrev())
    setNextBtnEnabled(embla.canScrollNext())
  }, [embla])

  useEffect(() => {
    if (!embla) return
    embla.on('select', onSelect)
    onSelect()
  }, [embla, onSelect])
  return (
    // здесь div нужен для корректных отступов между секциями
    <div>
      <TitleWithSeparator title={t('CATEGORIES')} />
      <div className='relative'>
        <div className='overflow-hidden' ref={viewportRef}>
          <div className='flex space-x-4 mx-4 s:mx-8  m:mx-0'>
            {categories.map((c) => (
              <div key={c.id} className='relative'>
                <ImageWrapper
                  type={`/img/categories/${c.slug}.jpg`}
                  width={136}
                  height={136}
                  alt={c.name}
                  className='rounded-xl'
                  layout='fixed'
                />
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
