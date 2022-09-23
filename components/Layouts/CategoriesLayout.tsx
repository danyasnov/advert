import {FC, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {toJS} from 'mobx'
import CategoryFilter from '../CategoryFilter'
import ScrollableCardGroup from '../Cards/ScrollableCardGroup'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import CategoryHeader from '../CategoryHeader'
import FilterForm from '../CategoryFilter/FilterForm'
import SortSelect from '../SortSelect'
import QuickCategories from '../QuickCategories'
import {
  useCategoriesStore,
  useCountriesStore,
  useProductsStore,
} from '../../providers/RootStoreProvider'
import {getQueryValue} from '../../helpers'
import MetaTags from '../MetaTags'
import SearchFilters from '../SearchFilters'

const CategoriesLayout: FC = observer(() => {
  const [showFilter, setShowFilter] = useState(false)
  const {query} = useRouter()
  const {products, state, count, page, fetchProducts, applyFilter} =
    useProductsStore()
  const citySlug: string = getQueryValue(query, 'city')
  const {categoryData, categories} = useCategoriesStore()
  const {citiesBySlug} = useCountriesStore()
  const cityTitle: string = citiesBySlug[citySlug]?.word
  const {t} = useTranslation()
  const title = categoryData
    ? // @ts-ignore
      categoryData.metaTitle.replace('#LOCATION#', cityTitle || '')
    : t('LOCATION_PAGE_TITLE', {location: cityTitle || ''})
  const description = categoryData
    ? // @ts-ignore
      categoryData.metaDescription.replace('#LOCATION#', cityTitle || '')
    : t('MAIN_PAGE_DESCRIPTION')
  return (
    <HeaderFooterWrapper>
      <MetaTags title={title} description={description} />
      <div className='bg-white px-4 s:px-8 flex min-h-1/2'>
        <div className='m:flex m:space-x-12 l:space-x-6 m:mx-auto s:w-full justify-center w-full'>
          <main className='m:w-608px l:w-896px relative'>
            <CategoryHeader />
            <FilterForm />

            <ScrollableCardGroup
              products={products}
              count={count}
              page={page}
              state={state}
              fetchProducts={() => {
                fetchProducts({page: page + 1, isScroll: true, query}).then(
                  () => applyFilter(),
                )
              }}
            />
          </main>
        </div>
      </div>
    </HeaderFooterWrapper>
  )
})

export default CategoriesLayout
