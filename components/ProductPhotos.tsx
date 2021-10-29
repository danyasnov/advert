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
import ExclusiveMark from './ExclusiveMark'
import {ThumbObject} from '../types'
import {Thumb, VideoThumb} from './Thumb'

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
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [embla])

  return (
    <div className='relative'>
      {product.advert.isExclusive && (
        <div className='absolute left-4 top-5 z-30'>
          <ExclusiveMark />
        </div>
      )}
      <div className='overflow-hidden relative' ref={viewportRef}>
        <div className='flex w-full h-250px s:h-100'>
          {/* @ts-ignore */}
          {items.map((item, index) => {
            if (item.type === 'video') {
              return (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video
                  ref={(node) => {
                    videosRef.current[index] = node
                  }}
                  src={item.src}
                  key={item.src}
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
                key={item.src}
                className='relative min-w-full bg-image-placeholder'
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
        {items.map((item, index) =>
          item.type === 'video' ? (
            <VideoThumb
              url={item.src}
              key={item.src}
              onHover={onHover}
              index={index}
              activePhotoIndex={activePhotoIndex}
            />
          ) : (
            <Thumb
              url={item.src}
              key={item.src}
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
