import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {toJS} from 'mobx'
import {useRouter} from 'next/router'
import {
  useCategoriesStore,
  useGeneralStore,
  useProductsStore,
} from '../providers/RootStoreProvider'
import ProductInfoIcons from './ProductInfoIcons'
import ProductLike from './ProductLike'
import ProductMenu from './ProductMenu'
import LinkWrapper from './Buttons/LinkWrapper'
import Button from './Buttons/Button'
import ProductStatus from './AdvertWizard/ProductStatus'

const ProductHeader: FC = observer(() => {
  const {push} = useRouter()
  const {product} = useProductsStore()
  const {categories} = useCategoriesStore()
  const {userHash, locationCodes} = useGeneralStore()
  const {t} = useTranslation()
  const path = getPath(
    categories,
    product.advert.categoryId,
    product.advert.rootCategoryId,
    t,
  )
  if (!product) return null
  const {advert, owner} = product
  const isUserAdv = userHash === owner.hash
  return (
    <div className='mb-6'>
      <div className='flex justify-between w-full items-center mb-6'>
        <div className='flex flex-wrap'>
          {path.map((p, index) => {
            const itemClassName =
              'text-body-14 font-normal text-greyscale-900 last:font-bold last:text-primary-500 whitespace-nowrap mr-1 last:mr-0 '

            return (
              <LinkWrapper
                key={p.id}
                className={itemClassName}
                href={`/${locationCodes}/${path
                  .slice(0, index + 1)
                  .map((c) => c.slug)
                  .join('/')}`}
                title={p.name}>
                <span>
                  {p.name}
                  {index + 1 !== path.length ? ' /' : ''}
                </span>
              </LinkWrapper>
            )
          })}
        </div>
        <div className='flex ml-4 space-x-2'>
          {isUserAdv && <ProductMenu product={product} />}
        </div>
      </div>
      <ProductStatus product={product} />
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
