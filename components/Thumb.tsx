import {FC, useEffect, useRef} from 'react'
import {useHoverDirty} from 'react-use'
import IcPLay from 'icons/material/Play.svg'
import ImageWrapper from './ImageWrapper'

interface ThumbProps {
  url: string
  onHover: (number) => void
  index: number
  activePhotoIndex: number
}
const className =
  'mx-1 s:mx-2 m:mx-3 l:mx-2 mb-2 s:mb-4 m:mb-6 l:mb-4 w-[104px] h-15 m:w-[135px] m:h-[72px] relative rounded-xl overflow-hidden'

export const Thumb: FC<ThumbProps> = ({
  url,
  onHover,
  index,
  activePhotoIndex,
}) => {
  const ref = useRef()

  const isHovering = useHoverDirty(ref)
  useEffect(() => {
    if (isHovering) {
      onHover(index)
    }
  }, [index, isHovering, onHover])
  return (
    <div
      className={`${className} ${
        isHovering || activePhotoIndex === index
          ? 'border border-primary-500'
          : 'border border-transparent'
      }`}
      ref={ref}>
      <ImageWrapper
        type={url}
        alt={url}
        layout='fill'
        key={url}
        objectFit='cover'
        priority
      />
    </div>
  )
}

export const VideoThumb: FC<ThumbProps> = ({
  index,
  onHover,
  activePhotoIndex,
}) => {
  const ref = useRef()

  const isHovering = useHoverDirty(ref)
  useEffect(() => {
    if (isHovering) {
      onHover(index)
    }
  }, [index, isHovering, onHover])
  return (
    <div
      ref={ref}
      className={`${className} bg-black flex justify-center items-center ${
        isHovering || activePhotoIndex === index
          ? 'border border-primary-500'
          : 'border border-transparent'
      }`}>
      <IcPLay className='fill-current text-white-b h-10 w-10' />
    </div>
  )
}
