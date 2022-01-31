import {FC, useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {parseCookies} from 'nookies'
import {toJS} from 'mobx'
import CategoriesSlider from '../CategoriesSlider'
import ProductsSlider from '../Cards/ProductsSlider'
import HeaderFooterWrapper from './HeaderFooterWrapper'
import {
  useCategoriesStore,
  useGeneralStore,
  useProductsStore,
} from '../../providers/RootStoreProvider'
import ScrollableCardGroup from '../Cards/ScrollableCardGroup'
import LinkWrapper from '../Buttons/LinkWrapper'
import TitleWithSeparator from '../TitleWithSeparator'
import Button from '../Buttons/Button'
import MetaTags from '../MetaTags'
import {SerializedCookiesState} from '../../types'
import useScrollDirection from '../../hooks/useScrollDirection'
import {makeRequest} from '../../api'
import SecondaryButton from '../Buttons/SecondaryButton'

const MainLayout: FC = observer(() => {
  // keep showCookiesWarn to force rerender layout
  const {locationCodes, setShowLogin, user} = useGeneralStore()
  const {categoriesById} = useCategoriesStore()
  const cookies: SerializedCookiesState = parseCookies()
  const {
    otherProducts,
    products,
    state,
    count,
    page,
    fetchProducts,
    applyFilter,
    setProducts,
    resetFilter,
    setFilter,
  } = useProductsStore()
  const {query, push} = useRouter()
  const {t} = useTranslation()
  const productsArr = [
    {
      data: {categoryId: 20},
      name: categoriesById[20].name,
      slug: categoriesById[20].slug,
      url: `${locationCodes}/${categoriesById[20].slug}`,
    },
    {
      data: {categoryId: 1},
      name: categoriesById[1].name,
      slug: categoriesById[1].slug,
      url: `${locationCodes}/${categoriesById[1].slug}`,
    },
    {
      data: {categoryId: 13},
      name: categoriesById[13].name,
      slug: categoriesById[13].slug,
      url: `${locationCodes}/${categoriesById[13].slug}`,
    },
  ]
  useEffect(() => {
    const initProducts = async () => {
      resetFilter()
      setFilter({categoryId: null})
      fetchProducts().then(applyFilter)
      const url = '/api/products'

      const promises = productsArr.map((p) =>
        makeRequest({
          url,
          data: {filter: p.data, limit: 20},
          method: 'post',
        }),
      )
      Promise.all(promises).then((res) => {
        setProducts(res[0].data?.result?.data || [], productsArr[0].slug)
        setProducts(res[1].data?.result?.data || [], productsArr[1].slug)
        setProducts(res[2].data?.result?.data || [], productsArr[2].slug)
      })
    }
    initProducts()
  }, [
    cookies.countryId,
    cookies.searchLocation,
    cookies.searchRadius,
    cookies.searchBy,
    cookies.cityId,
    cookies.regionId,
  ])

  return (
    <HeaderFooterWrapper>
      <MetaTags
        title={t('SITE_MAIN_PAGE_META_TITLE')}
        description={t('MAIN_PAGE_DESCRIPTION')}
      />
      {cookies.cookieAccepted && (
        <Button
          className={`s:hidden fixed left-1/2 -translate-x-1/2 w-40 z-10 bottom-0 `}>
          <div className='mb-2'>
            <Button
              className='flex h-10 bg-brand-a1 text-body-2 px-3.5 py-3 rounded-2 whitespace-nowrap'
              onClick={() => {
                if (!user) {
                  setShowLogin(true)
                }
                makeRequest({
                  url: '/api/save-draft',
                  method: 'POST',
                  data: {
                    draft: {},
                  },
                }).then((res) => {
                  push(`/advert/create/${res.data.result.hash}`)
                })
              }}>
              <span className='capitalize-first text-white'>{t('NEW_AD')}</span>
            </Button>
          </div>
        </Button>
      )}
      <div className='bg-black-e py-8 m:flex min-h-1/2'>
        <div className='m:flex m:space-x-12 l:space-x-6 m:mx-auto'>
          <main className='m:w-944px l:w-896px space-y-12'>
            <CategoriesSlider />
            {productsArr.map((p) => (
              <ProductsSlider
                products={otherProducts[p.slug] || []}
                title={p.name}
                rightContent={
                  <LinkWrapper
                    title={t('SEE_ALL')}
                    className='text-body-3 text-brand-b1'
                    href={p.url}>
                    {t('SEE_ALL')}
                  </LinkWrapper>
                }
              />
            ))}
            <div>
              <TitleWithSeparator
                title={t('RECOMMENDATIONS_FOR_YOU')}
                rightContent={
                  <LinkWrapper
                    title={t('SEE_ALL')}
                    className='text-body-3 text-brand-b1'
                    href={locationCodes}>
                    {t('SEE_ALL')}
                  </LinkWrapper>
                }
              />
              <div className='mx-4 s:mx-8 m:mx-0 flex flex-col items-center'>
                <ScrollableCardGroup
                  products={products}
                  count={count}
                  enableFourthColumnForM
                  page={page}
                  state={state}
                  disableScroll
                  hideNotFoundDescription
                  fetchProducts={() =>
                    fetchProducts({page: page + 1, isScroll: true, query}).then(
                      () => applyFilter(),
                    )
                  }
                />
                <LinkWrapper
                  title={t('SEE_ALL')}
                  className='text-body-3 text-brand-b1'
                  href={locationCodes}>
                  <SecondaryButton>{t('SEE_ALL')}</SecondaryButton>
                </LinkWrapper>
              </div>
            </div>
          </main>
        </div>
      </div>
    </HeaderFooterWrapper>
  )
})

export default MainLayout
