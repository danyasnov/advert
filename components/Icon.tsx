import {FC} from 'react'
import Image from 'next/image'

interface Props {
  type: string
  width: number
  height: number
}

const Icon: FC<Props> = ({type, width, height}) => {
  return (
    <div style={{width, height, position: 'relative'}}>
      <Image src={`/icons/${type}.svg`} layout='fill' />
    </div>
  )
}

export default Icon
