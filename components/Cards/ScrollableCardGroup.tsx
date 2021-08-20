import {FC} from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import {isEmpty} from 'lodash'
import {useTranslation} from 'next-i18next'
import {AdvertiseListItemModel} from 'front-api'
import Card from './Card'
import LoaderWrapper from '../LoaderWrapper'
import Loader from '../Loader'
import {PAGE_LIMIT} from '../../stores/ProductsStore'
import LinkWrapper from '../Buttons/LinkWrapper'

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
  const {t} = useTranslation()
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
          className={`grid grid-cols-2 xs:grid-cols-3 -mx-1 s:mt-4 s:flex s:-mx-2 m:-mx-2 s:flex-wrap s:justify-start
      ${state === 'pending' ? 'opacity-40' : ''}`}>
          {isEmpty(products) ? (
            <span className='text-black-b text-body-2 mx-2'>
              {t('ADVERT_NOT_FOUND')}
            </span>
          ) : (
            products.map((p) => (
              <LinkWrapper
                title={p.title}
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
}

export default ScrollableCardGroup
