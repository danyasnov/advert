import {FC} from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import {isEmpty} from 'lodash'
import {AdvertiseListItemModel} from 'front-api'
import Card from './Card'
import {PAGE_LIMIT} from '../../stores/ProductsStore'
import {AdvertNotFoundWithDescription} from '../AdvertNotFound'
import CardsLoader from '../CardsLoader'

export interface ScrollableCardGroupInterface {
  products: AdvertiseListItemModel[]
  state: string
  count?: number
  page?: number
  limit?: number
  disableScroll?: boolean
  enableFourthColumnForM?: boolean
  enableFiveColumnsForL?: boolean
  enableTwoColumnsForS?: boolean
  disableVipWidth?: boolean
  fetchProducts?: () => void
  getOptions?: ({setShowDeactivateModal, hash, state}) => any[]
  renderFooter?: (product: AdvertiseListItemModel) => any
}
const ScrollableCardGroup: FC<ScrollableCardGroupInterface> = ({
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
  getOptions,
  renderFooter,
}) => {
  const hasMore = count > page * limit
  if (isEmpty(products) && state === 'pending') {
    return (
      <CardsLoader
        enableFourthColumnForM={enableFourthColumnForM}
        enableFiveColumnsForL={enableFiveColumnsForL}
        enableTwoColumnsForS={enableTwoColumnsForS}
        show
      />
    )
  }

  if (isEmpty(products)) {
    return (
      <div className='flex justify-center'>
        <AdvertNotFoundWithDescription />
      </div>
    )
  }

  return (
    <div className='flex flex-col m:items-start relative'>
      <InfiniteScroll
        style={{overflow: 'visible'}}
        dataLength={products?.length}
        next={fetchProducts}
        hasMore={hasMore && !disableScroll}
        scrollThreshold='2000px'
        loader={
          <CardsLoader
            enableFourthColumnForM={enableFourthColumnForM}
            enableFiveColumnsForL={enableFiveColumnsForL}
            enableTwoColumnsForS={enableTwoColumnsForS}
            show
          />
        }>
        <div
          className={`grid grid-cols-2 xs:grid-cols-3 m:gap-y-6 gap-2 s:gap-4 l:gap-4 mb-2 s:mb-4 ${
            enableTwoColumnsForS ? 's:grid-cols-2' : ''
          } ${enableFourthColumnForM ? 'm:grid-cols-4' : 'm:grid-cols-3'} ${
            enableFiveColumnsForL ? 'l:grid-cols-5' : 'l:grid-cols-4'
          }`}>
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
