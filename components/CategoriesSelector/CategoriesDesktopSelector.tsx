import {FC, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {CACategoryModel} from 'front-api'
import {isEmpty} from 'lodash'
import {useCategoriesStore} from '../../providers/RootStoreProvider'
import {FirstColItem, Col} from './columns'
import {getLocationCodes} from '../../helpers'
import ImageWrapper from '../ImageWrapper'

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
  const [thirdColumnActiveCategory, setThirdColumnActiveCategory] = useState<
    CACategoryModel | undefined
  >()
  const [fourthColumnActiveCategory, setFourthColumnActiveCategory] = useState<
    CACategoryModel | undefined
  >()
  const [secondLevelItems, setSecondLevelItems] = useState(
    withAllProductsButton(categoriesWithoutAll[0]?.items ?? []),
  )
  const [thirdLevelItems, setThirdLevelItems] = useState([])
  const [fourthLevelItems, setFourthLevelItems] = useState([])
  const handleHoverFirstCol = (cat: CACategoryModel) => {
    const secondItems = withAllProductsButton(cat.items)
    setActiveCategory(cat)
    setSecondLevelItems(secondItems)
    setSecondColumnActiveCategory(undefined)
    setThirdColumnActiveCategory(undefined)
    setFourthColumnActiveCategory(undefined)
    setThirdLevelItems([])
    setFourthLevelItems([])
  }
  const handleHoverSecondCol = (cat) => {
    setThirdLevelItems(withAllProductsButton(cat.items))
    setSecondColumnActiveCategory(cat)
    setThirdColumnActiveCategory(undefined)
    setFourthColumnActiveCategory(undefined)
    setFourthLevelItems([])
  }
  const handleHoverThirdCol = (cat) => {
    setFourthLevelItems(withAllProductsButton(cat.items))
    setThirdColumnActiveCategory(cat)
    setFourthColumnActiveCategory(undefined)
  }
  const handleHoverFourthCol = (cat) => {
    setFourthColumnActiveCategory(cat)
  }

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
            onMouseEnter={handleHoverFirstCol}
          />
        ))}
      </div>
      <div className='pb-4'>
        <Col
          urlPath={activeCategory?.slug}
          activeId={secondColumnActiveCategory?.id}
          items={secondLevelItems}
          onMouseEnter={handleHoverSecondCol}
        />
      </div>
      <div className='pb-4'>
        <Col
          items={thirdLevelItems}
          urlPath={`${activeCategory?.slug}/${secondColumnActiveCategory?.slug}`}
          activeId={thirdColumnActiveCategory?.id}
          onMouseEnter={handleHoverThirdCol}
        />
      </div>
      {!isEmpty(fourthLevelItems) && (
        <div className='pb-4 hidden m:block'>
          <Col
            items={fourthLevelItems}
            urlPath={`${activeCategory?.slug}/${secondColumnActiveCategory?.slug}/${thirdColumnActiveCategory?.slug}`}
            activeId={fourthColumnActiveCategory?.id}
            onMouseEnter={handleHoverFourthCol}
          />
        </div>
      )}

      {isEmpty(fourthLevelItems) && (
        <div className='hidden m:block'>
          <div className='pl-12 pt-6 l:pl-6'>
            <ImageWrapper
              key={activeCategory?.slug}
              type={`/img/categories/${activeCategory?.slug}.jpg`}
              alt={activeCategory?.slug}
              width={288}
              height={288}
              className='rounded-12'
            />
          </div>
        </div>
      )}
    </div>
  )
})

export default CategoriesDesktopSelector
