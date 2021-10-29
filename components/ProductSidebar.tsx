import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {useGeneralStore, useProductsStore} from '../providers/RootStoreProvider'
import UserCard from './UserCard'
import ProductInfoIcons from './ProductInfoIcons'
import CallButton from './Buttons/CallButton'
import ChatButton from './Buttons/ChatButton'

const ProductSidebar: FC = observer(() => {
  const {product} = useProductsStore()
  const {t} = useTranslation()
  const {owner, advert} = product
  const {setShowLogin, userHash} = useGeneralStore()

  const isFree = advert.price === '0'
  const isUserAdv = userHash === owner.hash

  return (
    <div className='flex flex-col space-y-4'>
      <span className='text-black-b text-h-1 font-bold'>
        {isFree ? t('FREE') : advert.price}
      </span>
      {!!advert.oldPrice && (
        <span className='text-body-1 text-error line-through'>
          {advert.oldPrice}
        </span>
      )}
      {!isUserAdv && advert.state !== 'sold' && (
        <>
          <CallButton product={product} />
          <ChatButton setShowLogin={setShowLogin} hash={advert.hash} />
        </>
      )}
      <ProductInfoIcons />
      <UserCard />
    </div>
  )
})

export default ProductSidebar
