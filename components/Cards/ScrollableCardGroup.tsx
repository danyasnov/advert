import {FC} from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import {isEmpty} from 'lodash'
import {AdvertiseListItemModel} from 'front-api'
import Card from './Card'
import LoaderWrapper from '../LoaderWrapper'
import Loader from '../Loader'
import {PAGE_LIMIT} from '../../stores/ProductsStore'
import LinkWrapper from '../Buttons/LinkWrapper'
import {AdvertNotFound, AdvertNotFoundWithDescription} from '../AdvertNotFound'

interface Props {
  products: AdvertiseListItemModel[]
  state: string
  count: number
  page: number
  limit?: number
  hideNotFoundDescription?: boolean
  enableFourthColumnForM?: boolean
  fetchProducts: () => void
}
const ScrollableCardGroup: FC<Props> = ({
  products = [],
  state,
  count,
  page,
  fetchProducts,
  enableFourthColumnForM,
  limit = PAGE_LIMIT,
  hideNotFoundDescription,
}) => {
  const hasMore = count > page * limit
  if (isEmpty(products)) {
    return hideNotFoundDescription ? (
      <AdvertNotFound />
    ) : (
      <AdvertNotFoundWithDescription />
    )
  }
  return (
    <div className='flex flex-col m:items-start relative'>
      <InfiniteScroll
        dataLength={products?.length}
        next={fetchProducts}
        hasMore={hasMore}
        loader={
          <div className='flex justify-center'>
            <Loader />
          </div>
        }>
        <div
          className={`grid grid-cols-2 xs:grid-cols-3 l:grid-cols-4 gap-2 s:gap-4 ${
            enableFourthColumnForM ? 'm:grid-cols-4 m:gap-x-15 m:gap-y-6' : ''
          }`}>
          {products.map((p) => (
            <LinkWrapper
              title={p.title}
              href={p.url}
              key={p.hash}
              target='_blank'>
              <Card product={p} />
            </LinkWrapper>
          ))}
        </div>
      </InfiniteScroll>
      <LoaderWrapper show={state === 'pending-scroll'} />
    </div>
  )
}

export default ScrollableCardGroup
