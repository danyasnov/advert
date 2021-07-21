import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import IcLikeEmpty from 'icons/material/LikeEmpty.svg'
import IcMoreHoriz from 'icons/material/MoreHoriz.svg'
import {useProductsStore} from '../providers/RootStoreProvider'
import Button from './Buttons/Button'
import {notImplementedAlert} from '../helpers'
import ProductInfoIcons from './ProductInfoIcons'

const ProductHeader: FC = observer(() => {
  const {product} = useProductsStore()
  if (!product) return null

  return (
    <>
      <div className='flex justify-between w-full items-center mb-2'>
        <h1 className='text-h-4 font-bold m:text-h-1 text-black-b'>
          {product.advert.title}
        </h1>
        <div className='flex ml-4 self-start'>
          <Button onClick={notImplementedAlert} className='mr-2'>
            <IcLikeEmpty
              className='fill-current text-black-c'
              width={24}
              height={24}
            />
          </Button>
          <Button onClick={notImplementedAlert}>
            <IcMoreHoriz
              className='fill-current text-black-c'
              width={24}
              height={24}
            />
          </Button>
        </div>
      </div>
      <div className='flex flex-col m:hidden'>
        <span className='text-h-2 text-black-b font-bold'>
          {product.advert.price}
        </span>
        <div className='flex flex-col s:flex-row s:items-center s:mb-4 s:mt-2 s:justify-between'>
          {!!product.advert.oldPrice && (
            <span className='text-body-3 text-notification-success mt-1 s:mt-0 line-through	'>
              {product.advert.oldPrice}
            </span>
          )}
          <div className='my-2 s:my-0'>
            <ProductInfoIcons />
          </div>
        </div>
      </div>
    </>
  )
})

export default ProductHeader
