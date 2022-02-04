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
    <div className='flex text-black-c text-body-2 items-center'>
      <span className='mr-2'>{t('I_SPEAK')}</span>
      <div className='flex flex-wrap'>
        {product.owner.languages.map((l) => (
          <div className='mr-2 w-3 h-3' key={l}>
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
  )

  return (
    <div className='flex flex-col bg-white px-4 py-6 rounded-lg'>
      <div className='flex mb-2 s:mb-0 m:mb-2 w-full'>
        <div className='flex flex-col items-center mr-5'>
          <UserAvatar url={product.owner.image} name={product.owner.name} />
          {/* <IcPersonAdd className='fill-current text-black-c h-6 w-6 ' /> */}
        </div>
        <div className='w-full'>
          <LinkWrapper
            href={`/user/${product.owner.hash}`}
            title={product.owner.name}>
            <h3 className='text-brand-b1 text-h-3 font-bold mb-2 truncate w-44'>
              {product.owner.name}
            </h3>
          </LinkWrapper>
          <div className='flex flex-col s:flex-row m:flex-col justify-between'>
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
          </div>
          <div className='flex justify-between'>
            <div className='hidden s:block m:hidden'>{langs}</div>
            <span className='text-black-c text-body-2'>
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
