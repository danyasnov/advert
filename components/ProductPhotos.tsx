import {FC, useEffect, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useEmblaCarousel} from 'embla-carousel/react'
import {useHoverDirty} from 'react-use'
import {useProductsStore} from '../providers/RootStoreProvider'
import ImageWrapper from './ImageWrapper'
import useSliderButtons from '../hooks/useSliderButtons'
import FullHeightSliderButton from './Buttons/FullHeightSliderButton'

const ProductPhotos: FC = observer(() => {
  const {product} = useProductsStore()
  if (!product) return null

  const [activePhotoIndex, setActivePhotoIndex] = useState(0)

  const [viewportRef, embla] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    draggable: product.advert.images.length > 1,
    speed: 30,
  })

  const onHover = (index) => {
    setActivePhotoIndex(index)
    embla.scrollTo(index)
  }
  const {scrollNext, scrollPrev, prevBtnEnabled, nextBtnEnabled} =
    useSliderButtons(embla)
  useEffect(() => {
    if (embla)
      embla.on('select', () => {
        setActivePhotoIndex(embla.selectedScrollSnap() || 0)
      })
  }, [embla])
  return (
    <div>
      <div className='overflow-hidden relative' ref={viewportRef}>
        <div className='flex w-896px h-596px bg-image-placeholder'>
          {product.advert.images.map((i) => (
            <div key={i} className='relative min-w-full'>
              <ImageWrapper
                type={i}
                width={896}
                height={596}
                alt={i}
                objectFit='contain'
              />
            </div>
          ))}
        </div>
        <FullHeightSliderButton
          onClick={scrollPrev}
          enabled={prevBtnEnabled}
          direction='left'
          className='absolute inset-y-0 left-0'
        />
        <FullHeightSliderButton
          onClick={scrollNext}
          enabled={nextBtnEnabled}
          direction='right'
          className='absolute inset-y-0 right-0'
        />
      </div>
      <div className='flex mt-4 flex-row  -mx-1 flex-wrap'>
        {product.advert.images.length > 1 &&
          product.advert.images.map((i, index) => (
            <Thumb
              url={i}
              key={i}
              onHover={onHover}
              index={index}
              activePhotoIndex={activePhotoIndex}
            />
          ))}
      </div>
    </div>
  )
})

interface ThumbProps {
  url: string
  onHover: (number) => void
  index: number
  activePhotoIndex: number
}

const Thumb: FC<ThumbProps> = ({url, onHover, index, activePhotoIndex}) => {
  const ref = useRef()

  const isHovering = useHoverDirty(ref)
  useEffect(() => {
    if (isHovering) {
      onHover(index)
    }
  }, [index, isHovering, onHover])
  return (
    <div
      style={{width: '105px', height: '90px'}}
      className={`mx-1 mb-2 ${
        isHovering || activePhotoIndex === index
          ? 'border-4 border-brand-a1'
          : 'border-4 border-transparent'
      }`}
      ref={ref}>
      <ImageWrapper
        type={url}
        alt={url}
        width={105}
        height={90}
        key={url}
        objectFit='cover'
      />
    </div>
  )
}

export default ProductPhotos