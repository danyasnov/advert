import {FC, useEffect, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useEmblaCarousel} from 'embla-carousel/react'
import {useHoverDirty} from 'react-use'
import {isEmpty} from 'lodash'
import {useProductsStore} from '../providers/RootStoreProvider'
import ImageWrapper from './ImageWrapper'
import useSliderButtons from '../hooks/useSliderButtons'
import FullHeightSliderButton from './Buttons/FullHeightSliderButton'
import Button from './Buttons/Button'
import PhotosModal from './PhotosModal'
import Thumb from './Thumb'

const ProductPhotos: FC = observer(() => {
  const {product} = useProductsStore()
  if (!product) return null
  const [showModal, setShowModal] = useState(false)

  const [activePhotoIndex, setActivePhotoIndex] = useState(0)

  const [viewportRef, embla] = useEmblaCarousel({
    loop: true,
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
  if (isEmpty(product.advert.images)) return null
  return (
    <div>
      <div className='overflow-hidden relative' ref={viewportRef}>
        <div className='flex w-full h-250px s:h-100 bg-image-placeholder'>
          {product.advert.images.map((i, index) => (
            <Button
              key={i}
              className='relative min-w-full'
              onClick={() => setShowModal(true)}>
              <ImageWrapper
                type={i}
                layout='fill'
                alt={i}
                objectFit='contain'
                priority={index === 0}
              />
            </Button>
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
      <div className='flex mt-4 flex-row -mx-1 flex-wrap'>
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
      <PhotosModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  )
})

export default ProductPhotos
