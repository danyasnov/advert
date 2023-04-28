import {FC, useEffect, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import useEmblaCarousel from 'embla-carousel-react'
import {isEmpty, size} from 'lodash'
import {useProductsStore} from '../providers/RootStoreProvider'
import ImageWrapper from './ImageWrapper'
import useSliderButtons from '../hooks/useSliderButtons'
import FullHeightSliderButton from './Buttons/FullHeightSliderButton'
import Button from './Buttons/Button'
import PhotosModal from './Modals/PhotosModal'
import {ThumbObject} from '../types'
import {Thumb} from './Thumb'
import ProductBadge from './ProductBadge'

const getItems = (items = [], type) => items.map((i) => ({src: i, type}))

const ProductPhotos: FC = observer(() => {
  const {product} = useProductsStore()
  if (!product) return null
  const items = [
    // @ts-ignore
    ...getItems(product.advert?.videos, 'video'),
    ...getItems(product.advert.images, 'image'),
  ]
  if (isEmpty(items)) {
    return null
  }
  const videosRef = useRef([])

  const [showModal, setShowModal] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const [activePhotoIndex, setActivePhotoIndex] = useState(0)

  const [viewportRef, photoEmbla] = useEmblaCarousel({
    loop: true,
    align: 'start',
    containScroll: 'trimSnaps',
    draggable: items.length > 1,
    speed: 30,
  })
  const [previewViewportRef, previewEmbla] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    draggable: items.length > 1,
    speed: 30,
    dragFree: true,
    loop: true,
    inViewThreshold: 0.5,
  })
  const onHover = (index) => {
    setActivePhotoIndex(index)
    photoEmbla.scrollTo(index)
    if (
      index !== activePhotoIndex &&
      items[activePhotoIndex].type === 'video'
    ) {
      videosRef.current[activePhotoIndex].pause()
    }
  }
  const photoSlider = useSliderButtons(photoEmbla)
  const previewSlider = useSliderButtons(previewEmbla)

  useEffect(() => {
    if (photoEmbla)
      photoEmbla.on('select', () => {
        const newIndex = photoEmbla.selectedScrollSnap() ?? 0
        setActivePhotoIndex((prevIndex) => {
          if (newIndex !== prevIndex && items[prevIndex].type === 'video') {
            videosRef.current[prevIndex].pause()
          }
          return newIndex
        })
        if (previewEmbla && previewEmbla.slidesNotInView().includes(newIndex)) {
          previewEmbla.scrollTo(newIndex)
        }
        setCurrentIndex(newIndex)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoEmbla])

  return (
    <div className='relative'>
      <div className='absolute right-4 top-4 s:right-7 s:top-7 z-9'>
        <ProductBadge />
      </div>
      <div
        className='overflow-hidden relative rounded-3xl mb-2 s:mb-4 [-webkit-mask-image:-webkit-radial-gradient(white,black)]'
        ref={viewportRef}>
        <div className='flex w-full h-[180px] s:h-[257px] m:h-[340px] l:h-[504px]'>
          {items.map((item, index) => {
            if (item.type === 'video') {
              return (
                <video
                  ref={(node) => {
                    videosRef.current[index] = node
                  }}
                  src={item.src}
                  // eslint-disable-next-line react/no-array-index-key
                  key={`${item.src}-${index}`}
                  controls
                  disablePictureInPicture
                  muted
                  controlsList='nodownload noremoteplayback noplaybackrate'
                  className='min-w-full h-full px-16 '
                />
              )
            }
            return (
              <Button
                // eslint-disable-next-line react/no-array-index-key
                key={`${item.src}-${index}`}
                className='relative min-w-full bg-image-placeholder '
                onClick={() => {
                  setShowModal(true)
                  setCurrentIndex(index)
                }}>
                <ImageWrapper
                  type={item.src}
                  layout='fill'
                  alt={item.src}
                  objectFit='contain'
                  priority={index === 0}
                />
              </Button>
            )
          })}
        </div>
        {!!items.length && (
          <div className='absolute bottom-4 w-full flex justify-center space-x-2'>
            {size(items) > 1 &&
              items.map((i, index) => (
                <div
                  key={i.src}
                  className={`w-2 h-2 rounded-full ${
                    currentIndex === index
                      ? 'bg-primary-500'
                      : 'bg-greyscale-100'
                  }`}
                />
              ))}
          </div>
        )}
        <FullHeightSliderButton
          size={40}
          onClick={photoSlider.scrollPrev}
          enabled={photoSlider.prevBtnEnabled}
          direction='left'
          className='absolute inset-y-0 left-0'
        />
        <FullHeightSliderButton
          size={40}
          onClick={photoSlider.scrollNext}
          enabled={photoSlider.nextBtnEnabled}
          direction='right'
          className='absolute inset-y-0 right-0'
        />
      </div>

      <div className='flex items-center'>
        <FullHeightSliderButton
          onClick={() => {
            previewEmbla.scrollTo(previewEmbla.selectedScrollSnap() - 3)
          }}
          enabled={previewSlider.prevBtnEnabled}
          direction='left'
          size={25}
          className='text-greyscale-400'
        />
        {size(items) > 1 && (
          <div className='overflow-hidden mx-2 l:mx-0' ref={previewViewportRef}>
            <div className='flex w-full'>
              {items.map((item, index) => (
                <div className='mr-1.5 s:mr-2.5 m:mr-3 l:mr-2.5'>
                  <Thumb
                    url={item.src}
                    onHover={onHover}
                    index={index}
                    activePhotoIndex={activePhotoIndex}
                    type={item.type}
                    className='w-[88px] h-[48px] s:w-[91px] s:h-[54px] m:w-[129px] m:h-16'
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        <FullHeightSliderButton
          onClick={() => {
            previewEmbla.scrollTo(previewEmbla.selectedScrollSnap() + 3)
          }}
          enabled={previewSlider.nextBtnEnabled}
          direction='right'
          size={25}
          className='text-greyscale-400'
        />
      </div>

      {showModal && (
        <PhotosModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          items={items as ThumbObject[]}
          currentIndex={currentIndex}
        />
      )}
    </div>
  )
})

export default ProductPhotos
