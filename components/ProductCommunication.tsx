import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import CallButton from './Buttons/CallButton'
import ChatButton from './Buttons/ChatButton'
import {useGeneralStore, useProductsStore} from '../providers/RootStoreProvider'

const ProductCommunication: FC = observer(() => {
  const {product} = useProductsStore()
  const {t} = useTranslation()
  const {owner, advert} = product
  const {setShowLogin, userHash} = useGeneralStore()

  const isUserAdv = userHash === owner.hash

  if (isUserAdv || advert.state === 'sold') return null
  return (
    <div>
      <CallButton
        className='text-white space-x-2 bg-primary-500 rounded-2xl w-full h-[60px] mb-4'
        hash={advert.hash}
        ownerHash={owner.hash}
        rootCategoryId={advert.rootCategoryId}
      />
      {/* <ChatButton setShowLogin={setShowLogin} hash={advert.hash} /> */}
    </div>
  )
})

export default ProductCommunication
