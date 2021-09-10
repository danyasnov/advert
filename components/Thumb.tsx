import {FC, useEffect, useRef} from 'react'
import {useHoverDirty} from 'react-use'
import ImageWrapper from './ImageWrapper'

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
      className={`mx-1 mb-2 w-12 h-12 s:w-26 relative ${
        isHovering || activePhotoIndex === index
          ? 'border border-brand-a1'
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

export default Thumb
