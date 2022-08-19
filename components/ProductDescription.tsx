import {FC, useState} from 'react'
import {observer} from 'mobx-react-lite'
import IcVisibility from 'icons/material/Visibility.svg'
import IcLike from 'icons/material/Like.svg'
import {isEmpty, size} from 'lodash'
import {FieldDTO} from 'front-api/src/models/index'
import {useTranslation} from 'next-i18next'
import {toJS} from 'mobx'
import {Calendar, Heart} from 'react-iconly'
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
  if (description) tabs.push({id: 0, title: 'DESCRIPTION_TAB'})
  if (size(fields)) tabs.push({id: 1, title: 'CHARACTERISTICS_TAB'})
  return tabs
}
const ProductDescription: FC = observer(() => {
  const {product} = useProductsStore()
  if (!product) return null
  const {advert, owner} = product
  const {phoneNum} = owner
  const {
    favoriteCounter,
    views,
    dateUpdated,
    fields,
    description,
    state,
    hash,
  } = advert
  const [activeTab, setActiveTab] = useState(description ? 0 : 1)
  const {setShowLogin, userHash} = useGeneralStore()
  const {t} = useTranslation()

  const isUserAdv = userHash === owner.hash
  console.log(toJS(advert))
  return (
    <div className='mt-4 mb-4 flex flex-col'>
      <div className='flex flex-col justify-between mb-6 s:flex-row s:items-center'>
        <div className='flex justify-between w-full flex-col s:flex-row '>
          {/* <div className='w-full '> */}
          {/*  {!isUserAdv && userHash && <ProductNotes hash={hash} />} */}
          {/* </div> */}
          <div className='flex space-x-7 font-normal'>
            <div className='text-greyscale-500 flex space-x-3'>
              <Calendar filled />
              <span
                suppressHydrationWarning
                className='text-body-12 text-greyscale-900 font-normal whitespace-nowrap flex items-center'>
                {unixToDateTime(dateUpdated)}
              </span>
            </div>
            <div className='flex items-center space-x-3'>
              <IcVisibility className='fill-current text-greyscale-500 w-6 h-6' />
              <span className='text-body-12 text-greyscale-900'>{views}</span>
            </div>
            <div className='flex items-center space-x-3 text-greyscale-500'>
              <Heart size={16} filled />
              <span className='text-greyscale-900 text-body-12'>
                {favoriteCounter}
              </span>
            </div>
          </div>
        </div>
      </div>

      <DescriptionTab />
      {/* {!isUserAdv && state !== 'sold' && ( */}
      {/*  <div className='m:hidden my-4 space-y-4'> */}
      {/*    /!* <CallButton product={product} /> *!/ */}
      {/*    <ChatButton setShowLogin={setShowLogin} hash={advert.hash} /> */}
      {/*  </div> */}
      {/* )} */}

      {/* <div className='mb-2 s:mb-4 m:hidden'> */}
      {/*  <UserCard /> */}
      {/* </div> */}

      <div className='-mx-4 s:-mx-0 mb-10'>
        <ProductMap />
      </div>
      <CharacteristicsTab />
      {/* <div className='h-full flex flex-col'> */}
      {/*  <Tabs */}
      {/*    items={getTabs(description, fields)} */}
      {/*    value={activeTab} */}
      {/*    onChange={(id) => setActiveTab(id)} */}
      {/*  /> */}
      {/*  {activeTab === 0 && <DescriptionTab />} */}
      {/*  {activeTab === 1 && <CharacteristicsTab />} */}
      {/* </div> */}
      {/* <div className='flex justify-between flex-col s:flex-row mt-4 mb-20'> */}
      {/*  <SharePopup */}
      {/*    userHash={product.owner.hash} */}
      {/*    productHash={product.advert.hash} */}
      {/*  /> */}

      {/*  <div className='flex justify-end mt-4 text-body-14 flex-col s:flex-row s:space-x-4'> */}
      {/*    /!* <SecondaryButton *!/ */}
      {/*    /!*  onClick={notImplementedAlert} *!/ */}
      {/*    /!*  className='mb-2 s:mb-0'> *!/ */}
      {/*    /!*  <IcNoEntry className='fill-current text-black-c h-4 w-4 mr-2' /> *!/ */}
      {/*    /!*  {t('BLOCK_MESSAGE')} *!/ */}
      {/*    /!* </SecondaryButton> *!/ */}
      {/*    /!* <SecondaryButton onClick={notImplementedAlert}> *!/ */}
      {/*    /!*  <IcService className='fill-current text-black-c h-4 w-4 mr-2' /> *!/ */}
      {/*    /!*  {t('SUPPORT')} *!/ */}
      {/*    /!* </SecondaryButton> *!/ */}
      {/*  </div> */}
      {/* </div> */}
    </div>
  )
})

const DescriptionTab: FC = observer(() => {
  const {product} = useProductsStore()

  if (!product.advert.description) return null
  return (
    <div className='text-greyscale-900 text-body-14 font-normal break-words whitespace-pre-wrap mb-10'>
      {product.advert.description}
    </div>
  )
})

const CharacteristicsTab: FC = observer(() => {
  const {product} = useProductsStore()
  const {t} = useTranslation()
  if (isEmpty(product.advert.fields)) return null
  return (
    <div className='space-y-4'>
      <span className='text-h-5 font-bold text-greyscale-900 pb-6'>
        {t('ABOUT_PRODUCT')}
      </span>
      {product.advert.fields.map((field) => {
        return (
          <div
            className='flex justify-between font-normal text-body-16'
            key={field.fieldNameText}>
            <span className='text-greyscale-600'>{field.fieldNameText}</span>
            <div>
              {field.fieldValueText.map((fieldValue, index, array) => (
                <span key={fieldValue} className='text-greyscale-900'>
                  {fieldValue === 'true' ? t('YES') : fieldValue}
                  {array.length !== index + 1 ? ', ' : ''}
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
