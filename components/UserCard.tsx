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
    <div className='flex flex-col bg-white px-5 py-7 rounded-2xl'>
      <div className='flex flex-col mb-2 s:mb-0 m:mb-2 w-full '>
        <div className='flex flex-col items-center mb-4'>
          <UserAvatar
            url={product.owner.image}
            name={product.owner.name}
            size={16}
          />
          {/* <IcPersonAdd className='fill-current text-black-c h-6 w-6 ' /> */}
        </div>
        <div className='w-full flex flex-col items-center'>
          {product.owner.isOnline && (
            <span className='mb-2 text-body-12 text-green'>{t('ONLINE')}</span>
          )}
          <h3 className='text-greyscale-900 text-body-18 font-semibold mb-2 truncate w-40 text-center'>
            {product.owner.name}
          </h3>
          <Button className='text-primary-500 space-x-1.5'>
            <AddUser size={16} filled />
            <span className='text-body-16 font-normal'>{t('SUBSCRIBE')}</span>
          </Button>
          <div className='flex justify-between my-6'>
            <div>{langs}</div>
          </div>
        </div>
      </div>
      <LinkWrapper
        href={`/user/${product.owner.hash}`}
        title='user page'
        target='_blank'>
        <PrimaryButton className='self-center' isSmall>
          <IcAds className='w-5 h-5 fill-current' />
          <span className='text-body-14 m:text-body-16'>{t('SHOW_ADS')}</span>
        </PrimaryButton>
      </LinkWrapper>
    </div>
  )
})

export default UserCard
