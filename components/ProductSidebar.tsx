import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {browserName} from 'react-device-detect'
import {useGeneralStore, useProductsStore} from '../providers/RootStoreProvider'
import UserCard from './UserCard'
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
      <div
        className={`${
          browserName.toLowerCase() === 'safari'
            ? 'shadow-xl rounded-2xl'
            : 'drop-shadow-card'
        }`}>
        <UserCard />
      </div>

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
