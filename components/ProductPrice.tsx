import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {useProductsStore} from '../providers/RootStoreProvider'

const ProductPrice: FC = observer(() => {
  const {product} = useProductsStore()
  const {advert} = product
  const isFree = advert.price === '0'
  const {t} = useTranslation()

  return (
    <div className='flex flex-col'>
      <span className='text-h-3 font-bold text-greyscale-900 mb-2'>
        {advert.title}
      </span>
      <span
        className='text-primary-500 text-h-3 font-bold'
        data-test-id='price'>
        {isFree ? t('FREE') : advert.price}
      </span>
    </div>
  )
})

export default ProductPrice
