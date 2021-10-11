import {FC, useEffect, useState} from 'react'
import ReactModal from 'react-modal'
import {useLockBodyScroll} from 'react-use'
import {useEmblaCarousel} from 'embla-carousel/react'
import {isEmpty} from 'lodash'
import IcClear from 'icons/material/Clear.svg'
import Button from './Buttons/Button'
import ImageWrapper from './ImageWrapper'
import FullHeightSliderButton from './Buttons/FullHeightSliderButton'
import useSliderButtons from '../hooks/useSliderButtons'
import {Thumb, VideoThumb} from './Thumb'
import {ThumbObject} from '../types'

interface Props {
  isOpen: boolean
  onClose: () => void
  items: ThumbObject[]
}

const PhotosModal: FC<Props> = ({isOpen, onClose, items}) => {
  useLockBodyScroll()
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
  }
  const {scrollNext, scrollPrev, prevBtnEnabled, nextBtnEnabled} =
    useSliderButtons(embla)
  useEffect(() => {
    if (embla)
      embla.on('select', () => {
        setActivePhotoIndex(embla.selectedScrollSnap() || 0)
      })
  }, [embla])
  if (isEmpty(items)) return null

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick
      ariaHideApp={false}
      className='absolute w-full h-full l:w-5/6 l:h-95% l:top-5 inset-x-0 mx-auto flex outline-none flex flex-col'
      overlayClassName='fixed inset-0 bg-shadow-overlay max-h-screen overflow-y-auto z-20'>
      <Button
        onClick={onClose}
        className='absolute top-5 right-5 cursor-pointer z-10'>
        <IcClear className='fill-current text-black-b h-10 w-10' />
      </Button>
      <div className='flex flex-col w-full h-full bg-image-placeholder overflow-hidden'>
        <div className='overflow-hidden relative h-full' ref={viewportRef}>
          <div className='flex  h-full'>
            {/* @ts-ignore */}
            {items.map((item, index) => {
              if (item.type === 'video') {
                return (
                  // eslint-disable-next-line jsx-a11y/media-has-caption
                  <video
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
                <div key={item.src} className='relative min-w-full'>
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
      </div>
      {items.length > 1 && (
        <div className='block  absolute right-1/2 left-1/2 bottom-5 l:bottom-24'>
          <span className='text-white bg-shadow-overlay rounded p-1 text-body-2 whitespace-nowrap'>
            {activePhotoIndex + 1} / {items.length}
          </span>
        </div>
      )}
      <div className='mt-4 flex-row -mx-1 flex-wrap justify-center hidden l:flex'>
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
    </ReactModal>
  )
}

export default PhotosModal
