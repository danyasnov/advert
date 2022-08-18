import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import IcAdvert from 'icons/material/Advert.svg'
import IcPersonAdd from 'icons/material/PersonAdd.svg'
import {toJS} from 'mobx'
import {useProductsStore} from '../providers/RootStoreProvider'
import {unixToDate} from '../utils'
import ImageWrapper from './ImageWrapper'
import UserAvatar from './UserAvatar'
import UserRatingMinified from './UserRatingMinified'
import LinkWrapper from './Buttons/LinkWrapper'

const UserCard: FC = observer(() => {
  const {product} = useProductsStore()
  const {t} = useTranslation()

  const langs = (
    <div className='flex text-black-c text-body-14 items-center'>
      <span className='mr-2'>{t('I_SPEAK')}</span>
      <div className='flex flex-wrap'>
        {product.owner.languages.map((l) => (
          <div className='mr-2 w-3 h-3' key={l}>
            <ImageWrapper
              type={`https://vooxee.com/img/flags/${l}.png`}
              alt='lang'
              width={12}
              height={12}
            />
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className='flex flex-col bg-white p-4 rounded-2xl drop-shadow-card'>
      <div className='flex flex-col mb-2 s:mb-0 m:mb-2 w-full'>
        <div className='flex flex-col items-center mr-5'>
          <UserAvatar
            url={product.owner.image}
            name={product.owner.name}
            size={16}
          />
          {/* <IcPersonAdd className='fill-current text-black-c h-6 w-6 ' /> */}
        </div>
        <div className='w-full'>
          <h3 className='text-greyscale-900 text-body-18 font-semibold mb-2 truncate w-40'>
            {product.owner.name}
          </h3>
          <div className='flex flex-col s:flex-row m:flex-col justify-between'>
            <UserRatingMinified
              ratingMark={product.owner.ratingMark}
              ratingMarkCnt={product.owner.ratingMarkCnt}
            />

            <div className='flex items-center mb-2'>
              <IcAdvert className='fill-current text-black-c h-6 w-6 mr-2' />
              <span className='text-black-c text-body-14'>
                {t('N_ADVERTS', {count: product.owner.advertsActiveCount})}
              </span>
            </div>
          </div>
          <div className='flex justify-between'>
            <div className='hidden s:block m:hidden'>{langs}</div>
            <span className='text-black-c text-body-14'>
              {t('SINCE', {date: unixToDate(product.owner.dateRegistered)})}
            </span>
          </div>
        </div>
      </div>
      <div className='block s:hidden m:block'>{langs}</div>
    </div>
  )
})

export default UserCard
