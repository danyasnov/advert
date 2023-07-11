import {FC} from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import {isEmpty} from 'lodash'
import {AdvertiseListItemModel} from 'front-api'
import Card from './Card'
import {PAGE_LIMIT} from '../../stores/ProductsStore'
import {AdvertNotFoundWithDescription} from '../AdvertNotFound'
import CardsLoader from '../CardsLoader'
import {TGetOptions} from '../../types'

export interface ScrollableCardGroupInterface {
  products: AdvertiseListItemModel[]
  state: string
  className: string
  count?: number
  page?: number
  limit?: number
  disableScroll?: boolean
  disableVipWidth?: boolean
  fetchProducts?: () => void
  renderFooter?: (product: AdvertiseListItemModel) => any
  getOptions?: TGetOptions
}
const ScrollableCardGroup: FC<ScrollableCardGroupInterface> = ({
  products = [],
  state,
  count,
  page,
  fetchProducts,
  disableScroll,
  className,
  disableVipWidth,
  limit = PAGE_LIMIT,
  getOptions,
  renderFooter,
}) => {
  const hasMore = count > page * limit
  if (isEmpty(products) && state === 'pending') {
    return <CardsLoader className={className} show />
  }

  if (isEmpty(products)) {
    return (
      <div className='flex justify-center'>
        <AdvertNotFoundWithDescription />
      </div>
    )
  }

  return (
    <div className='flex flex-col m:items-start relative infinite-scroll-container'>
      <InfiniteScroll
        style={{overflow: 'visible'}}
        dataLength={products?.length}
        next={fetchProducts}
        hasMore={hasMore && !disableScroll}
        scrollThreshold='2000px'
        loader={<CardsLoader className={className} show />}>
        <div
          className={`grid grid-cols-2 xs:grid-cols-3 gap-2 s:gap-4 m:gap-x-8 m:gap-y-6 l:gap-4 mb-2 s:mb-4 ${className}`}>
          {products.map((p) => (
            <div
              className={p.isVip && !disableVipWidth ? 'col-span-2' : ''}
              key={p.hash}>
              <Card
                product={p}
                disableVipWidth={disableVipWidth}
                getOptions={getOptions}
                renderFooter={renderFooter}
              />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  )
}

export default ScrollableCardGroup
