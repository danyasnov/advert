import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {useGeneralStore, useProductsStore} from '../providers/RootStoreProvider'
import ProductInfoIcons from './ProductInfoIcons'
import ProductLike from './ProductLike'
import ProductMenu from './ProductMenu'

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
      <div className='flex justify-between w-full items-center mb-2'>
        <h1 className='text-h-4 font-bold m:text-h-1 text-black-b'>
          {advert.title}
        </h1>
        <div className='flex ml-4 space-x-2'>
          {userHash && !isUserAdv && <ProductLike product={product} />}
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
