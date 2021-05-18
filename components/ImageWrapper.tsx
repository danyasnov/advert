import {FC} from 'react'
import Image from 'next/image'

interface Props {
  type: string
  alt: string
  className?: string
  width: number
  height: number
}

const ImageWrapper: FC<Props> = ({type, width, height, className, alt}) => {
  return (
    <Image
      src={`/img/${type}.jpg`}
      width={width}
      height={height}
      alt={alt}
      className={className}
    />
  )
}

export default ImageWrapper
