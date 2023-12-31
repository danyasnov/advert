import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {
  ArrowLeftSquare,
  Delete,
  Edit,
  TickSquare,
  TimeCircle,
} from 'react-iconly'
import {size} from 'lodash'
import {toast} from 'react-toastify'
import {
  useCategoriesStore,
  useGeneralStore,
  useProductsStore,
} from '../providers/RootStoreProvider'
import ProductMenu from './ProductMenu'
import LinkWrapper from './Buttons/LinkWrapper'
import Button from './Buttons/Button'
import ProductStatus from './AdvertWizard/ProductStatus'
import {makeRequest} from '../api'
import {TGetOptions} from '../types'

const ProductHeader: FC<{getOptions: TGetOptions}> = observer(
  ({getOptions}) => {
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
      <div className='mb-5'>
        <div className='flex flex-col justify-between w-full'>
          <div className='flex flex-wrap s:mb-5'>
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
          <div className='w-full hidden s:flex'>
            {isUserAdv && (
              <ProductMenu
                getOptions={getOptions}
                hash={advert.hash}
                title={advert.title}
                images={advert.images}
                listRender={(options, setShowPopup) => (
                  <div className='flex w-full truncate'>
                    {/* eslint-disable-next-line no-shadow */}
                    {options.map(({title, onClick, icon, className}, index) => (
                      <Button
                        // eslint-disable-next-line react/no-array-index-key
                        key={index}
                        className={`text-greyscale-900 hover:text-primary-500 text-body-14 font-normal xs:mr-5 m:mr-2 ${
                          size(options) > 2
                            ? 'max-w-[115px] mr-1 s:mr-1'
                            : 'max-w-[150px] mr-2 s:mr-2'
                        } xs:max-w-full`}
                        onClick={(e) => {
                          e.preventDefault()
                          onClick()
                          setShowPopup(false)
                        }}>
                        <div className='flex items-center justify-start w-full'>
                          <div className='w-4 h-4 mr-2'>{!!icon && icon}</div>
                          <span className={`truncate ${className || ''}`}>
                            {t(title)}
                          </span>
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              />
            )}
          </div>
        </div>
        <ProductStatus product={product} />
      </div>
    )
  },
)

const getPath = (categories, categoryId, rootCategoryId, t) => {
  if (!categoryId || !rootCategoryId) return []
  const root = categories.find((c) => rootCategoryId === c.id)
  return [{id: 0, name: t('CATEGORIES')}, root, ...tree(root, categoryId)]
}

const tree = (struct, id) => {
  if (!struct) return []

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
