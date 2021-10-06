import {FC} from 'react'
import IcStar from 'icons/material/Star.svg'
import {isFinite} from 'lodash'

interface Props {
  ratingMark: number
  ratingMarkCnt: number
}
const UserRatingMinified: FC<Props> = ({ratingMark, ratingMarkCnt}) => {
  let calculated = ratingMark / ratingMarkCnt
  if (!isFinite(calculated)) calculated = 0
  return (
    <div className='text-brand-a1 text-body-2 flex items-center mb-2'>
      <IcStar className='fill-current h-6 w-6 mr-2' />
      <span className='mr-1'>{Math.round(calculated * 10) / 10}</span>
      <span>({ratingMarkCnt})</span>
    </div>
  )
}

export default UserRatingMinified
