import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import InfiniteScroll from 'react-infinite-scroll-component'
import {useProductsStore} from '../../providers/RootStoreProvider'
import Card from './Card'
import LoaderWrapper from '../LoaderWrapper'

const ScrollableCardGroup: FC = observer(() => {
  const {products, state, count, page, fetchProducts} = useProductsStore()
  // const ids = useSelector(getAllNewsExceptFirstTwo())
  // const totalLength = useSelector(getTotalNewsLength())
  // const currentPage = useSelector(getCurrentPage())
  const hasMore = count > page * 10
  // console.log(count, page)

  return (
    <div className='flex flex-col items-center relative'>
      <InfiniteScroll
        dataLength={products.length}
        next={() => {
          fetchProducts({page: page + 1})
        }}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
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
