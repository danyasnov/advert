import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {useGeneralStore, useProductsStore} from '../providers/RootStoreProvider'
import UserCard from './UserCard'
import ProductInfoIcons from './ProductInfoIcons'
import CallButton from './Buttons/CallButton'
import ChatButton from './Buttons/ChatButton'
import DeactivateAdvButton from './Buttons/DeactivateAdvButton'

const ProductSidebar: FC = observer(() => {
  const {product} = useProductsStore()
  const {t} = useTranslation()
  const {owner, advert} = product
  const {setShowLogin, userHash} = useGeneralStore()

  const isFree = advert.price === '0'
  const isUserAdv = userHash === owner.hash

  return (
    <div className='flex flex-col space-y-4'>
      <span
        className='text-greyscale-900 text-body-14 font-bold'
        data-test-id='price'>
        {isFree ? t('FREE') : advert.price}
      </span>
      {!!advert.oldPrice && (
        <span
          data-test-id='old-price'
          className='text-body-16 text-error line-through'>
          {advert.oldPrice}
        </span>
      )}
      <ProductInfoIcons />
      {!isUserAdv && advert.state !== 'sold' && (
        <>
          {/* <CallButton product={product} /> */}
          <ChatButton setShowLogin={setShowLogin} hash={advert.hash} />
        </>
      )}
      {isUserAdv && advert.state === 'active' && (
        <DeactivateAdvButton product={product} />
      )}
      <UserCard />
    </div>
  )
})

export default ProductSidebar
