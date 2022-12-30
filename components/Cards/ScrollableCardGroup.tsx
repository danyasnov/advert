import {FC} from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import {isEmpty} from 'lodash'
import {AdvertiseListItemModel} from 'front-api'
import {toJS} from 'mobx'
import Card from './Card'
import {PAGE_LIMIT} from '../../stores/ProductsStore'
import {AdvertNotFound, AdvertNotFoundWithDescription} from '../AdvertNotFound'
import CardsLoader from '../CardsLoader'

interface Props {
  products: AdvertiseListItemModel[]
  state: string
  count?: number
  page?: number
  limit?: number
  disableScroll?: boolean
  enableFourthColumnForM?: boolean
  enableFiveColumnsForL?: boolean
  enableTwoColumnsForS?: boolean
  showMenu?: boolean
  disableVipWidth?: boolean
  fetchProducts?: () => void
}
const ScrollableCardGroup: FC<Props> = ({
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
                showMenu={showMenu}
              />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  )
}

export default ScrollableCardGroup
