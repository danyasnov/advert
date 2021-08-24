import {FC} from 'react'
import IcStar from 'icons/material/Star.svg'

interface Props {
  ratingMark: number
  ratingMarkCnt: number
}
const UserRatingMinified: FC<Props> = ({ratingMark, ratingMarkCnt}) => {
  return (
    <div className='text-brand-a1 text-body-2 flex items-center mb-2'>
      <IcStar className='fill-current h-6 w-6 mr-2' />
      <span className='mr-1'>{ratingMark}</span>
      <span>({ratingMarkCnt})</span>
    </div>
  )
}

export default UserRatingMinified
