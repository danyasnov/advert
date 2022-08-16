import {FC, useEffect, useState} from 'react'
import {useWindowSize} from 'react-use'

import ImageWrapper from './ImageWrapper'

interface Props {
  url: string
  alt: string
  isVip?: boolean
  fallbackUrl?: string | string[]
}
const getImageUrl = (url, screenWidth, isVip): string => {
  if (!screenWidth) return url
  if (screenWidth < 768) {
    return url.replace('original', isVip ? '320_160' : '160_160')
  }
  if (screenWidth >= 768 && screenWidth < 1024) {
    return url.replace('original', isVip ? '464_200' : '224_200')
  }
  if (screenWidth >= 1024 && screenWidth < 1440) {
    return url.replace('original', isVip ? '404_200' : '194_200')
  }
  if (screenWidth >= 1440) {
    return url.replace('original', isVip ? '440_200' : '212_200')
  }
  return url
}
const CardImage: FC<Props> = ({url, alt, fallbackUrl, isVip}) => {
  const size = useWindowSize()
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>()
  useEffect(() => {
    setCroppedImageUrl(getImageUrl(url, size.width, isVip))
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
