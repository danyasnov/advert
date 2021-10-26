import {FC, useState} from 'react'
import {observer} from 'mobx-react-lite'
import IcVisibility from 'icons/material/Visibility.svg'
import IcLike from 'icons/material/Like.svg'
import {size} from 'lodash'
import {FieldDTO} from 'front-api/src/models/index'
import {useTranslation} from 'next-i18next'
import {useGeneralStore, useProductsStore} from '../providers/RootStoreProvider'
import {unixToDateTime} from '../utils'
import Tabs from './Tabs'
import ProductMap from './ProductMap'
import UserCard from './UserCard'
import SharePopup from './SharePopup'
import CallButton from './Buttons/CallButton'
import ChatButton from './Buttons/ChatButton'
import ProductNotes from './ProductNotes'

const getTabs = (description: string, fields: FieldDTO[]) => {
  const tabs = []
  if (description) tabs.push({id: 0, title: 'DESCRIPTION'})
  if (size(fields)) tabs.push({id: 1, title: 'CHARACTERISTICS_TAB'})
  return tabs
}
const ProductDescription: FC = observer(() => {
  const {product} = useProductsStore()
  if (!product) return null
  const {advert, owner} = product
  const {phoneNum} = owner
  const {favoriteCounter, views, dateUpdated, fields, description, hash} =
    advert
  const [activeTab, setActiveTab] = useState(description ? 0 : 1)
  const {setShowLogin, userHash} = useGeneralStore()

  const isUserAdv = userHash === owner.hash

  return (
    <div className='mt-4 mb-4 flex flex-col'>
      <div className='flex flex-col justify-between mb-4 s:flex-row s:items-center'>
        <div className='flex justify-between w-full flex-col s:flex-row '>
          <div className='w-full '>
            {!isUserAdv && userHash && <ProductNotes hash={hash} />}
          </div>
          <div className='ml-0 s:ml-4 flex space-x-4'>
            <div className='text-black-b text-body-3 flex items-center '>
              <IcLike className='fill-current text-black-c w-4 h-4 mr-2' />
              {favoriteCounter}
            </div>
            <div className='text-black-b text-body-3 flex items-center'>
              <IcVisibility className='fill-current text-black-c w-5 h-5 mr-2' />
              {views}
            </div>
            <span
              suppressHydrationWarning
              className='text-black-b text-body-3 whitespace-nowrap flex items-center'>
              {unixToDateTime(dateUpdated)}
            </span>
          </div>
        </div>
      </div>
      {!isUserAdv && (
        <div className='m:hidden my-4 space-y-4'>
          <CallButton phoneNum={phoneNum} />
          <ChatButton setShowLogin={setShowLogin} hash={advert.hash} />
        </div>
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
      <div className='flex justify-between flex-col s:flex-row mt-4 mb-20'>
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
  const {t} = useTranslation()
  return (
    <div className='bg-white p-4 text-black-c text-body-3 space-y-2'>
      {product.advert.fields.map((field) => {
        return (
          <div className='flex justify-between' key={field.fieldNameText}>
            <div>{field.fieldNameText}</div>
            <div>
              {field.fieldValueText.map((fieldValue) => (
                <span key={fieldValue}>
                  {fieldValue === 'true' ? t('YES') : fieldValue}
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
})

export default ProductDescription
