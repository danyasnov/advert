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
import ProductPrice from './ProductPrice'
import ProductCommunication from './ProductCommunication'

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
  return (
    <div className='mt-4 mb-4 flex flex-col'>
      <div className='flex space-x-7 font-normal mb-6'>
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
      <div className='s:hidden mb-6'>
        <ProductPrice />
      </div>
      <div className='s:hidden mb-6'>
        <ProductCommunication />
      </div>

      <DescriptionTab />

      <div className='mb-10'>
        <ProductMap />
      </div>
      <CharacteristicsTab />

      <div className='s:hidden'>
        <UserCard />
      </div>
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
    <div>
      <span className='text-h-5 font-bold text-greyscale-900 mb-10'>
        {t('ABOUT_PRODUCT')}
      </span>
      <div className='space-y-4 mt-6'>
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
    </div>
  )
})

export default ProductDescription
