import {FC, useEffect, useState} from 'react'
import {useWindowSize} from 'react-use'

import ImageWrapper from './ImageWrapper'

interface Props {
  url: string
  alt: string
  fallbackUrl?: string | string[]
}
const getImageUrl = (url, screenWidth): string => {
  if (!screenWidth) return url
  if (screenWidth < 768) {
    return url.replace('original', '160_160')
  }
  if (screenWidth >= 768 && screenWidth < 1024) {
    return url.replace('original', '224_224')
  }
  if (screenWidth >= 1024 && screenWidth < 1440) {
    return url.replace('original', '192_192')
  }
  if (screenWidth >= 1440) {
    return url.replace('original', '212_212')
  }
  return url
}
const CardImage: FC<Props> = ({url, alt, fallbackUrl}) => {
  const size = useWindowSize()
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>()
  useEffect(() => {
    setCroppedImageUrl(getImageUrl(url, size.width))
  }, [size.width, url])
  if (!croppedImageUrl) return null
  return (
    <ImageWrapper
      type={croppedImageUrl}
      alt={alt}
      fallbackUrl={fallbackUrl}
      layout='fill'
      objectFit='cover'
    />
  )
}

export default CardImage
