import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {browserName} from 'react-device-detect'
import {Location} from 'react-iconly'
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
    <div className='mt-11 flex flex-col sticky top-2 pb-25'>
      <ProductPrice />
      <div className='flex items-center space-x-2 text-greyscale-400 mt-4 mb-8'>
        <Location size={18} filled />
        <span className='text-body-14 text-greyscale-800'>
          {product.advert.location.description}
        </span>
      </div>

      <ProductCommunication />
      <div
        className={`${
          browserName.toLowerCase() === 'safari'
            ? 'shadow-xl rounded-2xl'
            : 'drop-shadow-card'
        }`}>
        <div id='owner'>
          <UserCard />
        </div>
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
