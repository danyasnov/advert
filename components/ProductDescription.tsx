import {FC, useState} from 'react'
import {observer} from 'mobx-react-lite'
import IcVisibility from 'icons/material/Visibility.svg'
import IcTranslate from 'icons/Translate.svg'
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
import ProductBadges from './ProductBadges'
import Button from './Buttons/Button'

const ProductDescription: FC = observer(() => {
  const {product} = useProductsStore()
  const {userHash} = useGeneralStore()
  const {t} = useTranslation()
  if (!product) return null
  const {advert, owner} = product
  const {favoriteCounter, views, dateUpdated} = advert
  return (
    <div className='mt-4 mb-4 flex flex-col'>
      <div className='flex space-x-1 s:space-x-7 font-normal mb-6 text-center'>
        <div className='text-greyscale-500 flex space-x-1 s:space-x-3'>
          <Calendar filled />
          <span
            suppressHydrationWarning
            className='text-body-12 text-greyscale-900 font-normal whitespace-nowrap flex items-center'>
            {unixToDateTime(dateUpdated)}
          </span>
        </div>
        <div className='flex items-center space-x-1 s:space-x-3'>
          <IcVisibility className='fill-current text-greyscale-500 w-6 h-6' />
          <span className='text-body-12 text-greyscale-900'>
            {t('VIEWED', {count: views})}
          </span>
        </div>
        <div className='flex items-center space-x-1 s:space-x-3 text-greyscale-500'>
          <Heart size={16} filled />
          <span className='text-greyscale-900 text-body-12'>
            {t('FAVORITED', {count: favoriteCounter})}
          </span>
        </div>
      </div>
      <ProductBadges />
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
  const {t} = useTranslation()
  const {product} = useProductsStore()
  const [translate, setTranslate] = useState(true)

  if (!product.advert.description) return null
  return (
    <>
      <div className='text-greyscale-900 text-body-14 font-normal break-words whitespace-pre-wrap mb-3'>
        {translate
          ? product.advert.description
          : product.advert.descriptionOriginal}
      </div>
      {!!product.advert.descriptionOriginal && (
        <div className='flex justify-start mb-6 s:mb-10'>
          <Button
            onClick={() => {
              setTranslate(!translate)
            }}>
            <div className='flex items-center space-x-2'>
              <IcTranslate className='h-[18px] w-[18px]' />
              <span className='text-body-12 text-greyscale-900 hover:text-primary-500 font-bold underline'>
                {t(translate ? 'SHOW_ORIGINAL' : 'TRANSLATE')}
              </span>
            </div>
          </Button>
        </div>
      )}
    </>
  )
})

const CharacteristicsTab: FC = observer(() => {
  const {product} = useProductsStore()
  const {t} = useTranslation()

  if (isEmpty(product.advert.fields)) return null
  return (
    <div>
      <div className='space-y-4 l:space-y-0 l:flex l:flex-wrap l:justify-between'>
        {product.advert.fields.map((field) => {
          return (
            <div
              className={`flex justify-between font-normal text-body-16 text-left ${
                field.fieldType === 'title' ? `w-full` : 's:w-[364px]'
              }`}
              key={field.fieldNameText}>
              <span
                className={`${
                  field.fieldType === 'title'
                    ? `text-h-5 font-bold text-greyscale-900 block my-4 `
                    : 'text-greyscale-600'
                }`}>
                {field.fieldNameText}
              </span>
              <div className='text-right'>
                {field.fieldValueText.map((fieldValue, index, array) => (
                  <span key={fieldValue} className='text-greyscale-900 '>
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
