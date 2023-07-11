import {FC} from 'react'
import {Placeholder} from './AdvertNotFound'

interface Props {
  className: string
  show: boolean
}
const CardsLoader: FC<Props> = ({show, className}) => {
  if (!show) return null

  return (
    <div
      className={`grid grid-cols-2 xs:grid-cols-3 w-full gap-2 s:gap-4 m:gap-x-8 m:gap-y-6 l:gap-4 mb-2 s:mb-4 ${className} 132`}>
      {Array(8)
        .fill(0)
        .map((_, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <div className='animate-pulse' key={index}>
            <Placeholder />
          </div>
        ))}
    </div>
  )
}

export default CardsLoader
