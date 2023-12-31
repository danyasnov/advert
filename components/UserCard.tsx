import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import IcAds from 'icons/material/Ads.svg'
import {toJS} from 'mobx'
import {useProductsStore} from '../providers/RootStoreProvider'
import {unixToDate} from '../utils'
import ImageWrapper from './ImageWrapper'
import UserAvatar from './UserAvatar'
import UserRatingMinified from './UserRatingMinified'
import LinkWrapper from './Buttons/LinkWrapper'
import Button from './Buttons/Button'
import PrimaryButton from './Buttons/PrimaryButton'
import OutlineButton from './Buttons/OutlineButton'
import SubscribeOnUser from './SubscribeOnUser'

const UserCard: FC = observer(() => {
  const {product} = useProductsStore()
  const {t} = useTranslation()
  let buttonLabel
  if (product.owner.userType === 'simple') {
    buttonLabel = t('SHOW_ADS')
  } else if (product.owner.userType === 'shops') {
    buttonLabel = t('VISIT_STORE')
  } else if (product.owner.userType === 'estate-agencies') {
    buttonLabel = t('SHOW_REAL_ESTATE')
  } else if (product.owner.userType === 'car-dealers') {
    buttonLabel = t('SHOW_CARS')
  }

  const langs = (
    <div className='flex text-greyscale-900 text-body-14 items-center'>
      <span className='mr-2 font-normal'>{t('I_SPEAK')}</span>
      <div className='flex flex-wrap'>
        {product.owner.languages.map((l) => (
          <div className='mr-2 ' key={l}>
            <ImageWrapper
              type={`/img/flags/${l}.png`}
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
    <div className='flex flex-col mb-11 s:mb-5 m:mb-11 w-full rounded-2xl p-6 bg-white shadow-1'>
      <div className='flex flex-col'>
        <div className='mb-4 self-center'>
          <UserAvatar
            url={product.owner.image}
            name={product.owner.name}
            size={16}
          />
        </div>
        {/* {product.owner.isOnline && ( */}
        <span className='mb-2 text-body-12 text-green text-center'>
          {t('ONLINE')}
        </span>
        {/* )} */}
      </div>

      <div className='w-full flex flex-col items-center'>
        <h3 className='text-greyscale-900 text-body-18 font-semibold mb-2 truncate w-full text-center whitespace-pre-line'>
          {product.owner.name}
        </h3>
        <div className='mb-6'>
          <SubscribeOnUser
            isSubscribed={product.owner.isSubscribed}
            ownerId={product.owner.hash}
            type='card'
          />
        </div>

        <div className='flex justify-between mb-8 s:mb-6'>
          <div>{langs}</div>
        </div>
        <LinkWrapper
          href={`/user/${product.owner.hash}`}
          title='user page'
          target='_blank'>
          <OutlineButton
            className='hover:bg-primary-100 hover:text-primary-500 font-medium space-x-1.5 py-3.5 px-6'
            isSmall>
            <IcAds className='w-5 h-5 fill-current' />
            <span className='text-body-16 s:text-body-14'>{buttonLabel}</span>
          </OutlineButton>
        </LinkWrapper>
      </div>
    </div>
  )
})

export default UserCard
