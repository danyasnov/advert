import {FC} from 'react'
import {isFinite} from 'lodash'
import RatingStars from '../../../components/RatingStars'

interface Props {
  rating: number
  ratingCount: number
}
const Rating: FC<Props> = ({rating, ratingCount}) => {
  let calculated = rating / ratingCount
  if (!isFinite(calculated)) calculated = 0

  return (
    <div className='flex items-center'>
      <span className='text-brand-a1 text-body-2 mr-1'>
        {Math.round(calculated * 10) / 10}
      </span>
      <span className='text-brand-a1 text-body-2 mr-2'>({ratingCount})</span>
      <RatingStars rating={calculated} size={4} />
    </div>
  )
}
export default Rating
