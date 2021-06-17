import {FC} from 'react'
import Loader from './Loader'

interface Props {
  show: boolean
}
const LoaderWrapper: FC<Props> = ({show}) => {
  if (!show) return null
  return (
    <div className='absolute w-full h-full flex justify-center pt-10'>
      <Loader />
    </div>
  )
}

export default LoaderWrapper
