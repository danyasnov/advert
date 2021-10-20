import {FC, useState} from 'react'
import Image from 'next/image'

interface Props {
  type: string
  alt: string
  className?: string
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  layout?: 'fixed' | 'intrinsic' | 'responsive' | 'fill'
  width?: number
  height?: number
  priority?: boolean
  fallbackUrl?: string | string[]
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
}) => {
  const [hide, setHide] = useState(false)
  const [imgSrc, setImgSrc] = useState(type)
  const [fallbackIndex, setFallbackIndex] = useState(0)
  if (!type || hide) return null
  return (
    // @ts-ignore
    <Image
      src={imgSrc}
      width={width}
      height={height}
      alt={alt}
      className={className}
      // @ts-ignore
      layout={layout}
      objectFit={objectFit}
      priority={priority}
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
