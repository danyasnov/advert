import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {ArrowDown, ArrowUp} from 'react-iconly'
import {useProductsStore} from '../providers/RootStoreProvider'
import {getDigitsFromString} from '../utils'

const ProductPrice: FC = observer(() => {
  const {product} = useProductsStore()
  const {advert} = product
  const {oldPrice, discount, price, isVip} = advert
  const isFree = price === '0'
  const {t} = useTranslation()
  let showOldPrice = false
  let formattedOldPrice = ''
  if (discount && oldPrice) {
    const priceDigits = getDigitsFromString(price)
    const oldPriceDigits = getDigitsFromString(oldPrice)
    if (isVip) {
      showOldPrice = true
      formattedOldPrice = oldPrice
    } else if (priceDigits?.length <= 6 && oldPriceDigits?.length <= 6) {
      showOldPrice = true
      formattedOldPrice = oldPrice.slice(0, -2)
    }
  }
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
        {(showOldPrice || (isVip && discount)) && (
          <div className='flex items-center ml-4 s:ml-0 m:ml-4'>
            <span className='text-h-4 text-greyscale-600 line-through '>
              {formattedOldPrice}
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
