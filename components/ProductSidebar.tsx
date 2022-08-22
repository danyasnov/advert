import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {useGeneralStore, useProductsStore} from '../providers/RootStoreProvider'
import UserCard from './UserCard'
import ProductInfoIcons from './ProductInfoIcons'
import CallButton from './Buttons/CallButton'
import ChatButton from './Buttons/ChatButton'
import DeactivateAdvButton from './Buttons/DeactivateAdvButton'
import ProductPrice from './ProductPrice'

const ProductSidebar: FC = observer(() => {
  const {product} = useProductsStore()
  const {t} = useTranslation()
  const {owner, advert} = product
  const {setShowLogin, userHash} = useGeneralStore()

  const isFree = advert.price === '0'
  const isUserAdv = userHash === owner.hash

  return (
    <div className='flex flex-col space-y-10'>
      <ProductPrice />

      {/* {isUserAdv && advert.state === 'active' && ( */}
      {/*  <DeactivateAdvButton product={product} /> */}
      {/* )} */}
      <UserCard />
    </div>
  )
})

export default ProductSidebar
