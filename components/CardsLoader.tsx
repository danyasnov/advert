import {FC} from 'react'
import {Placeholder} from './AdvertNotFound'

interface Props {
  enableFourthColumnForM: boolean
  show: boolean
}
const CardsLoader: FC<Props> = ({enableFourthColumnForM, show}) => {
  if (!show) return null

  return (
    <div
      className={`grid grid-cols-2 xs:grid-cols-3 l:grid-cols-4 gap-2 s:gap-4 l:gap-4 ${
        enableFourthColumnForM ? 'm:grid-cols-4 m:gap-x-15 m:gap-y-6' : ''
      }`}>
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