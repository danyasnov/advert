import {FC, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {CACategoryModel} from 'front-api'
import {useRouter} from 'next/router'
import {useCategoriesStore} from '../../providers/RootStoreProvider'
import {FirstColItem, ThirdCol, SecondCol} from './columns'
import ImageWrapper from '../ImageWrapper'

interface Props {
  onHide: () => void
}
const CategoriesDesktopSelector: FC<Props> = observer(({onHide}) => {
  const {t} = useTranslation()
  const router = useRouter()
  const allProductsButton = {
    id: 0,
    name: t('ALL_ADVERTS'),
    items: [],
  } as CACategoryModel
  const withAllProductsButton = (
    products: Array<CACategoryModel> = [],
  ): Array<CACategoryModel> => {
    if (products.length) {
      return [allProductsButton, ...products]
    }
    return []
  }

  const {categoriesWithoutAll} = useCategoriesStore()
  const [activeCategory, setActiveCategory] = useState(categoriesWithoutAll[0])
  const [secondColumnActiveId, setSecondColumnActiveId] = useState(0)
  const [secondLevelItems, setSecondLevelItems] = useState(
    withAllProductsButton(categoriesWithoutAll[0]?.items ?? []),
  )
  const [thirdLevelItems, setThirdLevelItems] = useState([])

  return (
    <div
      className='absolute top-105px inset-x-0 z-10 bg-white divide-x divide-shadow-b
       border-t s:px-8 m:px-10 l:px-18 shadow-2xl category-selector-width m-auto
       grid grid-cols-3 m:grid-cols-category-selector-m l:grid-cols-category-selector-l'>
      <div className='pb-4'>
        {categoriesWithoutAll.map((c) => (
          <FirstColItem
            category={c}
            key={c.id}
            onClick={() => {
              onHide()
              router.push(`/all/all/${c.slug}`)
            }}
            isActive={activeCategory?.id === c.id}
            onMouseEnter={(cat) => {
              const secondItems = withAllProductsButton(cat.items)
              const thirdItems = withAllProductsButton(secondItems[0].items)
              setSecondLevelItems(secondItems)
              setSecondColumnActiveId(secondItems[0].id)
              setThirdLevelItems(thirdItems)
              setActiveCategory(cat)
            }}
          />
        ))}
      </div>
      <div className='pb-4'>
        <SecondCol
          activeId={secondColumnActiveId}
          items={secondLevelItems}
          onMouseEnter={(cat) => {
            setThirdLevelItems(withAllProductsButton(cat.items))
            setSecondColumnActiveId(cat.id)
          }}
        />
      </div>
      <div className='pb-4'>
        <ThirdCol items={thirdLevelItems} />
      </div>
      <div className='hidden m:block'>
        <div className='pl-12 pt-6 l:pl-6'>
          <ImageWrapper
            type={`/img/categories/${activeCategory?.slug}.jpg`}
            alt={activeCategory?.slug}
            width={288}
            height={288}
            className='rounded-12'
          />
        </div>
      </div>
    </div>
  )
})

export default CategoriesDesktopSelector
