import {FC, useEffect, useState} from 'react'
import ReactModal from 'react-modal'
import {useLockBodyScroll} from 'react-use'
import {observer} from 'mobx-react-lite'
import {useEmblaCarousel} from 'embla-carousel/react'
import {isEmpty} from 'lodash'
import IcClear from 'icons/material/Clear.svg'
import Button from './Buttons/Button'
import ImageWrapper from './ImageWrapper'
import FullHeightSliderButton from './Buttons/FullHeightSliderButton'
import {useProductsStore} from '../providers/RootStoreProvider'
import useSliderButtons from '../hooks/useSliderButtons'
import Thumb from './Thumb'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const PhotosModal: FC<Props> = observer(({isOpen, onClose}) => {
  const {product} = useProductsStore()
  if (!product) return null
  useLockBodyScroll()
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
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      shouldCloseOnOverlayClick
      ariaHideApp={false}
      className='absolute w-full h-full l:w-5/6 l:h-95% l:top-5 inset-x-0 mx-auto flex outline-none flex flex-col'
      overlayClassName='fixed inset-0 bg-shadow-overlay max-h-screen overflow-y-auto z-20'>
      <Button
        onClick={onClose}
        className='absolute top-5 left-5 l:top-0 l:-right-10 cursor-pointer z-10'>
        <IcClear className='fill-current text-black-b l:text-white h-10 w-10' />
      </Button>
      <div className='flex flex-col w-full h-full bg-image-placeholder overflow-hidden'>
        <div className='overflow-hidden relative h-full' ref={viewportRef}>
          <div className='flex  h-full'>
            {product.advert.images.map((i, index) => (
              <div key={i} className='relative min-w-full'>
                <ImageWrapper
                  type={i}
                  layout='fill'
                  alt={i}
                  objectFit='contain'
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
          <FullHeightSliderButton
            onClick={scrollPrev}
            enabled={prevBtnEnabled}
            direction='left'
            className='absolute inset-y-0 left-0 hidden l:block'
          />
          <FullHeightSliderButton
            onClick={scrollNext}
            enabled={nextBtnEnabled}
            direction='right'
            className='absolute inset-y-0 right-0 hidden l:block'
          />
        </div>
      </div>
      {product.advert.images.length > 1 && (
        <div className='block l:hidden absolute right-1/2 left-1/2 bottom-5'>
          <span className='text-white bg-shadow-overlay rounded p-1 text-body-2 whitespace-nowrap'>
            {activePhotoIndex + 1} / {product.advert.images.length}
          </span>
        </div>
      )}
      <div className='mt-4 flex-row -mx-1 flex-wrap justify-center hidden l:flex'>
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
    </ReactModal>
  )
})

export default PhotosModal
