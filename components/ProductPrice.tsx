import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {ArrowDown, ArrowUp} from 'react-iconly'
import {useProductsStore} from '../providers/RootStoreProvider'

const ProductPrice: FC = observer(() => {
  const {product} = useProductsStore()
  const {advert} = product
  const {oldPrice, discount} = advert
  const isFree = advert.price === '0'
  const {t} = useTranslation()
  const showOldPrice = discount && oldPrice
  return (
    <div className='flex flex-col'>
      <span className='text-body-18 font-bold text-greyscale-900 mb-2 break-words'>
        {advert.title}
      </span>
      <div className='flex s:flex-col m:flex-row'>
        <span
          className='text-primary-500 text-h-3 font-bold'
          data-test-id='price'>
          {isFree ? t('FREE') : advert.price}
        </span>
        {showOldPrice && (
          <div className='flex items-center ml-4 s:ml-0 m:ml-4'>
            <span className='text-h-4 text-greyscale-600 line-through '>
              {oldPrice}
            </span>
            <span
              className={`${
                discount?.isPriceDown ? 'text-green' : 'text-error'
              } `}>
              {discount?.isPriceDown ? (
                <ArrowDown size={24} style={{display: 'inline'}} />
              ) : (
                <ArrowUp size={24} style={{display: 'inline'}} />
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  )
})

export default ProductPrice
