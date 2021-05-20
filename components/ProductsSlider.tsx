import {FC, useCallback, useEffect, useState} from 'react'
import {useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import {toJS} from 'mobx'
import {useEmblaCarousel} from 'embla-carousel/react'
import {useProductsStore} from '../providers/RootStoreProvider'
import Card from './Card'
import TitleWithSeparator from './TitleWithSeparator'
import useNestedEmblaCarousel from '../hooks/useNestedEmblaCarousel'
import SliderButton from './SliderButton'

const ProductsSlider: FC = observer(() => {
  const {t} = useTranslation()
  const store = useProductsStore()
  const products = toJS(store.products)
  const [viewportRef, embla] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
  })
  const setLockParentScroll = useNestedEmblaCarousel(embla)
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
    <div>
      <TitleWithSeparator title={t('FREE')} />
      <div className='relative'>
        <div className='overflow-hidden' ref={viewportRef}>
          <div className='flex space-x-2 s:space-x-4 mx-4 s:mx-8 m:mx-0'>
            {products.map((p) => (
              <div key={p.hash} className='relative'>
                <Card product={p} setLockParentScroll={setLockParentScroll} />
              </div>
            ))}
          </div>
        </div>
        <SliderButton
          onClick={scrollPrev}
          enabled={prevBtnEnabled}
          direction='left'
          className='slider-button left-1 s:left-5 m:left-1 m:-left-4'
        />
        <SliderButton
          onClick={scrollNext}
          enabled={nextBtnEnabled}
          direction='right'
          className='slider-button right-1 s:right-5 m:-right-4'
        />
      </div>
    </div>
  )
})

export default ProductsSlider
