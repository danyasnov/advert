import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import IcVisibility from 'icons/material/Visibility.svg'
import {isEmpty} from 'lodash'
import {useTranslation} from 'next-i18next'
import {Calendar, Heart} from 'react-iconly'
import {useGeneralStore, useProductsStore} from '../providers/RootStoreProvider'
import {unixToDateTime} from '../utils'
import ProductMap from './ProductMap'
import UserCard from './UserCard'

import ProductPrice from './ProductPrice'
import ProductCommunication from './ProductCommunication'
import ProductLike from './ProductLike'
import SharePopup from './SharePopup'

const ProductDescription: FC = observer(() => {
  const {product} = useProductsStore()
  const {userHash} = useGeneralStore()

  if (!product) return null
  const {advert, owner} = product
  const {favoriteCounter, views, dateUpdated} = advert
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
      <div className='mb-10 s:mb-25'>
        <CharacteristicsTab />
      </div>
      <div className='s:hidden'>
        <UserCard />
        <div className='flex flex-col items-center space-y-5 mt-6 '>
          <ProductLike
            userHash={owner.hash}
            isFavorite={advert.isFavorite}
            hash={advert.hash}
            state={advert.state}
            type='page'
          />
          <SharePopup userHash={userHash} productHash={advert.hash} size={24} />
        </div>
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
  const titleClassName = 'text-h-5 font-bold text-greyscale-900 block'
  if (isEmpty(product.advert.fields)) return null
  return (
    <div>
      <div className='space-y-4'>
        {product.advert.fields.map((field) => {
          return (
            <div
              className='flex justify-between font-normal text-body-16'
              key={field.fieldNameText}>
              <span
                className={`${
                  field.fieldType === 'title'
                    ? `${titleClassName} my-4`
                    : 'text-greyscale-600'
                }`}>
                {field.fieldNameText}
              </span>
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
