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
      className='absolute top-[148px] inset-x-0 z-10 shadow-xl
       category-selector-width m-auto grid grid-cols-4
       m:grid-cols-category-selector-m l:grid-cols-category-selector-l
       l:justify-center categories-bg'>
      <div className='bg-greyscale-50 s:pl-8 m:pl-10 l:pl-18 overflow-y-scroll scrollbar h-[532px]'>
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
      <div className='border-r border-greyscale-100 overflow-y-scroll h-[532px] scrollbar'>
        <Col
          urlPath={activeCategory?.slug}
          activeId={secondColumnActiveCategory?.id}
          items={secondLevelItems}
          onMouseEnter={handleHoverSecondCol}
        />
      </div>
      <div
        className={
          thirdLevelItems.length
            ? 'border-r border-greyscale-100 overflow-y-scroll h-[532px] scrollbar'
            : ''
        }>
        <Col
          items={thirdLevelItems}
          urlPath={`${activeCategory?.slug}/${secondColumnActiveCategory?.slug}`}
          activeId={thirdColumnActiveCategory?.id}
          onMouseEnter={handleHoverThirdCol}
        />
      </div>
      <div className='s:pr-8 m:pr-10 l:pr-18 overflow-y-scroll h-[532px] scrollbar'>
        <Col
          items={fourthLevelItems}
          urlPath={`${activeCategory?.slug}/${secondColumnActiveCategory?.slug}/${thirdColumnActiveCategory?.slug}`}
          activeId={fourthColumnActiveCategory?.id}
          onMouseEnter={handleHoverFourthCol}
        />
      </div>
    </div>
  )
})

export default CategoriesDesktopSelector
