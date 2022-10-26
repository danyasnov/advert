import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {Discount} from 'react-iconly'
import IcFlash from 'icons/material/Flash.svg'
import {
  useProductsStore,
} from '../providers/RootStoreProvider'

const ProductBadge: FC = observer(() => {
  const {t} = useTranslation()
  const {product} = useProductsStore()
  const {advert} = product
  if (advert.categoryId !== 23) {
    return null
  }

  if (advert.condition === 'new') {
    return (
      <div className='flex space-x-2 px-8 py-4 bg-gradient-to-l from-[#FACC15] to-[#FFE580] rounded-3xl'>
        <IcFlash className='w-6 h-6' />
        <span className='text-body-18 text-primary-500 uppercase font-bold'>
          {t('NEW_PRODUCT')}
        </span>
      </div>
    )
  }
  if (advert.condition === 'used') {
    return (
      <div className='flex space-x-2 px-8 py-4 bg-gradient-to-l from-[#7210FF] to-[#9D59FF] rounded-3xl'>
        <div className='text-white'>
          <Discount filled size={24} />
        </div>
        <span className='text-body-18 text-white uppercase font-bold'>
          {t('USED_PRODUCT')}
        </span>
      </div>
    )
  }
  return null
})

export default ProductBadge
