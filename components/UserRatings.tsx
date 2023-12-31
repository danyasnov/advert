import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {isEmpty} from 'lodash'
import {useUserStore} from '../providers/RootStoreProvider'
import UserAvatar from './UserAvatar'
import {unixToDate} from '../utils'
import RatingStars from './RatingStars'
import LinkWrapper from './Buttons/LinkWrapper'
import {AdvertNotFound} from './AdvertNotFound'

const UserRatings: FC = observer(() => {
  const {ratings} = useUserStore()
  if (isEmpty(ratings)) return <AdvertNotFound />
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
              <h5 className='text-body-14 font-bold text-greyscale-900'>
                {r.userName}
              </h5>
              <span className='text-body-12 text-greyscale-900 '>
                {unixToDate(r.adCreatedAt)}
              </span>
            </div>
            <div className='flex flex-col border border-primary-500 rounded-lg px-3 py-2'>
              <div className='flex justify-between'>
                <LinkWrapper
                  className='text-brand-b1 text-body-14 font-bold flex-col flex justify-center'
                  title={r.adTitle}
                  href={`/${r.adId}`}
                  target='_blank'>
                  {r.adTitle}
                </LinkWrapper>
                <RatingStars rating={r.userRating} size={6} />
              </div>
              {r.comment && (
                <span className='mt-2 text-body-14 text-greyscale-900'>
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
