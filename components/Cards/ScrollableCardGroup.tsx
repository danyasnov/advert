import {FC} from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import {isEmpty} from 'lodash'
import {AdvertiseListItemModel} from 'front-api'
import {useRouter} from 'next/router'
import Card from './Card'
import {PAGE_LIMIT} from '../../stores/ProductsStore'
import LinkWrapper from '../Buttons/LinkWrapper'
import {AdvertNotFound, AdvertNotFoundWithDescription} from '../AdvertNotFound'
import CardsLoader from '../CardsLoader'

interface Props {
  products: AdvertiseListItemModel[]
  state: string
  count: number
  page: number
  limit?: number
  hideNotFoundDescription?: boolean
  disableScroll?: boolean
  enableFourthColumnForM?: boolean
  fetchProducts: () => void
}
const ScrollableCardGroup: FC<Props> = ({
  products = [],
  state,
  count,
  page,
  fetchProducts,
  disableScroll,
  enableFourthColumnForM,
  limit = PAGE_LIMIT,
  hideNotFoundDescription,
}) => {
  const hasMore = count > page * limit
  if (isEmpty(products) && state === 'pending') {
    return <CardsLoader enableFourthColumnForM={enableFourthColumnForM} show />
  }
  if (isEmpty(products)) {
    return hideNotFoundDescription ? (
      <AdvertNotFound />
    ) : (
      <AdvertNotFoundWithDescription />
    )
  }
  if (
    typeof window !== 'undefined' &&
    window.location.hostname.includes('vooxee.com')
  )
    return null
  return (
    <div className='flex flex-col m:items-start relative p-24 -m-24'>
      <InfiniteScroll
        style={{overflow: 'visible'}}
        dataLength={products?.length}
        next={fetchProducts}
        hasMore={hasMore && !disableScroll}
        scrollThreshold='2000px'
        loader={
          <CardsLoader enableFourthColumnForM={enableFourthColumnForM} show />
        }>
        <div
          className={`grid grid-cols-2 xs:grid-cols-3 l:grid-cols-4 gap-2 s:gap-4 l:gap-4 mb-2 s:mb-4 ${
            enableFourthColumnForM ? 'm:grid-cols-3 m:gap-y-6' : ''
          }`}>
          {products.map((p) => (
            <Card product={p} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  )
}

export default ScrollableCardGroup
