import {FC, useEffect, useRef, useState} from 'react'
import {observer} from 'mobx-react-lite'
import useEmblaCarousel from 'embla-carousel-react'
import {isEmpty} from 'lodash'
import {useProductsStore} from '../providers/RootStoreProvider'
import ImageWrapper from './ImageWrapper'
import useSliderButtons from '../hooks/useSliderButtons'
import FullHeightSliderButton from './Buttons/FullHeightSliderButton'
import Button from './Buttons/Button'
import PhotosModal from './PhotosModal'
import {ThumbObject} from '../types'
import {Thumb, VideoThumb} from './Thumb'
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

  const [viewportRef, embla] = useEmblaCarousel({
    loop: true,
    align: 'start',
    containScroll: 'trimSnaps',
    draggable: items.length > 1,
    speed: 30,
  })

  const onHover = (index) => {
    setActivePhotoIndex(index)
    embla.scrollTo(index)
    if (
      index !== activePhotoIndex &&
      items[activePhotoIndex].type === 'video'
    ) {
      videosRef.current[activePhotoIndex].pause()
    }
  }
  const {scrollNext, scrollPrev, prevBtnEnabled, nextBtnEnabled} =
    useSliderButtons(embla)
  useEffect(() => {
    if (embla)
      embla.on('select', () => {
        const newIndex = embla.selectedScrollSnap() ?? 0
        setActivePhotoIndex((prevIndex) => {
          if (newIndex !== prevIndex && items[prevIndex].type === 'video') {
            videosRef.current[prevIndex].pause()
          }
          return newIndex
        })
        setCurrentIndex(newIndex)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [embla])

  return (
    <div className='relative'>
      <div className='absolute right-4 top-4 s:right-7 s:top-7 z-9'>
        <ProductBadge />
      </div>
      <div className='overflow-hidden relative rounded-xl' ref={viewportRef}>
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
            {items.map((i, index) => (
              <div
                key={i.src}
                className={`w-2 h-2 rounded-full ${
                  currentIndex === index ? 'bg-primary-500' : 'bg-greyscale-100'
                }`}
              />
            ))}
          </div>
        )}
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

      <div className='flex mt-3 s:mt-4 flex-row -mx-1 s:-mx-2 m:-mx-3 l:-mx-2 flex-wrap'>
        {items.map((item, index) =>
          item.type === 'video' ? (
            <VideoThumb
              url={item.src}
              // eslint-disable-next-line react/no-array-index-key
              key={`${item.src}-${index}`}
              onHover={onHover}
              index={index}
              activePhotoIndex={activePhotoIndex}
            />
          ) : (
            <Thumb
              url={item.src}
              // eslint-disable-next-line react/no-array-index-key
              key={`${item.src}-${index}`}
              onHover={onHover}
              index={index}
              activePhotoIndex={activePhotoIndex}
            />
          ),
        )}
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
