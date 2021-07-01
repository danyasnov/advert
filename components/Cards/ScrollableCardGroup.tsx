import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import InfiniteScroll from 'react-infinite-scroll-component'
import {useRouter} from 'next/router'
import {useProductsStore} from '../../providers/RootStoreProvider'
import Card from './Card'
import LoaderWrapper from '../LoaderWrapper'
import Loader from '../Loader'
import {PAGE_LIMIT} from '../../stores/ProductsStore'

const ScrollableCardGroup: FC = observer(() => {
  const router = useRouter()
  const {products, state, count, page, fetchProducts} = useProductsStore()
  const hasMore = count > page * PAGE_LIMIT

  return (
    <div className='flex flex-col items-center relative'>
      <InfiniteScroll
        dataLength={products.length}
        next={() => {
          fetchProducts({page: page + 1, isScroll: true})
        }}
        hasMore={hasMore}
        loader={
          <div className='flex justify-center'>
            <Loader />
          </div>
        }>
        <div
          className={`flex flex-col space-y-4 s:flex-row s:space-y-0 -mx-1 s:-mx-2 flex-wrap
      ${state === 'pending' ? 'opacity-40' : ''}`}>
          {products.map((p) => (
            <button
              type='button'
              onClick={() => router.push(p.url)}
              className='px-1 pb-2 s:px-2 s:pb-4'
              key={p.hash}>
              <Card product={p} />
            </button>
          ))}
        </div>
      </InfiniteScroll>
      <LoaderWrapper show={state === 'pending'} />
    </div>
  )
})

export default ScrollableCardGroup
