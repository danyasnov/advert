import {FC, useEffect, useRef, useState} from 'react'
import ReactModal from 'react-modal'
import {useLockBodyScroll} from 'react-use'
import useEmblaCarousel from 'embla-carousel-react'
import {isEmpty, size} from 'lodash'
import IcClear from 'icons/material/Clear.svg'
import Button from '../Buttons/Button'
import ImageWrapper from '../ImageWrapper'
import FullHeightSliderButton from '../Buttons/FullHeightSliderButton'
import useSliderButtons from '../../hooks/useSliderButtons'
import {Thumb} from '../Thumb'
import {ThumbObject} from '../../types'

interface Props {
  isOpen: boolean
  onClose: () => void
  items: ThumbObject[]
  currentIndex: number
}

const PhotosModal: FC<Props> = ({isOpen, onClose, items, currentIndex}) => {
  useLockBodyScroll()
  const [activePhotoIndex, setActivePhotoIndex] = useState(currentIndex)
  const videosRef = useRef([])

  const [photoViewportRef, photoEmbla] = useEmblaCarousel({
    loop: true,
    align: 'start',
    containScroll: 'trimSnaps',
    draggable: items.length > 1,
    speed: 30,
    startIndex: currentIndex,
  })
  const [previewViewportRef, previewEmbla] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    draggable: items.length > 1,
    speed: 30,
    dragFree: true,
    loop: true,
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
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photoEmbla])
  if (isEmpty(items)) {
    return null
  }
  const showSlider = size(items) > 5
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick
      ariaHideApp={false}
      className='absolute h-full s:h-auto inset-x-0 mx-auto s:inset-x-8 m:inset-x-12 l:inset-x-24 s:top-14 m:top-20 l:top-14 outline-none flex flex-col'
      overlayClassName='fixed inset-0 bg-shadow-overlay max-h-screen overflow-y-auto z-30'>
      <Button
        onClick={onClose}
        className='absolute top-14 w-10 h-10 s:top-5 right-5 cursor-pointer z-10'>
        <IcClear className='fill-current text-greyscale-400 h-5 w-5 s:h-8 s:w-8' />
      </Button>
      <div className='flex flex-col w-full flex-1 overflow-hidden bg-white s:rounded-3xl'>
        <div
          className='overflow-hidden h-full s:h-auto relative s:mx-16'
          ref={photoViewportRef}>
          <div className='flex h-full s:h-[364px] m:h-[504px] l:h-[746px]'>
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
                <div // eslint-disable-next-line react/no-array-index-key
                  key={`${item.src}-${index}`}
                  className='relative min-w-full'>
                  <ImageWrapper
                    type={item.src}
                    layout='fill'
                    alt={item.src}
                    objectFit='contain'
                    priority={index === 0}
                  />
                </div>
              )
            })}
          </div>
        </div>
        {items.length > 1 && (
          <span className='absolute text-center w-full bottom-12 s:hidden text-greyscale-900 text-body-18 whitespace-nowrap'>
            {activePhotoIndex + 1} / {items.length}
          </span>
        )}
        <div className='hidden s:flex self-center h-full relative my-8'>
          <FullHeightSliderButton
            onClick={() => {
              previewEmbla.scrollTo(previewEmbla.selectedScrollSnap() - 3)
            }}
            enabled={previewSlider.prevBtnEnabled}
            direction='left'
            size={25}
            className='absolute inset-y-0 -left-20 l:w-24'
          />
          <div
            className='overflow-hidden s:w-[464px] m:w-[664px] l:w-[936px]'
            ref={showSlider ? previewViewportRef : null}>
            <div className={`flex ${showSlider ? '' : 'justify-center'}`}>
              {items.map((item, index) => (
                <div className='ml-4'>
                  <Thumb
                    url={item.src}
                    onHover={onHover}
                    index={index}
                    activePhotoIndex={activePhotoIndex}
                    type={item.type}
                    className='w-[104px] m:w-[135px] h-15 m:h-[72px]'
                  />
                </div>
              ))}
            </div>
          </div>
          <FullHeightSliderButton
            onClick={() => {
              previewEmbla.scrollTo(previewEmbla.selectedScrollSnap() + 3)
            }}
            enabled={previewSlider.nextBtnEnabled}
            direction='right'
            size={25}
            className='absolute inset-y-0 -right-20 l:w-24'
          />
        </div>
      </div>
      <FullHeightSliderButton
        onClick={photoSlider.scrollPrev}
        enabled={photoSlider.prevBtnEnabled}
        direction='left'
        size={40}
        className='absolute inset-y-0 left-0 l:w-24'
      />
      <FullHeightSliderButton
        onClick={photoSlider.scrollNext}
        enabled={photoSlider.nextBtnEnabled}
        direction='right'
        size={40}
        className='absolute inset-y-0 right-0 l:w-24'
      />
    </ReactModal>
  )
}

export default PhotosModal
