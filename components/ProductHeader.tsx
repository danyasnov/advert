import {FC} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import IcMoreHoriz from 'icons/material/MoreHoriz.svg'
import {ArrowLeftSquare, Delete, Edit, TickSquare} from 'react-iconly'
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

const ProductHeader: FC = observer(() => {
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
  const router = useRouter()
  if (!product) return null
  const {advert, owner} = product
  const isUserAdv = userHash === owner.hash
  const getOptions = ({setShowDeactivateModal}) => {
    const remove = {
      title: 'REMOVE',
      icon: <Delete size={16} filled />,
      onClick: () => {
        makeRequest({
          url: `/api/delete-adv`,
          method: 'post',
          data: {
            hash: advert.hash,
          },
        }).then(() => {
          router.push(`/user/${owner.hash}`)
        })
      },
    }
    const publish = {
      title: 'PUBLISH',
      icon: <TickSquare size={16} filled />,
      onClick: () => {
        makeRequest({
          url: `/api/publish-adv`,
          method: 'post',
          data: {
            hash: advert.hash,
          },
        }).then(() => {
          router.push(`/user/${owner.hash}`)
        })
      },
    }
    const deactivate = {
      title: 'REMOVE_FROM_SALE',
      icon: <ArrowLeftSquare size={16} filled />,
      onClick: () => {
        setShowDeactivateModal(true)
      },
      cb: () => {
        router.push(`/user/${owner.hash}`)
      },
    }
    const edit = {
      title: 'EDIT_AD',
      icon: <Edit size={16} filled />,
      onClick: () => {
        router.push(`/advert/edit/${advert.hash}`)
      },
    }
    const items = []

    if (['active', 'archived', 'blocked', 'draft'].includes(advert.state)) {
      items.push(edit)
    }
    if (
      ['archived', 'sold', 'blockedPermanently', 'blocked', 'draft'].includes(
        advert.state,
      )
    ) {
      if (advert.state === 'archived') {
        items.push(publish)
      }
      items.push(remove)
    }
    if (advert.state === 'active') {
      items.push(deactivate)
    }
    return items
  }

  return (
    <div className='mb-6'>
      <div className='flex flex-col justify-between w-full mb-6'>
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
        <div className='flex ml-4 space-x-2 relative'>
          {isUserAdv && (
            <ProductMenu
              getOptions={getOptions}
              hash={advert.hash}
              title={advert.title}
              listRender={(options, setShowPopup) => (
                <div className='absolute right-0 top-8 bg-white shadow-2xl rounded-lg w-40 overflow-hidden z-10'>
                  {/* eslint-disable-next-line no-shadow */}
                  {options.map(({title, onClick, icon}, index) => (
                    <Button
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      className='px-5 py-4 text-greyscale-900 hover:text-primary-500 w-full text-body-12 font-normal'
                      onClick={(e) => {
                        e.preventDefault()
                        onClick()
                        setShowPopup(false)
                      }}>
                      <div className='flex items-center justify-start w-full'>
                        <div className='w-4 h-4 mr-2'>{!!icon && icon}</div>
                        <span className='truncate'>{t(title)}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              )}
              iconRender={() => (
                <IcMoreHoriz
                  className='fill-current text-black-c'
                  width={24}
                  height={24}
                />
              )}
              images={advert.images}
            />
          )}
        </div>
      </div>
      <ProductStatus product={product} />
    </div>
  )
})

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
