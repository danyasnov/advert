import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import IcConditionNew from 'icons/material/ConditionNew.svg'
import IcAutoRenew from 'icons/material/AutoRenew.svg'
import IcDiscount from 'icons/material/Discount.svg'
import {useProductsStore} from '../providers/RootStoreProvider'

const ProductInfoIcons: FC = observer(() => {
  const {product} = useProductsStore()
  const {t} = useTranslation()
  if (!product) return null

  return (
    <div className='text-body-2 text-black-b flex space-x-2'>
      {product.advert.bargainPossible && (
        <span className='flex items-center'>
          <IcDiscount className='fill-current text-black-c h-6 w-6 mr-1' />

          {t('BARGAIN')}
        </span>
      )}
      {product.advert.swapPossible && (
        <span className='flex items-center'>
          <IcAutoRenew className='fill-current text-black-c h-6 w-6 mr-1' />
          {t('EXCHANGE')}
        </span>
      )}

      {product.advert.condition === 'new' && (
        <span className='flex items-center'>
          <IcConditionNew className='fill-current text-black-c h-6 w-6 mr-1' />
          {t('NEW_PRODUCT')}
        </span>
      )}
    </div>
  )
})

export default ProductInfoIcons
