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
  const {phoneNum} = owner
  const {setShowLogin, userHash} = useGeneralStore()

  const isFree = advert.price === '0'
  const isUserAdv = userHash === owner.hash

  return (
    <div className='flex flex-col'>
      <span className='text-black-b text-h-1 mb-4 font-bold'>
        {isFree ? t('FREE') : advert.price}
      </span>
      <span className='text-body-1 text-error line-through mb-4'>
        {advert.oldPrice}
      </span>
      {!isUserAdv && (
        <>
          <CallButton phoneNum={phoneNum} />
          <ChatButton setShowLogin={setShowLogin} hash={advert.hash} />
        </>
      )}
      <ProductInfoIcons />
      <UserCard />
    </div>
  )
})

export default ProductSidebar
