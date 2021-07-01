import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {parseCookies} from 'nookies'
import IcLikeEmpty from 'icons/material/LikeEmpty.svg'
import IcMoreHoriz from 'icons/material/MoreHoriz.svg'
import {toJS} from 'mobx'
import {
  useCategoriesStore,
  useProductsStore,
} from '../providers/RootStoreProvider'
import {SerializedCookiesState} from '../types'
import Button from './Buttons/Button'
import {notImplementedAlert} from '../helpers'

const ProductHeader: FC = observer(() => {
  // const {categoryData} = useCategoriesStore()
  const {product} = useProductsStore()
  console.log(toJS(product))
  const {t} = useTranslation()
  const state: SerializedCookiesState = parseCookies()

  // if (!categoryData) return null
  return (
    <div className='flex justify-between border-b border-shadow-b pb-4 mb-6 mt-4 w-full items-center'>
      <h1 className='text-h-1 text-black-b '>{product.advert.title}</h1>
      <div className='flex'>
        <Button onClick={notImplementedAlert} className='mr-2'>
          <IcLikeEmpty
            className='fill-current text-black-c'
            width={24}
            height={24}
          />
        </Button>
        <Button onClick={notImplementedAlert}>
          <IcMoreHoriz
            className='fill-current text-black-c'
            width={24}
            height={24}
          />
        </Button>
      </div>
    </div>
  )
})

export default ProductHeader
