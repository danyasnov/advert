import {FC, useEffect, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import IcPhone from 'icons/material/Phone.svg'
import {parseCookies} from 'nookies'
import {useGeneralStore, useProductsStore} from '../providers/RootStoreProvider'
import UserCard from './UserCard'
import ProductInfoIcons from './ProductInfoIcons'
import PrimaryButton from './Buttons/PrimaryButton'
import SecondaryButton from './Buttons/SecondaryButton'
import LinkWrapper from './Buttons/LinkWrapper'
import {SerializedCookiesState} from '../types'

const ProductSidebar: FC = observer(() => {
  const {product} = useProductsStore()
  const {t} = useTranslation()
  const [showPhone, setShowPhone] = useState(false)
  const {owner, advert} = product
  const {phoneNum} = owner
  const [showChat, setShowChat] = useState(false)
  const {setShowLogin} = useGeneralStore()

  useEffect(() => {
    const state: SerializedCookiesState = parseCookies()
    setShowChat(!!state.hash)
  }, [])
  return (
    <div className='flex flex-col'>
      <span className='text-black-b text-h-1 mb-4 font-bold'>
        {product.advert.price}
      </span>
      <span className='text-body-1 text-error line-through mb-4'>
        {product.advert.oldPrice}
      </span>
      {phoneNum && (
        <PrimaryButton
          onClick={() => setShowPhone(true)}
          className='hidden m:flex text-body-2 text-black-b order-0 mb-4'>
          <IcPhone className='fill-current h-4 w-4 mr-2' />
          {showPhone ? phoneNum : t('MAKE_A_CALL')}
        </PrimaryButton>
      )}
      <ProductInfoIcons />

      {showChat ? (
        <LinkWrapper
          target='_blank'
          href={`https://old.adverto.sale/cp/chat/#message-productId=${advert.hash}`}
          className='rounded-lg py-3 px-3.5 border border-shadow-b h-10 text-body-2 text-black-b flex justify-center mb-2'
          title={t('SEND_A_MESSAGE')}>
          {t('SEND_A_MESSAGE')}
        </LinkWrapper>
      ) : (
        <SecondaryButton
          className='mb-2'
          onClick={() => {
            setShowLogin(true)
          }}>
          {t('SEND_A_MESSAGE')}
        </SecondaryButton>
      )}

      <UserCard />
    </div>
  )
})

export default ProductSidebar
