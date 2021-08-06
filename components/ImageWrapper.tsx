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
}) => {
  const [hide, setHide] = useState(false)
  if (!type || hide) return null
  return (
    // @ts-ignore
    <Image
      src={type}
      width={width}
      height={height}
      alt={alt}
      className={className}
      // @ts-ignore
      layout={layout}
      objectFit={objectFit}
      priority={priority}
      onError={() => {
        setHide(true)
      }}
    />
  )
}

export default ImageWrapper
