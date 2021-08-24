import {FC} from 'react'
import IcFullRatingStar from 'icons/material/FullRatingStar.svg'
import IcHalfRatingStar from 'icons/material/HalfRatingStar.svg'
import IcEmptyRatingStar from 'icons/material/EmptyRatingStar.svg'

interface Props {
  rating: number
  size: number
}
const RatingStars: FC<Props> = ({rating, size}) => {
  const count = new Array(Math.trunc(rating)).fill(1)
  const remainder = rating - Math.trunc(rating)
  const className = `fill-current text-brand-a1 h-${size} w-${size}`

  const stars = count.map((c, index) => (
    <IcFullRatingStar
      /* eslint-disable-next-line react/no-array-index-key */
      key={index}
      className={className}
    />
  ))
  if (remainder) {
    stars.push(<IcHalfRatingStar key='half-star' className={className} />)
  }
  if (stars.length < 5) {
    const missedCount = new Array(5 - stars.length).fill(1)
    stars.push(
      ...missedCount.map((m, index) => (
        <IcEmptyRatingStar
          /* eslint-disable-next-line react/no-array-index-key */
          key={`miss-${index}`}
          className={className}
        />
      )),
    )
  }
  return <div className='flex'>{stars}</div>
}
export default RatingStars
