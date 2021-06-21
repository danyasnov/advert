import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import InfiniteScroll from 'react-infinite-scroll-component'
import {toJS} from 'mobx'
import {useProductsStore} from '../../providers/RootStoreProvider'
import Card from './Card'
import LoaderWrapper from '../LoaderWrapper'
import Loader from '../Loader'

const ScrollableCardGroup: FC = observer(() => {
  const {products, state, count, page, fetchProducts, filter} =
    useProductsStore()
  const hasMore = count > page * 10

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
        }
        endMessage={<h4>Yay! You have seen it all</h4>}>
        <div
          className={`flex flex-col space-y-4 s:flex-row s:space-y-0  mb-4 flex-wrap
      ${state === 'pending' ? 'opacity-40' : ''}`}>
          {products.map((p) => (
            <div className='px-1 py-2' key={p.hash}>
              <Card product={p} />
            </div>
          ))}
        </div>
      </InfiniteScroll>

      <LoaderWrapper show={state === 'pending'} />
      {/* <div className='grid grid-cols-2 gap-2'> */}
      {/*  {topProducts.map((p) => ( */}
      {/*    <Card product={p} variant='top' key={p.hash} /> */}
      {/*  ))} */}
      {/* </div> */}
    </div>
  )
})

export default ScrollableCardGroup
