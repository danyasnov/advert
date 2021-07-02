import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {toJS} from 'mobx'
import IcConditionNew from 'icons/material/ConditionNew.svg'
import IcAutoRenew from 'icons/material/AutoRenew.svg'
import IcDiscount from 'icons/material/Discount.svg'
import {useProductsStore} from '../providers/RootStoreProvider'
import {notImplementedAlert} from '../helpers'
import PrimaryButton from './Buttons/PrimaryButton'
import UserCard from './UserCard'

const ProductSidebar: FC = observer(() => {
  const {product} = useProductsStore()
  const {t} = useTranslation()

  return (
    <div className='flex flex-col'>
      <span className='text-black-b text-h-1 mb-4 font-bold'>
        {product.advert.price}
      </span>
      <span className='text-body-1 text-error line-through mb-2'>
        {product.advert.oldPrice}
      </span>
      <div className='text-body-2 text-black-b flex space-x-2'>
        {product.advert.bargainPossible && (
          <span className='flex items-center'>
            <IcConditionNew className='fill-current text-black-c h-6 w-6 mr-1' />
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
            <IcDiscount className='fill-current text-black-c h-6 w-6 mr-1' />
            {t('NEW_PRODUCT')}
          </span>
        )}
      </div>
      <PrimaryButton onClick={notImplementedAlert} className='my-4'>
        {t('SEND_A_MESSAGE')}
      </PrimaryButton>
      <UserCard />
    </div>
  )
})

export default ProductSidebar
