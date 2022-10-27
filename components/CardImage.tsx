import {FC, useEffect, useState} from 'react'
import {useWindowSize} from 'react-use'

import {Camera} from 'react-iconly'
import {useTranslation} from 'next-i18next'
import ImageWrapper from './ImageWrapper'

interface Props {
  url: string
  alt: string
  isVip?: boolean
  isLast?: boolean
  morePhotosCount?: number
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
    return url.replace('original', isVip ? '404_200' : '224_240')
  }
  if (screenWidth >= 1440) {
    return url.replace('original', isVip ? '440_200' : '212_200')
  }
  return url
}
const CardImage: FC<Props> = ({
  url,
  alt,
  fallbackUrl,
  isVip,
  isLast,
  morePhotosCount,
}) => {
  const size = useWindowSize()
  const {t} = useTranslation()
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>()
  useEffect(() => {
    setCroppedImageUrl(getImageUrl(url, size.width, isVip))
  }, [size.width, url])
  if (!croppedImageUrl) return null
  const image = (
    <ImageWrapper
      type={croppedImageUrl}
      alt={alt}
      fallbackUrl={fallbackUrl}
      layout='fill'
      objectFit='cover'
    />
  )
  if (isLast && morePhotosCount) {
    return (
      <div className='relative h-full'>
        {image}
        <div className='absolute inset-0 bg-greyscale-900 opacity-50' />
        <div className='absolute inset-0 flex flex-col justify-center items-center text-white'>
          <Camera size={40} filled />
          <span className='mt-1'>
            {t('MORE_PHOTOS', {count: morePhotosCount})}
          </span>
        </div>
      </div>
    )
  }
  return image
}

export default CardImage
