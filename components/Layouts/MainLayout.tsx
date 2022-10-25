import {FC, useEffect} from 'react'
import {observer} from 'mobx-react-lite'
import {useTranslation} from 'next-i18next'
import {useRouter} from 'next/router'
import {parseCookies} from 'nookies'
import {isEmpty} from 'lodash'
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
import {makeRequest} from '../../api'
import SecondaryButton from '../Buttons/SecondaryButton'
import OutlineButton from '../Buttons/OutlineButton'
import ImageWrapper from '../ImageWrapper'
import Banners from '../Banners'

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
      name: categoriesById[20]?.name,
      slug: categoriesById[20]?.slug,
      url: `${locationCodes}/${categoriesById[20]?.slug}`,
    },
    {
      data: {categoryId: 1},
      name: categoriesById[1]?.name,
      slug: categoriesById[1]?.slug,
      url: `${locationCodes}/${categoriesById[1]?.slug}`,
    },
    {
      data: {categoryId: 13},
      name: categoriesById[13]?.name,
      slug: categoriesById[13]?.slug,
      url: `${locationCodes}/${categoriesById[13]?.slug}`,
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
      <div className='py-8 m:flex min-h-1/2'>
        <div className='m:flex m:mx-12 m:justify-center m:w-full'>
          <main className='m:w-944px l:w-[1208px] '>
            {/* <Banners /> */}
            <CategoriesSlider />
            <div className='flex mt-12 m:grid m:grid-cols-main-m l:grid-cols-main-l m:gap-x-8 drop-shadow-card'>
              <div className='space-y-12 overflow-hidden m:overflow-visible'>
                {productsArr.map((p) => (
                  <ProductsSlider
                    products={otherProducts[p.slug] || []}
                    title={p.name}
                    rightContent={
                      <LinkWrapper
                        title={t('SEE_ALL')}
                        className='text-body-16 text-primary-500 font-bold'
                        href={p.url}>
                        {t('SEE_ALL')}
                      </LinkWrapper>
                    }
                  />
                ))}
                <div>
                  {!isEmpty(products) && (
                    <TitleWithSeparator
                      title={t('RECOMMENDATIONS_FOR_YOU')}
                      rightContent={
                        <LinkWrapper
                          title={t('SEE_ALL')}
                          className='text-body-16 text-primary-500 font-bold'
                          href={locationCodes}>
                          {t('SEE_ALL')}
                        </LinkWrapper>
                      }
                    />
                  )}
                  <div className='mx-4 s:mx-8 m:mx-0 flex flex-col items-center'>
                    <ScrollableCardGroup
                      products={products}
                      count={count}
                      page={page}
                      state={state}
                      disableScroll
                      hideNotFoundDescription
                      fetchProducts={() =>
                        fetchProducts({
                          page: page + 1,
                          isScroll: true,
                          query,
                        }).then(() => applyFilter())
                      }
                    />
                    {!isEmpty(products) && (
                      <LinkWrapper
                        title={t('SEE_ALL')}
                        className='text-body-16 text-primary-500 font-bold relative z-10'
                        href={locationCodes}>
                        <OutlineButton className='shadow-lg'>
                          {t('SEE_ALL')}
                        </OutlineButton>
                      </LinkWrapper>
                    )}
                  </div>
                </div>
              </div>
              <div className='hidden m:block w-[280px] h-[380px]'>
                {/* <ImageWrapper */}
                {/*  type='/img/promo.png' */}
                {/*  alt='promo' */}
                {/*  width={280} */}
                {/*  height={380} */}
                {/* /> */}
              </div>
            </div>
          </main>
        </div>
      </div>
    </HeaderFooterWrapper>
  )
})

export default MainLayout
