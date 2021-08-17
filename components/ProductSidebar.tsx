import {FC, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import IcPhone from 'icons/material/Phone.svg'
import {useProductsStore} from '../providers/RootStoreProvider'
import UserCard from './UserCard'
import ProductInfoIcons from './ProductInfoIcons'
import PrimaryButton from './Buttons/PrimaryButton'

const ProductSidebar: FC = observer(() => {
  const {product} = useProductsStore()
  const {t} = useTranslation()
  const [showPhone, setShowPhone] = useState(false)
  const {owner} = product
  const {phoneNum} = owner
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
      {/* <PrimaryButton onClick={notImplementedAlert} className='my-4'> */}
      {/*  {t('SEND_A_MESSAGE')} */}
      {/* </PrimaryButton> */}
      <UserCard />
    </div>
  )
})

export default ProductSidebar
