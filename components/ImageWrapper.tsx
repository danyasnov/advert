import {FC, useState} from 'react'
import Image from 'next/image'

interface Props {
  type: string
  alt: string
  id?: string
  className?: string
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  layout?: 'fixed' | 'intrinsic' | 'responsive' | 'fill'
  width?: number
  height?: number
  quality?: number
  priority?: boolean
  style?: Record<string, unknown>
  fallbackUrl?: string | string[]
  onLoadingComplete?: (size: {
    naturalWidth: number
    naturalHeight: number
  }) => void
}

const ImageWrapper: FC<Props> = ({
  type,
  width,
  height,
  className,
  layout,
  alt,
  objectFit,
  priority,
  fallbackUrl,
  id,
  onLoadingComplete,
  quality,
  style,
}) => {
  const [hide, setHide] = useState(false)
  const [imgSrc, setImgSrc] = useState(type)
  const [fallbackIndex, setFallbackIndex] = useState(0)
  if (!type || hide) return null
  return (
    <Image
      style={style}
      quality={quality}
      src={imgSrc}
      width={width}
      height={height}
      alt={alt}
      className={`${className || ''} relative`}
      layout={layout}
      objectFit={objectFit}
      priority={priority}
      onLoadingComplete={onLoadingComplete}
      id={id}
      onError={() => {
        if (fallbackUrl) {
          if (Array.isArray(fallbackUrl)) {
            setImgSrc(fallbackUrl[fallbackIndex])
            setFallbackIndex(fallbackIndex + 1)
          } else {
            setImgSrc(fallbackUrl)
          }
        } else {
          setHide(true)
        }
      }}
    />
  )
}

export default ImageWrapper
