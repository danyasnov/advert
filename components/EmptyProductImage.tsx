import {FC} from 'react'
import {Image} from 'react-iconly'

const EmptyProductImage: FC<{size: number}> = ({size}) => (
  <div className='relative min-w-full text-greyscale-400 flex items-center justify-center'>
    <Image filled size={size} />
  </div>
)

export default EmptyProductImage
