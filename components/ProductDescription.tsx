import {FC, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import IcVisibility from 'icons/material/Visibility.svg'
import IcLike from 'icons/material/Like.svg'
import IcNoEntry from 'icons/material/NoEntry.svg'
import IcService from 'icons/material/Service.svg'
import IcPhone from 'icons/material/Phone.svg'
import IcViber from 'icons/material/Viber.svg'
import IcWhatsapp from 'icons/material/Whatsapp.svg'
import IcTelegram from 'icons/material/Telegram.svg'
import IcFacebook from 'icons/material/Facebook.svg'
import IcVk from 'icons/material/Vk.svg'
import {useProductsStore} from '../providers/RootStoreProvider'
import Button from './Buttons/Button'
import {notImplementedAlert} from '../helpers'
import OutlineButton from './Buttons/OutlineButton'
import {unixToDateTime} from '../utils'
import Tabs from './Tabs'
import ProductMap from './ProductMap'
import UserCard from './UserCard'
import SecondaryButton from './Buttons/SecondaryButton'
import LinkWrapper from './Buttons/LinkWrapper'

const tabs = [
  {id: 0, title: 'DESCRIPTION'},
  {id: 1, title: 'CHARACTERISTICS_TAB'},
]
const ProductDescription: FC = observer(() => {
  const {product} = useProductsStore()
  if (!product) return null
  const [activeTab, setActiveTab] = useState(0)

  const {t} = useTranslation()
  const {advert} = product
  const {shortUrl, favoriteCounter, views, dateUpdated} = advert
  return (
    <div className='mt-4 mb-4 flex flex-col'>
      <div className='flex flex-col justify-between mb-6 s:flex-row s:items-center'>
        <OutlineButton
          onClick={notImplementedAlert}
          className='text-black-b text-body-2 mb-4 s:mb-0'>
          {t('ADD_NOTE')}
        </OutlineButton>
        <div className='flex items-center space-x-6 justify-between'>
          <Button
            onClick={notImplementedAlert}
            className='text-black-b text-body-3'>
            <IcLike className='fill-current text-black-c w-4 h-4 mr-2' />
            {favoriteCounter}
          </Button>
          <Button
            onClick={notImplementedAlert}
            className='text-black-b text-body-3'>
            <IcVisibility className='fill-current text-black-c w-5 h-5 mr-2' />
            {views}
          </Button>
          <span suppressHydrationWarning className='text-black-b text-body-3'>
            {unixToDateTime(dateUpdated)}
          </span>
        </div>
      </div>
      <SecondaryButton
        onClick={notImplementedAlert}
        className='text-body-2 text-black-b order-0 mb-4'>
        <IcPhone className='fill-current h-4 w-4 mr-2' />
        {t('MAKE_A_CALL')}
      </SecondaryButton>
      <div className='mb-2 s:mb-4'>
        <UserCard />
      </div>

      <div className='-mx-4 s:-mx-0'>
        <ProductMap />
      </div>

      <div className='h-full flex flex-col'>
        <Tabs
          items={tabs}
          value={activeTab}
          onChange={(id) => setActiveTab(id)}
        />
        {activeTab === 0 && <DescriptionTab />}
        {activeTab === 1 && <CharacteristicsTab />}
      </div>
      <div className='flex justify-between flex-col s:flex-row'>
        <div className='flex space-x-2 mt-4 mb-2'>
          <LinkWrapper
            target='_blank'
            title='Telegram'
            href={`https://telegram.me/share/url?url=${shortUrl}`}
            className='p-2 border border-shadow-b rounded-lg'>
            <IcTelegram className='fill-current text-black-c h-6 w-6 ' />
          </LinkWrapper>
          <LinkWrapper
            target='_blank'
            title='Facebook'
            href={`https://www.facebook.com/sharer.php?u=${shortUrl}`}
            className='p-2 border border-shadow-b rounded-lg'>
            <IcFacebook className='fill-current text-black-c h-6 w-6 ' />
          </LinkWrapper>
          <LinkWrapper
            target='_blank'
            title='Viber'
            href={`viber://forward?text=250+Benz+CLA+${shortUrl}`}
            className='p-2 border border-shadow-b rounded-lg'>
            <IcViber className='fill-current text-black-c h-6 w-6 ' />
          </LinkWrapper>
          <LinkWrapper
            target='_blank'
            title='Whatsapp'
            href={`whatsapp://send?text=250+Benz+CLA ${shortUrl}`}
            className='p-2 border border-shadow-b rounded-lg'>
            <IcWhatsapp className='fill-current text-black-c h-6 w-6 ' />
          </LinkWrapper>
          <LinkWrapper
            target='_blank'
            title='VK'
            href={`https://vk.com/share.php?url=${shortUrl}`}
            className='p-2 border border-shadow-b rounded-lg'>
            <IcVk className='fill-current text-black-c h-6 w-6 ' />
          </LinkWrapper>
        </div>
        <div className='flex justify-end mt-4 text-body-2 flex-col s:flex-row s:space-x-4'>
          <SecondaryButton
            onClick={notImplementedAlert}
            className='mb-2 s:mb-0'>
            <IcNoEntry className='fill-current text-black-c h-4 w-4 mr-2' />
            {t('BLOCK_MESSAGE')}
          </SecondaryButton>
          <SecondaryButton onClick={notImplementedAlert}>
            <IcService className='fill-current text-black-c h-4 w-4 mr-2' />
            {t('SUPPORT')}
          </SecondaryButton>
        </div>
      </div>
    </div>
  )
})

const DescriptionTab: FC = observer(() => {
  const {product} = useProductsStore()

  return (
    <div className='bg-white p-4 text-black-b text-body-1'>
      {product.advert.description}
    </div>
  )
})

const CharacteristicsTab: FC = observer(() => {
  const {product} = useProductsStore()

  return (
    <div className='bg-white p-4 text-black-c text-body-3 space-y-2'>
      {product.advert.fields.map((field) => {
        return (
          <div className='flex justify-between' key={field.fieldNameText}>
            <div>{field.fieldNameText}</div>
            <div>
              {field.fieldValueText.map((fieldValue) => (
                <span key={fieldValue}>{fieldValue}</span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
})

export default ProductDescription
