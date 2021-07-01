import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {parseCookies} from 'nookies'
import IcVisibility from 'icons/material/Visibility.svg'
import IcMoreHoriz from 'icons/material/MoreHoriz.svg'
import {toJS} from 'mobx'
import IcLike from 'icons/material/Like.svg'
import {
  useCategoriesStore,
  useProductsStore,
} from '../providers/RootStoreProvider'
import {SerializedCookiesState} from '../types'
import Button from './Buttons/Button'
import {notImplementedAlert} from '../helpers'
import OutlineButton from './Buttons/OutlineButton'
import {unixToDate, unixToDateTime} from '../utils'

const ProductDescription: FC = observer(() => {
  // const {categoryData} = useCategoriesStore()
  const {product} = useProductsStore()
  console.log(toJS(product))
  const {t} = useTranslation()
  const state: SerializedCookiesState = parseCookies()

  // if (!categoryData) return null
  return (
    <div className=''>
      <div className='flex justify-between'>
        <OutlineButton
          onClick={notImplementedAlert}
          className='text-black-b text-body-2'>
          {t('ADD_NOTE')}
        </OutlineButton>
        <div className='flex items-center space-x-6'>
          <Button
            onClick={notImplementedAlert}
            className='text-black-b text-body-2'>
            <IcLike className='fill-current text-black-c w-4 h-4 mr-2' />
            {product.advert.favoriteCounter}
          </Button>
          <Button
            onClick={notImplementedAlert}
            className='text-black-b text-body-2'>
            <IcVisibility className='fill-current text-black-c w-5 h-5 mr-2' />
            {product.advert.views}
          </Button>
          <span suppressHydrationWarning className='text-black-b text-body-2'>
            {unixToDateTime(product.advert.dateUpdated)}
          </span>
        </div>
      </div>
    </div>
  )
})

export default ProductDescription
