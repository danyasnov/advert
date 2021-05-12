import {FC} from 'react'
import Image from 'next/image'

interface Props {
  type: string
  className?: string
  width: number
  height: number
}

const Icon: FC<Props> = ({type, width, height, className}) => {
  return (
    <div style={{width, height, position: 'relative'}} className={className}>
      <Image src={`/icons/${type}.svg`} layout='fill' />
    </div>
  )
}

export default Icon
