import {FC} from 'react'
import IcFullRatingStar from 'icons/material/FullRatingStar.svg'
import IcHalfRatingStar from 'icons/material/HalfRatingStar.svg'
import IcEmptyRatingStar from 'icons/material/EmptyRatingStar.svg'
import {isFinite} from 'lodash'

interface Props {
  rating: number
  ratingCount: number
}
const Rating: FC<Props> = ({rating, ratingCount}) => {
  let calculated = rating / ratingCount
  if (!isFinite(calculated)) calculated = 0
  const count = new Array(Math.trunc(calculated)).fill(1)
  const remainder = calculated - Math.trunc(rating)
  const stars = count.map((c, index) => (
    <IcFullRatingStar
      /* eslint-disable-next-line react/no-array-index-key */
      key={index}
      className='fill-current text-brand-a1 h-4 w-4'
    />
  ))
  if (remainder) {
    stars.push(
      <IcHalfRatingStar
        key='half-star'
        className='fill-current text-brand-a1 h-4 w-4'
      />,
    )
  }
  if (stars.length < 5) {
    const missedCount = new Array(5 - stars.length).fill(1)
    stars.push(
      ...missedCount.map((m, index) => (
        <IcEmptyRatingStar
          /* eslint-disable-next-line react/no-array-index-key */
          key={`miss-${index}`}
          className='fill-current text-brand-a1 h-4 w-4'
        />
      )),
    )
  }

  return (
    <div className='flex items-center'>
      <span className='text-brand-a1 text-body-2 mr-1'>
        {Math.round(calculated * 10) / 10}
      </span>
      <span className='text-brand-a1 text-body-2 mr-2'>({ratingCount})</span>
      <div className='flex'>{stars}</div>
    </div>
  )
}
export default Rating
