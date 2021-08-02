import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import InfiniteScroll from 'react-infinite-scroll-component'
import {isEmpty} from 'lodash'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {useProductsStore} from '../../providers/RootStoreProvider'
import Card from './Card'
import LoaderWrapper from '../LoaderWrapper'
import Loader from '../Loader'
import {PAGE_LIMIT} from '../../stores/ProductsStore'
import LinkWrapper from '../Buttons/LinkWrapper'

const ScrollableCardGroup: FC = observer(() => {
  const {products, state, count, page, fetchProducts} = useProductsStore()
  const hasMore = count > page * PAGE_LIMIT
  const {query} = useRouter()
  const {t} = useTranslation()
  return (
    <div className='flex flex-col m:items-center relative'>
      <InfiniteScroll
        dataLength={products.length}
        next={() => {
          fetchProducts({page: page + 1, isScroll: true, query})
        }}
        hasMore={hasMore}
        loader={
          <div className='flex justify-center'>
            <Loader />
          </div>
        }>
        <div
          className={`flex -mx-1 s:-mx-2 s:mt-4 flex-wrap justify-center
      ${state === 'pending' ? 'opacity-40' : ''}`}>
          {isEmpty(products) ? (
            <span className='text-black-b text-body-2 mx-2'>
              {t('ADVERT_NOT_FOUND')}
            </span>
          ) : (
            products.map((p) => (
              <LinkWrapper
                href={p.url}
                key={p.hash}
                target='_blank'
                className='px-1 pb-2 s:px-2 s:pb-4'>
                <Card product={p} />
              </LinkWrapper>
            ))
          )}
        </div>
      </InfiniteScroll>
      <LoaderWrapper show={state === 'pending'} />
    </div>
  )
})

export default ScrollableCardGroup
