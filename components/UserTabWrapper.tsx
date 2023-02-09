import {FC} from 'react'
import {isEmpty} from 'lodash'
import ScrollableCardGroup, {
  ScrollableCardGroupInterface,
} from './Cards/ScrollableCardGroup'
import EmptyTab from './EmptyTab'
import {PAGE_LIMIT} from '../stores/ProductsStore'

interface Props extends ScrollableCardGroupInterface {
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
  tab,
  getOptions,
}) => {
  if (isEmpty(products) && tab === 'drafts') {
    return (
      <div className='flex justify-center'>
        <EmptyTab
          description='DRAWINGS_EMPTY'
          img='/img/empty-tabs/search.png'
        />
      </div>
    )
  }

  if (isEmpty(products) && tab === 'moderation') {
    return (
      <div className='flex justify-center'>
        <EmptyTab
          description='NO_PRODUCTS_FOR_MODERATION'
          img='/img/empty-tabs/moderation.png'
        />
      </div>
    )
  }

  if (isEmpty(products) && tab === 'sale') {
    return (
      <div className='flex justify-center'>
        <EmptyTab
          description='NO_PRODUCTS_FOR_SALE'
          img='/img/empty-tabs/sell.png'
        />
      </div>
    )
  }

  if (isEmpty(products) && tab === 'other-sale') {
    return (
      <div className='flex justify-center'>
        <EmptyTab
          description='EMPTY_OTHER_SALE_PRODUCTS_PLACEHOLDER'
          img='/img/empty-tabs/sell.png'
        />
      </div>
    )
  }

  if (isEmpty(products) && tab === 'sold') {
    return (
      <div className='flex justify-center'>
        <EmptyTab
          description='NO_PRODUCTS_SOLD'
          img='/img/empty-tabs/sold.png'
        />
      </div>
    )
  }

  if (isEmpty(products) && tab === 'other-sold') {
    return (
      <div className='flex justify-center'>
        <EmptyTab
          description='EMPTY_OTHER_SOLD_PRODUCTS_PLACEHOLDER'
          img='/img/empty-tabs/search.png'
        />
      </div>
    )
  }

  if (isEmpty(products) && tab === 'archive') {
    return (
      <div className='flex justify-center'>
        <EmptyTab
          description='ARCHIVE_EMPTY'
          img='/img/empty-tabs/archive.png'
        />
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
        <EmptyTab
          description='FAVOURITES_EMPTY'
          img='/img/empty-tabs/favorites.png'
        />
      </div>
    )
  }

  return (
    <ScrollableCardGroup
      getOptions={getOptions}
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
