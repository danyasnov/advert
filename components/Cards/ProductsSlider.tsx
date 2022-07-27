import {FC, ReactNode} from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import {AdvertiseListItemModel} from 'front-api'
import Card from './Card'
import TitleWithSeparator from '../TitleWithSeparator'
import useNestedEmblaCarousel from '../../hooks/useNestedEmblaCarousel'
import SliderButton from '../Buttons/SliderButton'
import useSliderButtons from '../../hooks/useSliderButtons'
import LinkWrapper from '../Buttons/LinkWrapper'

interface Props {
  products: AdvertiseListItemModel[]
  title: string
  rightContent?: ReactNode
}

const ProductsSlider: FC<Props> = ({products, title, rightContent}) => {
  const [viewportRef, embla] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    slidesToScroll: 1,
  })
  const setLockParentScroll = useNestedEmblaCarousel(embla)

  const {scrollNext, scrollPrev, prevBtnEnabled, nextBtnEnabled} =
    useSliderButtons(embla)

  if (!products.length) return null
  if (window.location.hostname.includes('vooxee.com')) return null

  return (
    // здесь div нужен для корректных отступов между секциями
    <div>
      <TitleWithSeparator title={title} rightContent={rightContent} />
      <div className='relative'>
        <div className='overflow-hidden' ref={viewportRef}>
          <div className='flex space-x-2 s:space-x-4 mx-4 s:mx-8 m:mx-0'>
            {products.map((p) => (
              <LinkWrapper
                title={p.title}
                href={p.url}
                key={p.hash}
                target='_blank'>
                <Card product={p} setLockParentScroll={setLockParentScroll} />
              </LinkWrapper>
            ))}
          </div>
        </div>
        <SliderButton
          onClick={scrollPrev}
          hide={!prevBtnEnabled}
          direction='left'
          className='slider-button left-1 s:left-5 m:left-1 m:-left-4'
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
