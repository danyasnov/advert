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
import SharePopup from './SharePopup'
import ProductLike from './ProductLike'
import ProductCommunication from './ProductCommunication'

const ProductSidebar: FC = observer(() => {
  const {product} = useProductsStore()
  const {t} = useTranslation()
  const {advert, owner} = product
  const {userHash} = useGeneralStore()

  return (
    <div className='flex flex-col space-y-10'>
      <ProductPrice />
      <ProductCommunication />
      <UserCard />
      <div className='flex flex-col items-center space-y-5'>
        <ProductLike
          userHash={owner.hash}
          isFavorite={advert.isFavorite}
          hash={advert.hash}
          state={advert.state}
          type='page'
        />
        <SharePopup userHash={userHash} productHash={advert.hash} size={24} />
      </div>
    </div>
  )
})

export default ProductSidebar
