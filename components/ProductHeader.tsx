import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {
  useCategoriesStore,
  useGeneralStore,
  useProductsStore,
} from '../providers/RootStoreProvider'
import ProductInfoIcons from './ProductInfoIcons'
import ProductLike from './ProductLike'
import ProductMenu from './ProductMenu'
import LinkWrapper from './Buttons/LinkWrapper'

const ProductHeader: FC = observer(() => {
  const {product} = useProductsStore()
  const {categories} = useCategoriesStore()
  const {userHash} = useGeneralStore()
  const {t} = useTranslation()
  const path = getPath(
    categories,
    product.advert.categoryId,
    product.advert.rootCategoryId,
    t,
  )
  console.log('path', path)
  if (!product) return null
  const {advert, owner} = product
  const isUserAdv = userHash === owner.hash
  const isFree = advert.price === '0'
  return (
    <div className='mb-6'>
      {advert.state === 'sold' && (
        <div className='bg-sold-background rounded-lg	px-4 py-5 mb-4'>
          <span className='text-body-16 font-bold'>{t('ITEM_SOLD')}</span>
          <LinkWrapper
            className='text-body-16 text-brand-b1'
            href={`/user/${owner.hash}`}
            title={t('YOU_CAN_SEE_OTHER_ADS_OF_SELLER')}>
            {t('YOU_CAN_SEE_OTHER_ADS_OF_SELLER')}
          </LinkWrapper>
        </div>
      )}
      <div className='flex justify-between w-full items-center'>
        <div className=''>
          {path.map((p, index) => (
            <span
              key={p.id}
              className='text-body-14 font-normal text-greyscale-900 last:font-bold last:text-primary-500'>
              {p.name}
              {index + 1 !== path.length ? ' / ' : ''}
            </span>
          ))}
        </div>
        <div className='flex ml-4 space-x-2'>
          {isUserAdv && <ProductMenu product={product} />}
        </div>
      </div>
    </div>
  )
})

const getPath = (categories, categoryId, rootCategoryId, t) => {
  const root = categories.find((c) => rootCategoryId === c.id)
  return [{id: 0, name: t('CATEGORIES')}, root, ...tree(root, categoryId)]
}

const tree = (struct, id) => {
  if (struct.id === id) {
    return []
  }
  if (struct.items.length) {
    for (let i = 0; i < struct.items.length; i++) {
      const path = tree(struct.items[i], id)
      if (path !== null) {
        path.unshift(struct.items[i])
        return path
      }
    }
  }
  return null
}

export default ProductHeader
