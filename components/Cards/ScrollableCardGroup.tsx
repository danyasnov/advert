import {FC} from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import {isEmpty} from 'lodash'
import {AdvertiseListItemModel} from 'front-api'
import Card from './Card'
import LoaderWrapper from '../LoaderWrapper'
import Loader from '../Loader'
import {PAGE_LIMIT} from '../../stores/ProductsStore'
import LinkWrapper from '../Buttons/LinkWrapper'
import AdvertNotFound from '../AdvertNotFound'

interface Props {
  products: AdvertiseListItemModel[]
  state: string
  count: number
  page: number
  limit?: number
  fetchProducts: () => void
}
const ScrollableCardGroup: FC<Props> = ({
  products = [],
  state,
  count,
  page,
  fetchProducts,
  limit = PAGE_LIMIT,
}) => {
  const hasMore = count > page * limit
  if (isEmpty(products)) {
    return <AdvertNotFound />
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
        <div className='grid grid-cols-2 xs:grid-cols-3 '>
          {products.map((p) => (
            <LinkWrapper
              title={p.title}
              href={p.url}
              key={p.hash}
              target='_blank'
              className='px-1 pb-2 s:px-2 s:pb-4'>
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
