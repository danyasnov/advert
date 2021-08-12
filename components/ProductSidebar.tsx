import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {useProductsStore} from '../providers/RootStoreProvider'
import UserCard from './UserCard'
import ProductInfoIcons from './ProductInfoIcons'

const ProductSidebar: FC = observer(() => {
  const {product} = useProductsStore()

  return (
    <div className='flex flex-col'>
      <span className='text-black-b text-h-1 mb-4 font-bold'>
        {product.advert.price}
      </span>
      <span className='text-body-1 text-error line-through mb-4'>
        {product.advert.oldPrice}
      </span>

      <ProductInfoIcons />
      {/* <PrimaryButton onClick={notImplementedAlert} className='my-4'> */}
      {/*  {t('SEND_A_MESSAGE')} */}
      {/* </PrimaryButton> */}
      <UserCard />
    </div>
  )
})

export default ProductSidebar
