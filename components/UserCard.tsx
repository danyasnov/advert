import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import IcAdvert from 'icons/material/Advert.svg'
import {useProductsStore} from '../providers/RootStoreProvider'
import {unixToDate} from '../utils'
import ImageWrapper from './ImageWrapper'
import UserAvatar from './UserAvatar'
import UserRatingMinified from './UserRatingMinified'
import LinkWrapper from './Buttons/LinkWrapper'

const UserCard: FC = observer(() => {
  const {product} = useProductsStore()
  const {t} = useTranslation()

  return (
    <div className='flex flex-col bg-white px-2 py-6'>
      <div className='flex mb-3'>
        <div className='flex flex-col items-center mr-5'>
          <UserAvatar url={product.owner.image} name={product.owner.name} />
          {/* <IcPersonAdd className='fill-current h-6 w-6 ' /> */}
        </div>
        <div>
          <LinkWrapper
            href={`/user/${product.owner.hash}`}
            title={product.owner.name}>
            <h3 className='text-brand-b1 text-h-3 font-bold'>
              {product.owner.name}
            </h3>
          </LinkWrapper>
          <UserRatingMinified
            ratingMark={product.owner.ratingMark}
            ratingMarkCnt={product.owner.ratingMarkCnt}
          />

          <div className='flex items-center mb-2'>
            <IcAdvert className='fill-current text-black-c h-6 w-6 mr-2' />
            <span className='text-black-c text-body-2'>
              {t('N_ADVERTS', {count: product.owner.advertsActiveCount})}
            </span>
          </div>
          <span className='text-black-c text-body-2'>
            {t('SINCE', {date: unixToDate(product.owner.dateRegistered)})}
          </span>
        </div>
      </div>
      <div className='flex text-black-c text-body-3 items-center'>
        <span className='mr-2'>{t('I_SPEAK')}</span>
        <div className='flex flex-wrap'>
          {product.owner.languages.map((l) => (
            <div className='mr-2 w-3 h-4' key={l}>
              <ImageWrapper
                type={`https://adverto.sale/img/flags/${l}.png`}
                alt='lang'
                width={12}
                height={12}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

export default UserCard
