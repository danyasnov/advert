import {FC} from 'react'
import {Placeholder} from './AdvertNotFound'

interface Props {
  enableFourthColumnForM: boolean
  enableFiveColumnsForL: boolean
  show: boolean
}
const CardsLoader: FC<Props> = ({
  enableFourthColumnForM,
  show,
  enableFiveColumnsForL,
}) => {
  if (!show) return null

  return (
    <div
      className={`grid grid-cols-2 xs:grid-cols-3 m:gap-y-6  gap-2 s:gap-4 l:gap-4 ${
        enableFourthColumnForM ? 'm:grid-cols-4' : 'm:grid-cols-3'
      } ${enableFiveColumnsForL ? 'l:grid-cols-6' : 'l:grid-cols-4'}`}>
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
