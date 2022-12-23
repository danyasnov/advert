import {FC} from 'react'
import {AdvertiseListItemModel} from 'front-api'
import {isEmpty} from 'lodash'
import ScrollableCardGroup from './Cards/ScrollableCardGroup'
import EmptyTab from './EmptyTab'
import {AdvertNotFoundWithDescription} from './AdvertNotFound'
import {PAGE_LIMIT} from '../stores/ProductsStore'

interface Props {
  products: AdvertiseListItemModel[]
  state: string
  count?: number
  page?: number
  limit?: number
  hideNotFoundDescription?: boolean
  disableScroll?: boolean
  enableFourthColumnForM?: boolean
  enableFiveColumnsForL?: boolean
  enableTwoColumnsForS?: boolean
  showMenu?: boolean
  disableVipWidth?: boolean
  fetchProducts?: () => void
  tab?: string
}

const UserTabWrapper: FC<Props> = ({
  products = [],
  state,
  count,
  page,
  fetchProducts,
  disableScroll,
  enableFourthColumnForM,
  enableTwoColumnsForS,
  enableFiveColumnsForL,
  disableVipWidth,
  limit = PAGE_LIMIT,
  showMenu,
  tab,
}) => {
  if (isEmpty(products) && tab === 'moderation') {
    return (
      <div className='flex justify-center'>
        <EmptyTab
          description='NO_PRODUCTS_FOR_MODERATION'
          img='/img/empty-tab.png'
        />
      </div>
    )
  }

  if (isEmpty(products) && tab === 'sale') {
    return (
      <div className='flex justify-center'>
        <EmptyTab description='NO_PRODUCTS_FOR_SALE' img='/img/empty-tab.png' />
      </div>
    )
  }

  if (isEmpty(products) && tab === 'sold') {
    return (
      <div className='flex justify-center'>
        <EmptyTab description='NO_PRODUCTS_SOLD' img='/img/empty-tab.png' />
      </div>
    )
  }

  if (isEmpty(products) && tab === 'archive') {
    return (
      <div className='flex justify-center'>
        <EmptyTab description='DRAWINGS_EMPTY' img='/img/empty-tab.png' />
      </div>
    )
  }

  if (
    isEmpty(products) &&
    isEmpty(ScrollableCardGroup) &&
    tab === 'favorites'
  ) {
    return (
      <div className='flex justify-center'>
        <EmptyTab description='FAVOURITES_EMPTY' img='/img/favorites-tab.png' />
      </div>
    )
  }

  return (
    <ScrollableCardGroup
      showMenu={showMenu}
      products={products}
      page={page}
      count={count}
      state={state}
      disableScroll={disableScroll}
      enableFourthColumnForM={enableFourthColumnForM}
      enableTwoColumnsForS={enableTwoColumnsForS}
      enableFiveColumnsForL={enableFiveColumnsForL}
      disableVipWidth={disableVipWidth}
      limit={limit}
      fetchProducts={fetchProducts}
    />
  )
}

export default UserTabWrapper
