import {FC, useState} from 'react'
import Head from 'next/head'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
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

const CategoriesLayout: FC = observer(() => {
  const [showFilter, setShowFilter] = useState(false)
  const {query} = useRouter()
  const {products, state, count, page, fetchProducts, applyFilter} =
    useProductsStore()
  const citySlug: string = getQueryValue(query, 'city')
  const {categoryData} = useCategoriesStore()
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
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
      </Head>
      <div className='bg-white px-4 s:px-8 flex'>
        <div className='m:flex m:space-x-12 l:space-x-6 m:mx-auto s:w-full justify-center w-full'>
          <main className='m:w-608px l:w-896px relative'>
            <div className='flex s:hidden'>
              <QuickCategories />
            </div>
            <CategoryHeader
              setShowFilter={setShowFilter}
              showFilter={showFilter}
            />
            {!showFilter && (
              <div className='border-t border-shadow-b'>
                <div className='s:hidden w-48 my-6'>
                  <SortSelect id='mobile-sort' />
                </div>
                <ScrollableCardGroup
                  products={products}
                  count={count}
                  page={page}
                  state={state}
                  fetchProducts={() =>
                    fetchProducts({page: page + 1, isScroll: true, query}).then(
                      () => applyFilter(),
                    )
                  }
                />
              </div>
            )}
            {showFilter && (
              <div className='s:px-0 s:-mx-0 border-t pb-4 border-shadow-b pt-6 w-full'>
                <FilterForm setShowFilter={setShowFilter} />
              </div>
            )}
          </main>
          <aside className='hidden m:block w-72 mt-8'>
            <CategoryFilter />
          </aside>
        </div>
      </div>
    </HeaderFooterWrapper>
  )
})

export default CategoriesLayout
