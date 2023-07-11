import React, {FC, useEffect, useState} from 'react'
import {useTranslation} from 'next-i18next'
import IcKeyboardArrowLeft from 'icons/material/KeyboardArrowLeft.svg'
import {useWindowSize} from 'react-use'
import {useRouter} from 'next/router'
import {makeRequest} from '../api'
import LinkWrapper from './Buttons/LinkWrapper'
import Button from './Buttons/Button'
import {clearUrlFromQuery} from '../utils'

const PopularBrands: FC = () => {
  const [brands, setBrands] = useState([])
  const [showAllPopular, setShowAllPopular] = useState(false)
  const {t} = useTranslation()

  const router = useRouter()
  const {width} = useWindowSize()
  useEffect(() => {
    makeRequest({
      url: '/api/products',
      method: 'POST',
      data: {filter: {categoryId: 23, onlyAggregation: true}},
    }).then((productsData) => {
      setBrands(
        productsData.data.result.aggregatedFields.find((f) => f.id === 1991)
          .multiselects.top,
      )
    })
  }, [])
  const showButton = (
    <Button onClick={() => setShowAllPopular(!showAllPopular)}>
      <div className='flex w-full items-center'>
        <span className='text-body-16 text-primary-500 font-bold pr-1'>
          {t('ALL_BRANDS')}
        </span>
        <IcKeyboardArrowLeft
          className={`fill-current text-primary-500 h-6 w-6 ${
            showAllPopular ? 'rotate-90' : '-rotate-90'
          }`}
        />
      </div>
    </Button>
  )
  const brandsWithAds = brands.filter((o) => o.count)
  const brandsWithoutAds = brands.filter((o) => !o.count)
  const visibleBrandsCount = width < 1024 ? 15 : 23
  const brandsWithAdsSorted = [...brandsWithAds].sort(
    (a, b) => b.count - a.count,
  )
  const gridClassname = 'grid grid-cols-4 l:grid-cols-6 gap-y-3'
  const baseUrl = `${clearUrlFromQuery(
    router.asPath,
  )}/vehicles-cars?brands-of-cars=`
  if (brands.length === 0) return null
  return (
    <div className='flex flex-col space-y-6 mb-4'>
      <div className={gridClassname}>
        {(showAllPopular
          ? brandsWithAdsSorted
          : brandsWithAdsSorted.slice(0, visibleBrandsCount)
        ).map((b) => (
          <LinkWrapper
            href={`${baseUrl}${b.value}`}
            title={b.value}
            className='space-x-2'>
            <span className='text-body-16 text-greyscale-900'>{b.value}</span>
            <span className='text-body-16 text-greyscale-500'>{b.count}</span>
          </LinkWrapper>
        ))}
        {!showAllPopular && showButton}
      </div>
      {showAllPopular && (
        <div className='flex flex-col'>
          <span className=' text-body-18 font-medium text-greyscale-900 mb-6'>
            {t('BRANDS_WITHOUT_ADS')}
          </span>
          <div className={gridClassname}>
            {brandsWithoutAds.map((b) => (
              <LinkWrapper
                href={`${baseUrl}${b.value}`}
                title={b.value}
                className='space-x-2'>
                <span className='text-body-16 text-greyscale-900'>
                  {b.value}
                </span>
              </LinkWrapper>
            ))}
          </div>
        </div>
      )}
      {showAllPopular && showButton}
    </div>
  )
}
export default PopularBrands
