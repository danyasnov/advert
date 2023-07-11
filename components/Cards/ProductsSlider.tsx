import {FC, ReactNode} from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import {AdvertiseListItemModel} from 'front-api'
import {WheelGesturesPlugin} from 'embla-carousel-wheel-gestures'
import Card from './Card'
import TitleWithSeparator from '../TitleWithSeparator'
import useNestedEmblaCarousel from '../../hooks/useNestedEmblaCarousel'
import SliderButton from '../Buttons/SliderButton'
import useSliderButtons from '../../hooks/useSliderButtons'

interface Props {
  products: AdvertiseListItemModel[]
  title: string
  rightContent?: ReactNode
}

const ProductsSlider: FC<Props> = ({products, title, rightContent}) => {
  const [viewportRef, embla] = useEmblaCarousel(
    {
      align: 'start',
      containScroll: 'trimSnaps',
      slidesToScroll: 1,
    },
    [WheelGesturesPlugin()],
  )
  const setLockParentScroll = useNestedEmblaCarousel(embla)

  const {scrollNext, scrollPrev, prevBtnEnabled, nextBtnEnabled} =
    useSliderButtons(embla)

  if (!products.length) return null

  return (
    <div>
      <TitleWithSeparator title={title} rightContent={rightContent} />
      <div className='relative'>
        <div className='overflow-hidden' ref={viewportRef}>
          <div className='flex space-x-2 s:space-x-4 mx-4 s:mx-8 m:mx-0'>
            {products.map((p) => (
              <div className='w-40 s:w-56 m:w-[194px] l:w-53 shrink-0'>
                <Card
                  key={p.hash}
                  product={p}
                  setLockParentScroll={setLockParentScroll}
                />
              </div>
            ))}
          </div>
        </div>
        <SliderButton
          onClick={scrollPrev}
          hide={!prevBtnEnabled}
          direction='left'
          className='slider-button left-1 s:left-5 m:-left-4'
        />
        <SliderButton
          onClick={scrollNext}
          hide={!nextBtnEnabled}
          direction='right'
          className='slider-button right-1 s:right-5 m:-right-4'
        />
      </div>
    </div>
  )
}

export default ProductsSlider
