import {FC, useEffect, useRef} from 'react'
import {useHoverDirty} from 'react-use'
import IcPLay from 'icons/material/Play.svg'
import ImageWrapper from './ImageWrapper'

interface ThumbProps {
  url: string
  className: string
  onHover: (number) => void
  index: number
  activePhotoIndex: number
}
const styles = 'relative rounded-xl overflow-hidden shrink-0 border-[3px]'

export const PhotoThumb: FC<ThumbProps> = ({
  url,
  onHover,
  index,
  activePhotoIndex,
  className,
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
      className={`${styles} ${className} ${
        isHovering || activePhotoIndex === index
          ? 'border-primary-500'
          : 'border-transparent'
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
  className,
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
      className={`${styles} ${className} bg-black flex justify-center items-center border ${
        isHovering || activePhotoIndex === index
          ? 'border-primary-500'
          : 'border-transparent'
      }`}>
      <IcPLay className='fill-current text-white-b h-10 w-10' />
    </div>
  )
}

export const Thumb: FC<ThumbProps & {type: string}> = ({
  url,
  onHover,
  index,
  activePhotoIndex,
  type,
  className,
}) => {
  return type === 'video' ? (
    <VideoThumb
      url={url}
      // eslint-disable-next-line react/no-array-index-key
      onHover={onHover}
      index={index}
      activePhotoIndex={activePhotoIndex}
      className={className}
    />
  ) : (
    <PhotoThumb
      url={url}
      // eslint-disable-next-line react/no-array-index-key
      onHover={onHover}
      index={index}
      activePhotoIndex={activePhotoIndex}
      className={className}
    />
  )
}
