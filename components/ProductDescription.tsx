import {FC, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import IcVisibility from 'icons/material/Visibility.svg'
import IcLike from 'icons/material/Like.svg'
import IcPhone from 'icons/material/Phone.svg'
import {size} from 'lodash'
import {FieldDTO} from 'front-api/src/models/index'
import {parseCookies} from 'nookies'
import {useGeneralStore, useProductsStore} from '../providers/RootStoreProvider'
import {unixToDateTime} from '../utils'
import Tabs from './Tabs'
import ProductMap from './ProductMap'
import UserCard from './UserCard'
import PrimaryButton from './Buttons/PrimaryButton'
import SharePopup from './SharePopup'
import LinkWrapper from './Buttons/LinkWrapper'
import SecondaryButton from './Buttons/SecondaryButton'
import {SerializedCookiesState} from '../types'

const getTabs = (description: string, fields: FieldDTO[]) => {
  const tabs = []
  if (description) tabs.push({id: 0, title: 'DESCRIPTION'})
  if (size(fields)) tabs.push({id: 1, title: 'CHARACTERISTICS_TAB'})
  return tabs
}
const ProductDescription: FC = observer(() => {
  const {product} = useProductsStore()
  if (!product) return null
  const [showPhone, setShowPhone] = useState(false)
  const {t} = useTranslation()
  const {advert, owner} = product
  const {phoneNum} = owner
  const {favoriteCounter, views, dateUpdated, fields, description} = advert
  const [activeTab, setActiveTab] = useState(description ? 0 : 1)
  const [showChat, setShowChat] = useState(false)
  const {setShowLogin} = useGeneralStore()

  useEffect(() => {
    const state: SerializedCookiesState = parseCookies()
    setShowChat(!!state.hash)
  }, [])
  return (
    <div className='mt-4 mb-4 flex flex-col'>
      <div className='flex flex-col justify-between mb-6 s:flex-row s:items-center'>
        <div>
          {/* <OutlineButton */}
          {/*  onClick={notImplementedAlert} */}
          {/*  className='text-black-b text-body-2 mb-4 s:mb-0'> */}
          {/*  {t('ADD_NOTE')} */}
          {/* </OutlineButton> */}
        </div>
        <div className='flex items-center space-x-6 justify-between'>
          <div className='text-black-b text-body-3 flex items-center'>
            <IcLike className='fill-current text-black-c w-4 h-4 mr-2' />
            {favoriteCounter}
          </div>
          <div className='text-black-b text-body-3 flex items-center'>
            <IcVisibility className='fill-current text-black-c w-5 h-5 mr-2' />
            {views}
          </div>
          <span suppressHydrationWarning className='text-black-b text-body-3'>
            {unixToDateTime(dateUpdated)}
          </span>
        </div>
      </div>
      {phoneNum && (
        <PrimaryButton
          onClick={() => setShowPhone(true)}
          className='m:hidden text-body-2 text-black-b order-0 mb-4'>
          <IcPhone className='fill-current h-4 w-4 mr-2' />
          {showPhone ? phoneNum : t('MAKE_A_CALL')}
        </PrimaryButton>
      )}
      {showChat ? (
        <LinkWrapper
          target='_blank'
          href={`https://old.adverto.sale/cp/chat/#message-productId=${advert.hash}`}
          className='rounded-lg py-3 px-3.5 border border-shadow-b h-10 text-body-2 text-black-b flex justify-center mb-2'
          title={t('SEND_A_MESSAGE')}>
          {t('SEND_A_MESSAGE')}
        </LinkWrapper>
      ) : (
        <SecondaryButton
          className='mb-2'
          onClick={() => {
            setShowLogin(true)
          }}>
          {t('SEND_A_MESSAGE')}
        </SecondaryButton>
      )}
      <div className='mb-2 s:mb-4 m:hidden'>
        <UserCard />
      </div>

      <div className='-mx-4 s:-mx-0'>
        <ProductMap />
      </div>

      <div className='h-full flex flex-col'>
        <Tabs
          items={getTabs(description, fields)}
          value={activeTab}
          onChange={(id) => setActiveTab(id)}
        />
        {activeTab === 0 && <DescriptionTab />}
        {activeTab === 1 && <CharacteristicsTab />}
      </div>
      <div className='flex justify-between flex-col s:flex-row my-4'>
        <SharePopup
          userHash={product.owner.hash}
          productHash={product.advert.hash}
        />

        <div className='flex justify-end mt-4 text-body-2 flex-col s:flex-row s:space-x-4'>
          {/* <SecondaryButton */}
          {/*  onClick={notImplementedAlert} */}
          {/*  className='mb-2 s:mb-0'> */}
          {/*  <IcNoEntry className='fill-current text-black-c h-4 w-4 mr-2' /> */}
          {/*  {t('BLOCK_MESSAGE')} */}
          {/* </SecondaryButton> */}
          {/* <SecondaryButton onClick={notImplementedAlert}> */}
          {/*  <IcService className='fill-current text-black-c h-4 w-4 mr-2' /> */}
          {/*  {t('SUPPORT')} */}
          {/* </SecondaryButton> */}
        </div>
      </div>
    </div>
  )
})

const DescriptionTab: FC = observer(() => {
  const {product} = useProductsStore()

  if (!product.advert.description) return null
  return (
    <div className='bg-white p-4 text-black-b text-body-1 break-words'>
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
