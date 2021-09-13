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
  fallbackUrl?: string
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
          setImgSrc(fallbackUrl)
        } else {
          setHide(true)
        }
      }}
    />
  )
}

export default ImageWrapper
