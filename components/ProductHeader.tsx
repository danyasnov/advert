import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {useGeneralStore, useProductsStore} from '../providers/RootStoreProvider'
import ProductInfoIcons from './ProductInfoIcons'
import ProductLike from './ProductLike'
import ProductMenu from './ProductMenu'
import LinkWrapper from './Buttons/LinkWrapper'

const ProductHeader: FC = observer(() => {
  const {product} = useProductsStore()
  const {userHash} = useGeneralStore()
  const {t} = useTranslation()
  if (!product) return null
  const {advert, owner} = product
  const isUserAdv = userHash === owner.hash
  const isFree = advert.price === '0'
  return (
    <div>
      {advert.state === 'sold' && (
        <div className='bg-sold-background rounded-lg	px-4 py-5 mb-4'>
          <span className='text-body-1 font-bold'>{t('ITEM_SOLD')}</span>{' '}
          <LinkWrapper
            className='text-body-1 text-brand-b1'
            href={`/user/${owner.hash}`}
            title={t('YOU_CAN_SEE_OTHER_ADS_OF_SELLER')}>
            {t('YOU_CAN_SEE_OTHER_ADS_OF_SELLER')}
          </LinkWrapper>
        </div>
      )}
      <div className='flex justify-between w-full items-center mb-2'>
        <h1 className='text-h-4 font-bold m:text-h-1 text-black-b'>
          {advert.title}
        </h1>
        <div className='flex ml-4 space-x-2'>
          <ProductLike
            userHash={product.owner.hash}
            hash={product.advert.hash}
            isFavorite={product.advert.isFavorite}
            state={product.advert.state}
          />
          {isUserAdv && <ProductMenu product={product} />}
        </div>
      </div>
      <div className='flex flex-col m:hidden'>
        <span className='text-h-2 text-black-b font-bold'>
          {isFree ? t('FREE') : advert.price}
        </span>
        <div className='flex flex-col s:flex-row s:items-center s:mb-4 s:mt-2 justify-between'>
          <span className='text-body-3 text-error mt-1 s:mt-0 line-through'>
            {advert.oldPrice}
          </span>
          <div className='my-2 s:my-0'>
            <ProductInfoIcons />
          </div>
        </div>
      </div>
    </div>
  )
})

export default ProductHeader
