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
    <div className='flex flex-col'>
      <span className='text-h-3 font-bold text-greyscale-900 mb-2'>
        {advert.title}
      </span>
      <span
        className='text-primary-500 text-h-3 font-bold mb-10'
        data-test-id='price'>
        {isFree ? t('FREE') : advert.price}
      </span>
      {!isUserAdv && advert.state !== 'sold' && (
        <div className='my-10'>
          <CallButton
            className='text-white space-x-2 bg-primary-500 rounded-2xl w-[224px] h-[60px] mb-4'
            hash={advert.hash}
            ownerHash={owner.hash}
            rootCategoryId={advert.rootCategoryId}
          />
          <ChatButton setShowLogin={setShowLogin} hash={advert.hash} />
        </div>
      )}
      {/* {isUserAdv && advert.state === 'active' && ( */}
      {/*  <DeactivateAdvButton product={product} /> */}
      {/* )} */}
      <UserCard />
    </div>
  )
})

export default ProductSidebar
