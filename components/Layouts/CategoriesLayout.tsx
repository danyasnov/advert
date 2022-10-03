import {FC, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import ScrollableCardGroup from '../Cards/ScrollableCardGroup'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import CategoryHeader from '../CategoryHeader'
import FilterForm from '../CategoryFilter/FilterForm'
import {
  useCategoriesStore,
  useCountriesStore,
  useProductsStore,
} from '../../providers/RootStoreProvider'
import {getQueryValue} from '../../helpers'
import MetaTags from '../MetaTags'

const CategoriesLayout: FC = observer(() => {
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
      <MetaTags title={title} description={description} />
      <div className='bg-white px-4 s:px-8 flex min-h-1/2'>
        <div className='m:flex m:space-x-12 l:space-x-6 m:mx-auto s:w-full justify-center w-full'>
          <main className='w-full relative '>
            <CategoryHeader />
            <FilterForm />
            <div className='drop-shadow-card'>
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
            </div>
          </main>
        </div>
      </div>
    </HeaderFooterWrapper>
  )
})

export default CategoriesLayout
