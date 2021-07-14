import {FC, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {CACategoryModel} from 'front-api'
import {useCategoriesStore} from '../../providers/RootStoreProvider'
import {FirstColItem, ThirdCol, SecondCol} from './columns'
import ImageWrapper from '../ImageWrapper'
import {getLocationCodes} from '../../helpers'

const CategoriesDesktopSelector: FC = observer(() => {
  const {t} = useTranslation()
  const allProductsButton = {
    id: 0,
    name: t('SHOW_ALL_ADVERTS'),
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
  const [activeCategory, setActiveCategory] = useState<CACategoryModel>(
    categoriesWithoutAll[0],
  )
  const [secondColumnActiveCategory, setSecondColumnActiveCategory] = useState<
    CACategoryModel | undefined
  >()
  const [secondLevelItems, setSecondLevelItems] = useState(
    withAllProductsButton(categoriesWithoutAll[0]?.items ?? []),
  )
  const [thirdLevelItems, setThirdLevelItems] = useState([])

  return (
    <div
      className='absolute top-105px inset-x-0 z-10 bg-white divide-x divide-shadow-b
       border-t s:px-8 m:px-10 l:px-18 shadow-xl category-selector-width m-auto
       grid grid-cols-3 m:grid-cols-category-selector-m l:grid-cols-category-selector-l'>
      <div className='pb-4'>
        {categoriesWithoutAll.map((c) => (
          <FirstColItem
            category={c}
            key={c.id}
            href={`/${getLocationCodes()}/${c.slug}`}
            isActive={activeCategory?.id === c.id}
            onMouseEnter={(cat) => {
              const secondItems = withAllProductsButton(cat.items)
              const thirdItems = withAllProductsButton(secondItems[0].items)
              setSecondLevelItems(secondItems)
              setSecondColumnActiveCategory(secondItems[0])
              setThirdLevelItems(thirdItems)
              setActiveCategory(cat)
            }}
          />
        ))}
      </div>
      <div className='pb-4'>
        <SecondCol
          activeCategory={activeCategory}
          activeId={secondColumnActiveCategory?.id}
          items={secondLevelItems}
          onMouseEnter={(cat) => {
            setThirdLevelItems(withAllProductsButton(cat.items))
            setSecondColumnActiveCategory(cat)
          }}
        />
      </div>
      <div className='pb-4'>
        <ThirdCol
          items={thirdLevelItems}
          activeCategory={activeCategory}
          secondActiveCategory={secondColumnActiveCategory}
        />
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
