import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useUserStore} from '../providers/RootStoreProvider'
import UserAvatar from './UserAvatar'
import {unixToDate} from '../utils'
import RatingStars from './RatingStars'
import LinkWrapper from './Buttons/LinkWrapper'

const UserRatings: FC = observer(() => {
  const {ratings} = useUserStore()
  return (
    <div className='flex flex-col mt-2'>
      {ratings.map((r) => (
        <div className='flex w-full mb-4'>
          <div className='mr-2'>
            <UserAvatar url={r.userImage} name={r.userName} />
            {/* <UserRatingMinified */}
            {/*  ratingMark={product.owner.ratingMark} */}
            {/*  ratingMarkCnt={product.owner.ratingMarkCnt} */}
            {/* /> */}
          </div>
          <div className='flex flex-col w-full'>
            <div className='flex justify-between mb-1'>
              <h5 className='text-h-5 font-bold text-black-b'>{r.userName}</h5>
              <span className='text-body-3 text-black-b '>
                {unixToDate(r.adCreatedAt)}
              </span>
            </div>
            <div className='flex flex-col border border-brand-a1 rounded-lg px-3 py-2'>
              <div className='flex justify-between'>
                <LinkWrapper
                  className='text-brand-b1 text-h-5 font-bold flex-col flex justify-center'
                  title={r.adTitle}
                  href={`/${r.adId}`}
                  target='_blank'>
                  {r.adTitle}
                </LinkWrapper>
                <RatingStars rating={r.userRating} size={6} />
              </div>
              {r.comment && (
                <span className='mt-2 text-body-2 text-black-b'>
                  {r.comment}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
})

export default UserRatings
