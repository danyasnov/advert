import {FC} from 'react'
import {useTranslation} from 'next-i18next'
import {observer} from 'mobx-react-lite'
import {useEmblaCarousel} from 'embla-carousel/react'
import {useRouter} from 'next/router'
import {useProductsStore} from '../../providers/RootStoreProvider'
import Card from './Card'
import TitleWithSeparator from '../TitleWithSeparator'
import useNestedEmblaCarousel from '../../hooks/useNestedEmblaCarousel'
import SliderButton from '../Buttons/SliderButton'
import useSliderButtons from '../../hooks/useSliderButtons'

const ProductsSlider: FC = observer(() => {
  const {t} = useTranslation()
  const router = useRouter()
  const {freeProducts: products} = useProductsStore()
  const [viewportRef, embla] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
  })
  const setLockParentScroll = useNestedEmblaCarousel(embla)

  const {scrollNext, scrollPrev, prevBtnEnabled, nextBtnEnabled} =
    useSliderButtons(embla)

  if (!products.length) return null

  return (
    // здесь div нужен для корректных отступов между секциями
    <div>
      <TitleWithSeparator title={t('FREE')} />
      <div className='relative'>
        <div className='overflow-hidden' ref={viewportRef}>
          <div className='flex space-x-2 s:space-x-4 mx-4 s:mx-8 m:mx-0'>
            {products.map((p) => (
              <button
                type='button'
                key={p.hash}
                className='relative'
                onClick={() => router.push(p.url)}>
                <Card product={p} setLockParentScroll={setLockParentScroll} />
              </button>
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
