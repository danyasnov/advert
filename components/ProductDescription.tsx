import {FC, useState} from 'react'
import {observer} from 'mobx-react-lite'
import IcVisibility from 'icons/material/Visibility.svg'
import IcTranslate from 'icons/Translate.svg'
import {isEmpty, size} from 'lodash'
import {useTranslation} from 'next-i18next'
import {
  ArrowLeftSquare,
  Calendar,
  Delete,
  Edit,
  Heart,
  Setting,
  TickSquare,
} from 'react-iconly'
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
import BottomSheetDropdown from './BottomSheetDropdown'
import {TGetOptions} from '../types'
import ProductMenu from './ProductMenu'

const ProductDescription: FC<{getOptions: TGetOptions}> = observer(
  ({getOptions}) => {
    const {product} = useProductsStore()
    const isTransport = product.advert.categoryId === 23
    const {userHash} = useGeneralStore()
    const {t} = useTranslation()
    if (!product) return null
    const {advert, owner} = product
    const {favoriteCounter, views, dateUpdated} = advert

    return (
      <div className='mt-4 mb-4 flex flex-col'>
        <div className='flex font-normal mb-4 text-center flex-wrap'>
          <div className='text-greyscale-500 flex space-x-3 mr-3 s:mr-7 mb-2'>
            <Calendar filled />
            <span
              suppressHydrationWarning
              className='text-body-12 text-greyscale-900 font-normal whitespace-nowrap flex items-center'>
              {unixToDateTime(dateUpdated)}
            </span>
          </div>
          <div className='flex items-center space-x-3 mr-3 s:mr-7 mb-2'>
            <IcVisibility className='fill-current text-greyscale-500 w-6 h-6' />
            <span className='text-body-12 text-greyscale-900'>
              {t('VIEWED', {count: views})}
            </span>
          </div>
          <div className='flex items-center space-x-3 text-greyscale-500 mr-3 s:mr-7 mb-2'>
            <div className='w-6 h-6 flex items-center justify-center'>
              <Heart size={20} filled />
            </div>
            <span className='text-greyscale-900 text-body-12'>
              {t('FAVORITED', {count: favoriteCounter})}
            </span>
          </div>
        </div>
        {userHash === owner.hash && (
          <div className='block s:hidden mb-6'>
            <BottomSheetDropdown
              label={t('MANAGE_AD')}
              labelIcon={<Setting size={16} filled />}
              renderOptions={(setOpen) => (
                <ProductMenu
                  getOptions={getOptions}
                  hash={advert.hash}
                  title={advert.title}
                  images={advert.images}
                  listRender={(innerOptions) => (
                    <div className='flex flex-col w-full'>
                      {/* eslint-disable-next-line no-shadow */}
                      {innerOptions.map(({title, onClick, icon}, index) => (
                        <Button
                          key={title}
                          className='w-full px-5'
                          onClick={() => {
                            onClick()
                            setOpen(false)
                          }}>
                          <div
                            className={`w-full flex items-center justify-between py-4 border-b ${
                              index === innerOptions.length - 1
                                ? 'border-transparent'
                                : 'border-nc-border'
                            }`}>
                            <div className='flex space-x-3'>
                              {!!icon && icon}
                              <span className='text-body-16 text-nc-text-primary'>
                                {t(title)}
                              </span>
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  )}
                />
              )}
            />
          </div>
        )}

        <ProductBadges />
        <div className='s:hidden mb-6'>
          <ProductPrice />
        </div>
        <div className='s:hidden mb-6'>
          <ProductCommunication />
        </div>

        {isTransport ? (
          <>
            <div>
              <CharacteristicsTab />
            </div>
            <div>
              <DescriptionTab />
            </div>
            <div className='mb-10 s:mb-25'>
              <ProductMap />
            </div>
          </>
        ) : (
          <>
            <DescriptionTab />
            <div className='mb-10'>
              <ProductMap />
            </div>
            <div className='mb-10 s:mb-25'>
              <CharacteristicsTab />
            </div>
          </>
        )}

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
            <SharePopup
              userHash={userHash}
              productHash={advert.hash}
              size={24}
            />
          </div>
        </div>
      </div>
    )
  },
)

const DescriptionTab: FC = observer(() => {
  const {t} = useTranslation()
  const {product} = useProductsStore()
  const [translate, setTranslate] = useState(true)

  if (!product.advert.description) return null
  return (
    <>
      {product.advert.categoryId === 23 && (
        <span className='text-h-5 font-bold text-greyscale-900 block my-4 mb-6'>
          {t('DESCRIPTION_AD')}
        </span>
      )}
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
      <div className='l:flex l:flex-wrap l:justify-between'>
        {product.advert.fields.map((field) => {
          return (
            <div
              className={`flex justify-between font-normal text-body-16 text-left mb-4 ${
                field.fieldType === 'title' ? `w-full` : 's:w-[364px]'
              }`}
              key={field.fieldNameText}>
              <div className='flex'>
                {field.fieldType !== 'title' &&
                  product.advert.categoryId === 23 && (
                    <div className='text-green mr-2.5'>
                      <TickSquare set='bold' />
                    </div>
                  )}
                <span
                  className={`${
                    field.fieldType === 'title'
                      ? `text-h-5 font-bold text-greyscale-900 block my-4 `
                      : 'text-greyscale-600'
                  }`}>
                  {field.fieldNameText}
                </span>
              </div>

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
