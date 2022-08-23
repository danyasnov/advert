import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import IcAds from 'icons/material/Ads.svg'
import IcPersonAdd from 'icons/material/PersonAdd.svg'
import {toJS} from 'mobx'
import {AddUser} from 'react-iconly'
import {useProductsStore} from '../providers/RootStoreProvider'
import {unixToDate} from '../utils'
import ImageWrapper from './ImageWrapper'
import UserAvatar from './UserAvatar'
import UserRatingMinified from './UserRatingMinified'
import LinkWrapper from './Buttons/LinkWrapper'
import Button from './Buttons/Button'
import PrimaryButton from './Buttons/PrimaryButton'

const UserCard: FC = observer(() => {
  const {product} = useProductsStore()
  const {t} = useTranslation()

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
    <div className='flex s:flex-col mb-2 s:mb-0 m:mb-2 w-full rounded-2xl p-6 bg-white'>
      <div className='flex flex-col mr-6 s:mr-0'>
        <div className='mb-4 self-center'>
          <UserAvatar
            url={product.owner.image}
            name={product.owner.name}
            size={16}
          />
        </div>
        {product.owner.isOnline && (
          <span className='mb-2 text-body-12 text-green text-center'>
            {t('ONLINE')}
          </span>
        )}
      </div>

      <div className='w-full flex flex-col items-start s:items-center'>
        <h3 className='text-greyscale-900 text-body-18 font-semibold mb-2 truncate w-40 text-left s:text-center'>
          {product.owner.name}
        </h3>
        {/* <Button className='text-primary-500 space-x-1.5 mb-2'> */}
        {/*  <AddUser size={16} filled /> */}
        {/*  <span className='text-body-16 font-normal'>{t('SUBSCRIBE')}</span> */}
        {/* </Button> */}
        <div className='flex justify-between mb-4'>
          <div>{langs}</div>
        </div>
        <LinkWrapper
          href={`/user/${product.owner.hash}`}
          title='user page'
          target='_blank'>
          <PrimaryButton
            className='self-center font-medium space-x-1.5'
            isSmall>
            <IcAds className='w-5 h-5 fill-current' />
            <span className='text-body-12 m:text-body-16'>{t('SHOW_ADS')}</span>
          </PrimaryButton>
        </LinkWrapper>
      </div>
    </div>
  )
})

export default UserCard
