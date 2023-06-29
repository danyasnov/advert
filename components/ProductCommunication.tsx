import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import CallButton from './Buttons/CallButton'
import {useGeneralStore, useProductsStore} from '../providers/RootStoreProvider'
import ChatButton from './Buttons/ChatButton'

const ProductCommunication: FC = observer(() => {
  const {product} = useProductsStore()
  const {owner, advert} = product
  const {userHash} = useGeneralStore()
  const {t} = useTranslation()
  const isUserAdv = userHash === owner.hash

  if (isUserAdv || advert.state === 'sold') {
    return null
  }

  return (
    <div>
      {advert.showCallButton && (
        <CallButton
          className='text-white space-x-2 bg-primary-500 rounded-2xl w-full h-[52px] mb-4'
          hash={advert.hash}
          ownerHash={owner.hash}>
          <span className='text-body-16 font-bold'>{t('CONTACT_SELLER')}</span>
        </CallButton>
      )}
      <ChatButton product={product} />
    </div>
  )
})

export default ProductCommunication
